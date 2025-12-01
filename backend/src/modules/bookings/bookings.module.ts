import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { Booking } from '@database/entities';
import { User } from '@database/entities';

import { BookingsController } from './controllers/bookings.controller';
import { BookingService } from './services/booking.service';
import { MatchingService } from './services/matching.service';
import { BookingRepository } from './repositories/booking.repository';

/**
 * Bookings Module
 * Gestiona reservas/bookings de servicios de limpieza
 * Features:
 * - Create, read, update, delete bookings
 * - State machine transitions (PENDING → CONFIRMED → IN_PROGRESS → COMPLETED)
 * - Matching engine para encontrar resis disponibles
 * - Rating & review system
 */
@Module({
  imports: [TypeOrmModule.forFeature([Booking, User]), EventEmitterModule],
  controllers: [BookingsController],
  providers: [BookingService, MatchingService, BookingRepository],
  exports: [BookingService, BookingRepository],
})
export class BookingsModule {}
