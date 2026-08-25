import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';
import webpush from 'web-push';
import {
  PushSubscription,
  PushSubscriptionDocument,
} from '../schemas/push-subscription.schema';
import { SubscribePushDto } from './dto/push.dto';

export interface SendMailInput {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

export interface AdminActivityPush {
  title: string;
  body: string;
  url: string;
  tag?: string;
}

@Injectable()
export class NotificationsService implements OnModuleInit {
  private readonly logger = new Logger(NotificationsService.name);
  private transporter: Transporter | null = null;
  private vapidConfigured = false;

  constructor(
    private readonly config: ConfigService,
    @InjectModel(PushSubscription.name)
    private readonly pushModel: Model<PushSubscriptionDocument>,
  ) {}

  onModuleInit() {
    const publicKey = this.config.get<string>('VAPID_PUBLIC_KEY');
    const privateKey = this.config.get<string>('VAPID_PRIVATE_KEY');
    const subject = this.config.get(
      'VAPID_SUBJECT',
      'mailto:hola@almajardin.com',
    );

    if (publicKey && privateKey) {
      webpush.setVapidDetails(subject, publicKey, privateKey);
      this.vapidConfigured = true;
      this.logger.log('Web Push (VAPID) configured');
    } else {
      this.logger.warn(
        'VAPID keys missing — admin push notifications disabled',
      );
    }
  }

  isEmailConfigured(): boolean {
    return Boolean(this.config.get('SMTP_HOST'));
  }

  isPushConfigured(): boolean {
    return this.vapidConfigured;
  }

  getVapidPublicKey(): string | null {
    return this.config.get<string>('VAPID_PUBLIC_KEY') ?? null;
  }

  async sendMail(input: SendMailInput): Promise<boolean> {
    if (!this.isEmailConfigured()) {
      this.logger.warn(
        `SMTP not configured — email skipped (${input.subject} → ${input.to})`,
      );
      this.logger.log(input.text);
      return false;
    }

    const transporter = this.getTransporter();

    await transporter.sendMail({
      from: this.config.get('SMTP_FROM', 'Alma Jardín <noreply@almajardin.com>'),
      to: input.to,
      subject: input.subject,
      text: input.text,
      html: input.html ?? this.textToHtml(input.text),
    });

    this.logger.log(`Email sent: ${input.subject} → ${input.to}`);
    return true;
  }

  async subscribeAdmin(
    adminId: string,
    dto: SubscribePushDto,
  ): Promise<{ subscribed: true }> {
    await this.pushModel.findOneAndUpdate(
      { endpoint: dto.endpoint },
      {
        adminId: new Types.ObjectId(adminId),
        endpoint: dto.endpoint,
        p256dh: dto.keys.p256dh,
        auth: dto.keys.auth,
        userAgent: dto.userAgent,
      },
      { upsert: true, new: true },
    );

    return { subscribed: true };
  }

  async unsubscribe(endpoint: string): Promise<{ unsubscribed: true }> {
    await this.pushModel.deleteOne({ endpoint });
    return { unsubscribed: true };
  }

  async listAdminSubscriptions(adminId: string) {
    const subscriptions = await this.pushModel.find({
      adminId: new Types.ObjectId(adminId),
    });

    return {
      count: subscriptions.length,
      pushConfigured: this.isPushConfigured(),
      vapidPublicKey: this.getVapidPublicKey(),
    };
  }

  async notifyAdmins(activity: AdminActivityPush): Promise<number> {
    if (!this.isPushConfigured()) {
      this.logger.warn(`Push skipped (no VAPID): ${activity.title}`);
      return 0;
    }

    const subscriptions = await this.pushModel.find();

    if (subscriptions.length === 0) {
      this.logger.log(`No admin push subscriptions for: ${activity.title}`);
      return 0;
    }

    const payload = JSON.stringify({
      title: activity.title,
      body: activity.body,
      url: activity.url,
      tag: activity.tag ?? 'alma-jardin-admin',
    });

    let sent = 0;

    await Promise.all(
      subscriptions.map(async (subscription) => {
        try {
          await webpush.sendNotification(
            {
              endpoint: subscription.endpoint,
              keys: {
                p256dh: subscription.p256dh,
                auth: subscription.auth,
              },
            },
            payload,
          );
          sent += 1;
        } catch (error) {
          const statusCode =
            typeof error === 'object' &&
            error &&
            'statusCode' in error &&
            typeof (error as { statusCode?: number }).statusCode === 'number'
              ? (error as { statusCode: number }).statusCode
              : undefined;

          if (statusCode === 404 || statusCode === 410) {
            await this.pushModel.deleteOne({ _id: subscription._id });
            this.logger.log(`Removed stale push subscription ${subscription.endpoint}`);
          } else {
            this.logger.warn(
              `Push failed for ${subscription.endpoint}: ${String(error)}`,
            );
          }
        }
      }),
    );

    this.logger.log(`Push sent to ${sent}/${subscriptions.length} admins`);
    return sent;
  }

  buildEmailHtml(title: string, paragraphs: string[]): string {
    const body = paragraphs
      .map(
        (paragraph) =>
          `<p style="margin:0 0 12px;line-height:1.6;color:#3d5248;">${escapeHtml(paragraph)}</p>`,
      )
      .join('');

    return `<!DOCTYPE html>
<html lang="es">
  <body style="margin:0;padding:24px;background:#f7f4ed;font-family:Georgia,serif;">
    <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:16px;padding:28px;border:1px solid rgba(45,74,62,0.12);">
      <p style="margin:0 0 8px;letter-spacing:0.12em;text-transform:uppercase;font-size:11px;color:#6b7f74;">Alma Jardín</p>
      <h1 style="margin:0 0 16px;font-size:24px;color:#1a231f;">${escapeHtml(title)}</h1>
      ${body}
    </div>
  </body>
</html>`;
  }

  private textToHtml(text: string): string {
    const paragraphs = text.split(/\n{2,}/).map((block) => block.replace(/\n/g, '<br/>'));
    return this.buildEmailHtml('Alma Jardín', paragraphs);
  }

  private getTransporter(): Transporter {
    if (!this.transporter) {
      this.transporter = nodemailer.createTransport({
        host: this.config.get('SMTP_HOST'),
        port: Number(this.config.get('SMTP_PORT', 587)),
        secure: this.config.get('SMTP_SECURE') === 'true',
        auth: {
          user: this.config.get('SMTP_USER'),
          pass: this.config.get('SMTP_PASS'),
        },
      });
    }

    return this.transporter;
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
