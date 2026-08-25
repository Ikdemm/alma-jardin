import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import type { ReservationPublic, ReservationStatus } from '@alma-jardin/shared';
import { Reservation, ReservationDocument } from '../schemas/reservation.schema';
import { CreateReservationDto, UpdateReservationStatusDto } from './dto/reservation.dto';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectModel(Reservation.name)
    private readonly reservationModel: Model<ReservationDocument>,
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

    return this.toPublic(reservation);
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

    reservation.status = dto.status;
    await reservation.save();

    return this.toPublic(reservation);
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
