import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Booking, BookingStatus } from '@database/entities';
import { BookingRepository } from '../repositories/booking.repository';
import { MatchingService } from './matching.service';
import {
  CreateBookingDto,
  UpdateBookingDto,
  RateBookingDto,
  ListBookingsDto,
  FindResiDto,
} from '../dtos';

/**
 * Booking Service
 * Lógica de negocio para gestión de reservas
 * Features:
 * - Crear, actualizar, eliminar reservas
 * - State machine transitions
 * - Matching engine integration
 * - Rating & review system
 * - Event-driven notifications
 */
@Injectable()
export class BookingService {
  private readonly logger = new Logger(BookingService.name);

  constructor(
    private bookingRepository: BookingRepository,
    private matchingService: MatchingService,
    private eventEmitter: EventEmitter2,
  ) {}

  /**
   * Crear una nueva reserva
   * Flujo:
   * 1. Validar datos
   * 2. Encontrar mejor resi (matching)
   * 3. Crear reserva (status=PENDING)
   * 4. Emitir evento para notificaciones
   */
  async createBooking(
    clientId: string,
    dto: CreateBookingDto,
  ): Promise<Booking> {
    this.logger.log(`Creando reserva para cliente: ${clientId}`);

    // Validar fecha
    if (dto.scheduledAt && dto.scheduledAt < new Date()) {
      throw new BadRequestException(
        'La fecha de la reserva no puede ser en el pasado',
      );
    }

    try {
      // Buscar mejor resi
      const resi = await this.matchingService.findBestResi(dto.addressId!, dto.scheduledAt!);

      // Crear reserva
      const booking = await this.bookingRepository.create({
        clientId,
        resiId: resi?.id || undefined,
        addressId: dto.addressId,
        status: BookingStatus.PENDING,
        frequency: dto.frequency,
        agreedPayout: dto.agreedPayout,
        clientPrice: dto.clientPrice,
        scheduledAt: dto.scheduledAt,
        estimatedDurationMinutes: dto.estimatedDurationMinutes,
        specialInstructions: dto.specialInstructions,
        metadata: {
          ...dto.metadata,
          createdAt: new Date(),
          matchingAlgorithm: 'rating_and_experience',
        },
      });

      this.logger.log(
        `Reserva creada: ${booking.id} (resi: ${booking.resiId || 'sin asignar'})`,
      );

      // Emitir eventos
      this.eventEmitter.emit('booking.created', {
        bookingId: booking.id,
        clientId: booking.clientId,
        resiId: booking.resiId,
        scheduledAt: booking.scheduledAt,
      });

      if (booking.resiId) {
        this.eventEmitter.emit('booking.resi_assigned', {
          bookingId: booking.id,
          resiId: booking.resiId,
        });
      }

      return booking;
    } catch (error) {
      this.logger.error(`Error creando booking: ${(error as Error).message}`, (error as Error).stack);
      throw error;
    }
  }

  /**
   * Obtener reserva por ID
   */
  async getBooking(bookingId: string): Promise<Booking> {
    return await this.bookingRepository.findById(bookingId);
  }

  /**
   * Obtener reservas de un cliente
   */
  async getClientBookings(
    clientId: string,
    dto: ListBookingsDto,
  ): Promise<{ data: Booking[]; total: number; page: number; limit: number }> {
    const skip = ((dto.page || 1) - 1) * (dto.limit || 20);
    const [bookings, total] = await this.bookingRepository.findByClientId(
      clientId,
      {
        status: dto.status,
        skip,
        take: dto.limit || 20,
        sortBy: dto.sortBy,
        sortOrder: dto.sortOrder,
      },
    );

    return {
      data: bookings,
      total,
      page: dto.page || 1,
      limit: dto.limit || 20,
    };
  }

  /**
   * Obtener reservas de un resi
   */
  async getResiBookings(
    resiId: string,
    dto: ListBookingsDto,
  ): Promise<{ data: Booking[]; total: number; page: number; limit: number }> {
    const skip = ((dto.page || 1) - 1) * (dto.limit || 20);
    const [bookings, total] = await this.bookingRepository.findByResiId(resiId, {
      status: dto.status,
      skip,
      take: dto.limit || 20,
      sortBy: dto.sortBy,
      sortOrder: dto.sortOrder,
    });

    return {
      data: bookings,
      total,
      page: dto.page || 1,
      limit: dto.limit || 20,
    };
  }

  /**
   * Actualizar una reserva
   */
  async updateBooking(
    bookingId: string,
    dto: UpdateBookingDto,
  ): Promise<Booking> {
    const booking = await this.bookingRepository.findById(bookingId);

    // Validar transición de estado si se intenta cambiar
    if (dto.status && dto.status !== booking.status) {
      this.bookingRepository.validateStateTransition(booking.status, dto.status);
    }

    const updated = await this.bookingRepository.update(bookingId, dto);
    this.logger.log(`Reserva actualizada: ${bookingId}`);

    if (dto.status) {
      this.eventEmitter.emit('booking.status_changed', {
        bookingId: updated.id,
        oldStatus: booking.status,
        newStatus: updated.status,
      });
    }

    return updated;
  }

  /**
   * Confirmar una reserva (PENDING → CONFIRMED)
   * Usado por el resi para aceptar una reserva
   */
  async confirmBooking(
    bookingId: string,
    resiId: string,
  ): Promise<Booking> {
    const booking = await this.bookingRepository.findById(bookingId);

    if (booking.status !== BookingStatus.PENDING) {
      throw new BadRequestException(
        `La reserva debe estar en estado PENDING, actualmente: ${booking.status}`,
      );
    }

    if (booking.resiId && booking.resiId !== resiId) {
      throw new BadRequestException(
        'Solo el resi asignado puede confirmar esta reserva',
      );
    }

    const updated = await this.bookingRepository.update(bookingId, {
      status: BookingStatus.CONFIRMED,
      resiId,
    });

    this.logger.log(`Reserva confirmada: ${bookingId} por resi: ${resiId}`);

    this.eventEmitter.emit('booking.confirmed', {
      bookingId: updated.id,
      resiId: updated.resiId,
      clientId: updated.clientId,
    });

    return updated;
  }

  /**
   * Iniciar reserva (CONFIRMED → IN_PROGRESS)
   * Check-in de la reserva
   */
  async startBooking(bookingId: string): Promise<Booking> {
    const booking = await this.bookingRepository.findById(bookingId);

    if (booking.status !== BookingStatus.CONFIRMED) {
      throw new BadRequestException(
        `La reserva debe estar en estado CONFIRMED, actualmente: ${booking.status}`,
      );
    }

    const updated = await this.bookingRepository.update(bookingId, {
      status: BookingStatus.IN_PROGRESS,
      checkInAt: new Date(),
    });

    this.logger.log(`Reserva iniciada: ${bookingId}`);

    this.eventEmitter.emit('booking.started', {
      bookingId: updated.id,
      resiId: updated.resiId,
      clientId: updated.clientId,
    });

    return updated;
  }

  /**
   * Completar reserva (IN_PROGRESS → COMPLETED)
   * Check-out de la reserva, inicia proceso de pago
   */
  async completeBooking(bookingId: string): Promise<Booking> {
    const booking = await this.bookingRepository.findById(bookingId);

    if (booking.status !== BookingStatus.IN_PROGRESS) {
      throw new BadRequestException(
        `La reserva debe estar en estado IN_PROGRESS, actualmente: ${booking.status}`,
      );
    }

    const updated = await this.bookingRepository.update(bookingId, {
      status: BookingStatus.COMPLETED,
      checkOutAt: new Date(),
    });

    this.logger.log(`Reserva completada: ${bookingId}`);

    this.eventEmitter.emit('booking.completed', {
      bookingId: updated.id,
      resiId: updated.resiId,
      clientId: updated.clientId,
      agreedPayout: updated.agreedPayout,
    });

    return updated;
  }

  /**
   * Cancelar una reserva
   */
  async cancelBooking(bookingId: string, reason?: string): Promise<Booking> {
    const updated = await this.bookingRepository.cancel(bookingId, reason);

    this.logger.log(`Reserva cancelada: ${bookingId}, razón: ${reason || 'N/A'}`);

    this.eventEmitter.emit('booking.cancelled', {
      bookingId: updated.id,
      resiId: updated.resiId,
      clientId: updated.clientId,
      reason,
    });

    return updated;
  }

  /**
   * Disputar una reserva (cambiar a DISPUTED)
   * Genera ticket de soporte
   */
  async disputeBooking(bookingId: string, reason: string): Promise<Booking> {
    const booking = await this.bookingRepository.findById(bookingId);

    const validStatusForDispute = [
      BookingStatus.COMPLETED,
      BookingStatus.IN_PROGRESS,
    ];
    if (!validStatusForDispute.includes(booking.status)) {
      throw new BadRequestException(
        `Solo se pueden disputar reservas en estado COMPLETED o IN_PROGRESS`,
      );
    }

    const updated = await this.bookingRepository.update(bookingId, {
      status: BookingStatus.DISPUTED,
      metadata: {
        ...booking.metadata,
        disputeReason: reason,
        disputedAt: new Date(),
      },
    });

    this.logger.log(`Reserva disputada: ${bookingId}, razón: ${reason}`);

    this.eventEmitter.emit('booking.disputed', {
      bookingId: updated.id,
      resiId: updated.resiId,
      clientId: updated.clientId,
      reason,
    });

    return updated;
  }

  /**
   * Calificar una reserva
   * El resi califica al cliente o el cliente califica al resi
   */
  async rateBooking(
    bookingId: string,
    userId: string,
    userRole: 'CLIENT' | 'RESI',
    dto: RateBookingDto,
  ): Promise<Booking> {
    const booking = await this.bookingRepository.findById(bookingId);

    if (booking.status !== BookingStatus.COMPLETED) {
      throw new BadRequestException(
        'Solo se pueden calificar reservas completadas',
      );
    }

    let updates: Partial<Booking> = {};

    if (userRole === 'RESI') {
      if (booking.resiId !== userId) {
        throw new BadRequestException('No tienes permiso para calificar');
      }
      updates = {
        clientRating: dto.rating,
        clientReview: dto.review,
      };
    } else if (userRole === 'CLIENT') {
      if (booking.clientId !== userId) {
        throw new BadRequestException('No tienes permiso para calificar');
      }
      updates = {
        resiRating: dto.rating,
        resiReview: dto.review,
      };
    }

    const updated = await this.bookingRepository.update(bookingId, updates);

    this.logger.log(
      `Reserva calificada: ${bookingId} por ${userRole} con ${dto.rating} estrellas`,
    );

    this.eventEmitter.emit('booking.rated', {
      bookingId: updated.id,
      rating: dto.rating,
      userRole,
    });

    return updated;
  }

  /**
   * Buscar resis disponibles para un booking
   */
  async findAvailableResis(dto: FindResiDto): Promise<any[]> {
    if (!dto.addressId) {
      throw new Error('addressId is required');
    }

    if (!dto.scheduledAt) {
      throw new Error('scheduledAt is required');
    }

    const resis = await this.matchingService.findResiCandidates(
      dto.addressId,
      dto.scheduledAt,
      5,
      {
        maxDistance: dto.maxDistance,
        minRating: dto.minRating,
        excludeResiIds: dto.exclude,
      },
    );

    // Agregar información de compatibilidad
    return resis.map((resi) => ({
      id: resi.id,
      firstName: resi.firstName,
      lastName: resi.lastName,
      profilePhotoUrl: resi.profilePhotoUrl,
      rating: resi.rating,
      totalReviews: resi.totalReviews,
      compatibilityScore: this.matchingService.calculateCompatibilityScore(
        resi,
      ),
    }));
  }

  /**
   * Obtener estadísticas de una reserva
   */
  async getBookingStats(bookingId: string): Promise<any> {
    return await this.bookingRepository.getBookingStats(bookingId);
  }
}
