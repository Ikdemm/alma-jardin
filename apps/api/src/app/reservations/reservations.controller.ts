import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import type { PermissionCode } from '@alma-jardin/shared';
import { Public, RequirePermissions } from '../common/decorators/access.decorator';
import {
  CreateReservationDto,
  ListReservationsQueryDto,
  UpdateReservationStatusDto,
} from './dto/reservation.dto';
import { ReservationsService } from './reservations.service';

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Public()
  @Post()
  create(@Body() dto: CreateReservationDto) {
    return this.reservationsService.createPublic(dto);
  }

  @RequirePermissions('reservations.read' satisfies PermissionCode)
  @Get()
  list(@Query() query: ListReservationsQueryDto) {
    return this.reservationsService.listAdmin(query);
  }

  @RequirePermissions('reservations.update' satisfies PermissionCode)
  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateReservationStatusDto) {
    return this.reservationsService.updateStatus(id, dto);
  }
}
