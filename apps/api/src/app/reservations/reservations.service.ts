import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import type { ReservationPublic, ReservationStatus } from '@alma-jardin/shared';
import { NotificationsService } from '../notifications/notifications.service';
import { SettingsService } from '../settings/settings.service';
import { Reservation, ReservationDocument } from '../schemas/reservation.schema';
import { CreateReservationDto, UpdateReservationStatusDto } from './dto/reservation.dto';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectModel(Reservation.name)
    private readonly reservationModel: Model<ReservationDocument>,
    private readonly notifications: NotificationsService,
    private readonly settingsService: SettingsService,
    private readonly config: ConfigService,
  ) {}

  async createPublic(dto: CreateReservationDto): Promise<ReservationPublic> {
    const startsAt = new Date(`${dto.date}T${dto.time}:00`);

    if (Number.isNaN(startsAt.getTime()) || startsAt < new Date()) {
      throw new BadRequestException('La fecha y hora deben ser futuras');
    }

    const reservation = await this.reservationModel.create({
      contactName: dto.contactName.trim(),
      contactPhone: dto.contactPhone.trim(),
      contactEmail: dto.contactEmail?.toLowerCase().trim(),
      date: new Date(`${dto.date}T00:00:00`),
      time: dto.time,
      pax: dto.pax,
      notes: dto.notes?.trim(),
      status: 'pending',
      source: 'web',
    });

    const publicReservation = this.toPublic(reservation);
    await Promise.all([
      this.notifyStaffNewReservation(publicReservation),
      this.pushAdminsNewReservation(publicReservation),
    ]);
    return publicReservation;
  }

  async listAdmin(filters: {
    status?: ReservationStatus;
    date?: string;
  }): Promise<ReservationPublic[]> {
    const query: Record<string, unknown> = {};

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.date) {
      const day = new Date(`${filters.date}T00:00:00`);
      const next = new Date(day);
      next.setDate(next.getDate() + 1);
      query.date = { $gte: day, $lt: next };
    }

    const reservations = await this.reservationModel
      .find(query)
      .sort({ date: 1, time: 1, createdAt: -1 });

    return reservations.map((reservation) => this.toPublic(reservation));
  }

  async updateStatus(id: string, dto: UpdateReservationStatusDto): Promise<ReservationPublic> {
    const reservation = await this.reservationModel.findById(id);

    if (!reservation) {
      throw new NotFoundException('Reserva no encontrada');
    }

    const previousStatus = reservation.status;
    reservation.status = dto.status;
    await reservation.save();

    const publicReservation = this.toPublic(reservation);

    if (dto.status === 'confirmed' && previousStatus !== 'confirmed') {
      await this.notifyGuestConfirmed(publicReservation);
    }

    return publicReservation;
  }

  private async notifyStaffNewReservation(reservation: ReservationPublic) {
    const settings = await this.settingsService.getPublic();
    const to = this.resolveStaffEmail(settings.staffNotificationEmail, settings.email);

    if (!to) {
      return;
    }

    const lines = [
      `Nombre: ${reservation.contactName}`,
      `Teléfono: ${reservation.contactPhone}`,
      reservation.contactEmail ? `Correo: ${reservation.contactEmail}` : null,
      `Fecha: ${reservation.date}`,
      `Hora: ${reservation.time}`,
      `Personas: ${reservation.pax}`,
      reservation.notes ? `Notas: ${reservation.notes}` : null,
      'Revisa el panel administrativo para confirmar o rechazar.',
    ].filter(Boolean) as string[];

    const text = ['Nueva solicitud de reserva en Alma Jardín', '', ...lines].join('\n');

    await this.notifications.sendMail({
      to,
      subject: `[Alma Jardín] Nueva reserva — ${reservation.contactName}`,
      text,
      html: this.notifications.buildEmailHtml('Nueva reserva', lines),
    });
  }

  private async pushAdminsNewReservation(reservation: ReservationPublic) {
    await this.notifications.notifyAdmins({
      title: 'Nueva reserva',
      body: `${reservation.contactName} · ${reservation.date} ${reservation.time} · ${reservation.pax} personas`,
      url: '/admin/reservations',
      tag: `reservation-${reservation.id}`,
    });
  }

  private async notifyGuestConfirmed(reservation: ReservationPublic) {
    if (!reservation.contactEmail) {
      return;
    }

    const settings = await this.settingsService.getPublic();
    const lines = [
      `Hola ${reservation.contactName},`,
      `Tu reserva en ${settings.name} ha sido confirmada.`,
      `Fecha: ${reservation.date}`,
      `Hora: ${reservation.time}`,
      `Personas: ${reservation.pax}`,
      `Te esperamos en ${settings.address}.`,
    ];

    await this.notifications.sendMail({
      to: reservation.contactEmail,
      subject: `Reserva confirmada — ${settings.name}`,
      text: lines.join('\n\n'),
      html: this.notifications.buildEmailHtml('Reserva confirmada', lines),
    });
  }

  private resolveStaffEmail(
    staffNotificationEmail?: string,
    fallbackEmail?: string,
  ): string | undefined {
    return (
      staffNotificationEmail?.trim() ||
      fallbackEmail?.trim() ||
      this.config.get<string>('STAFF_NOTIFICATION_EMAIL') ||
      undefined
    );
  }

  private toPublic(reservation: ReservationDocument): ReservationPublic {
    return {
      id: reservation._id.toString(),
      contactName: reservation.contactName,
      contactPhone: reservation.contactPhone,
      contactEmail: reservation.contactEmail,
      date: reservation.date.toISOString().slice(0, 10),
      time: reservation.time,
      pax: reservation.pax,
      notes: reservation.notes,
      status: reservation.status,
      createdAt: reservation.createdAt.toISOString(),
    };
  }
}
