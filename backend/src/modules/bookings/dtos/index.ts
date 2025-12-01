import {
  IsString,
  IsUUID,
  IsNumber,
  IsEnum,
  IsDate,
  IsOptional,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { BookingStatus, BookingFrequency } from '@database/entities';

/**
 * Create Booking DTO
 * Validación para crear una nueva reserva
 */
export class CreateBookingDto {
  @IsUUID()
  @IsOptional()
  addressId?: string;

  @IsEnum(BookingFrequency)
  @IsOptional()
  frequency?: BookingFrequency;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @IsOptional()
  agreedPayout?: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @IsOptional()
  clientPrice?: number;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  scheduledAt?: Date;

  @IsNumber()
  @Min(15)
  @Max(240)
  @IsOptional()
  estimatedDurationMinutes?: number;

  @IsString()
  @IsOptional()
  specialInstructions?: string;

  @IsOptional()
  metadata?: Record<string, any>;
}

/**
 * Update Booking DTO
 * Validación para actualizar una reserva
 */
export class UpdateBookingDto {
  @IsEnum(BookingStatus)
  @IsOptional()
  status?: BookingStatus;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @IsOptional()
  agreedPayout?: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @IsOptional()
  clientPrice?: number;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  scheduledAt?: Date;

  @IsNumber()
  @Min(15)
  @Max(240)
  @IsOptional()
  estimatedDurationMinutes?: number;

  @IsString()
  @IsOptional()
  specialInstructions?: string;

  @IsOptional()
  metadata?: Record<string, any>;
}

/**
 * Update Booking Status DTO
 * Validación para cambiar estado de una reserva
 */
export class UpdateBookingStatusDto {
  @IsEnum(BookingStatus)
  status?: BookingStatus;

  @IsString()
  @IsOptional()
  reason?: string;
}

/**
 * Rate Booking DTO
 * Validación para calificar y dejar comentario sobre una reserva
 */
export class RateBookingDto {
  @IsNumber()
  @Min(1)
  @Max(5)
  rating?: number;

  @IsString()
  @IsOptional()
  review?: string;
}

/**
 * List Bookings Query DTO
 * Parámetros de filtro y paginación
 */
export class ListBookingsDto {
  @IsNumber()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @IsNumber()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit?: number = 20;

  @IsEnum(BookingStatus)
  @IsOptional()
  status?: BookingStatus;

  @IsEnum(BookingFrequency)
  @IsOptional()
  frequency?: BookingFrequency;

  @IsOptional()
  startDate?: Date;

  @IsOptional()
  endDate?: Date;

  @IsString()
  @IsOptional()
  sortBy?: string = 'createdAt';

  @IsString()
  @IsOptional()
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}

/**
 * Find Resis Query DTO
 * Parámetros para buscar resis disponibles
 */
export class FindResiDto {
  @IsUUID()
  @IsOptional()
  addressId?: string = undefined;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  scheduledAt?: Date = undefined;

  @IsNumber()
  @IsOptional()
  maxDistance?: number = 10; // km

  @IsNumber()
  @Min(0)
  @Max(5)
  @IsOptional()
  minRating?: number = 3.0;

  @IsOptional()
  exclude?: string[]; // UUIDs to exclude
}
