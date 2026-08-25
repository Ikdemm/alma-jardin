import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

export interface SendMailInput {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private transporter: Transporter | null = null;

  constructor(private readonly config: ConfigService) {}

  isConfigured(): boolean {
    return Boolean(this.config.get('SMTP_HOST'));
  }

  async sendMail(input: SendMailInput): Promise<boolean> {
    if (!this.isConfigured()) {
      this.logger.warn(
        `SMTP not configured — notification skipped (${input.subject} → ${input.to})`,
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
      html: input.html,
    });

    return true;
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
