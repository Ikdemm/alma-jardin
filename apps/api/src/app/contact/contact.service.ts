import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import type { ContactMessagePublic } from '@alma-jardin/shared';
import { NotificationsService } from '../notifications/notifications.service';
import { SettingsService } from '../settings/settings.service';
import {
  ContactMessage,
  ContactMessageDocument,
} from '../schemas/contact-message.schema';
import {
  CreateContactMessageDto,
  UpdateContactMessageStatusDto,
} from './dto/contact.dto';

@Injectable()
export class ContactService {
  constructor(
    @InjectModel(ContactMessage.name)
    private readonly contactModel: Model<ContactMessageDocument>,
    private readonly notifications: NotificationsService,
    private readonly settingsService: SettingsService,
    private readonly config: ConfigService,
  ) {}

  async createPublic(dto: CreateContactMessageDto): Promise<ContactMessagePublic> {
    const message = await this.contactModel.create({
      name: dto.name.trim(),
      email: dto.email.toLowerCase().trim(),
      phone: dto.phone?.trim(),
      subject: dto.subject.trim(),
      message: dto.message.trim(),
      status: 'new',
    });

    const publicMessage = this.toPublic(message);
    await this.notifyStaff(publicMessage);
    return publicMessage;
  }

  async listAdmin(): Promise<ContactMessagePublic[]> {
    const messages = await this.contactModel
      .find()
      .sort({ createdAt: -1 })
      .limit(200);

    return messages.map((message) => this.toPublic(message));
  }

  async updateStatus(
    id: string,
    dto: UpdateContactMessageStatusDto,
  ): Promise<ContactMessagePublic> {
    const message = await this.contactModel.findById(id);

    if (!message) {
      throw new NotFoundException('Mensaje no encontrado');
    }

    message.status = dto.status;
    await message.save();

    return this.toPublic(message);
  }

  private async notifyStaff(message: ContactMessagePublic) {
    const settings = await this.settingsService.getPublic();
    const to =
      settings.staffNotificationEmail?.trim() ||
      settings.email?.trim() ||
      this.config.get<string>('STAFF_NOTIFICATION_EMAIL');

    if (!to) {
      return;
    }

    const text = [
      'Nuevo mensaje de contacto en Alma Jardín',
      '',
      `Nombre: ${message.name}`,
      `Correo: ${message.email}`,
      message.phone ? `Teléfono: ${message.phone}` : null,
      `Asunto: ${message.subject}`,
      '',
      message.message,
    ]
      .filter(Boolean)
      .join('\n');

    await this.notifications.sendMail({
      to,
      subject: `[Alma Jardín] Contacto: ${message.subject}`,
      text,
    });
  }

  private toPublic(message: ContactMessageDocument): ContactMessagePublic {
    return {
      id: message._id.toString(),
      name: message.name,
      email: message.email,
      phone: message.phone,
      subject: message.subject,
      message: message.message,
      status: message.status,
      createdAt: message.createdAt.toISOString(),
    };
  }
}
