import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, Between, In } from 'typeorm';
import { Booking, BookingStatus } from '@database/entities';

/**
 * Booking Repository
 * Custom data access methods para bookings
 * Patrón: Repository Pattern
 */
@Injectable()
export class BookingRepository {
  constructor(
    @InjectRepository(Booking)
    private repository: Repository<Booking>,
    private _dataSource: DataSource,
  ) {}

  /**
   * Crear una nueva reserva
   */
  async create(booking: Partial<Booking>): Promise<Booking> {
    const newBooking = this.repository.create(booking);
    return await this.repository.save(newBooking);
  }

  /**
   * Obtener una reserva por ID
   */
  async findById(id: string): Promise<Booking> {
    const booking = await this.repository.findOne({
      where: { id },
      relations: ['client', 'resi', 'transactions'],
    });

    if (!booking) {
      throw new NotFoundException(`Booking con ID ${id} no encontrado`);
    }

    return booking;
  }

  /**
   * Obtener todas las reservas de un cliente
   */
  async findByClientId(
    clientId: string,
    filters?: {
      status?: BookingStatus;
      skip?: number;
      take?: number;
      sortBy?: string;
      sortOrder?: 'ASC' | 'DESC';
    },
  ): Promise<[Booking[], number]> {
    const query = this.repository
      .createQueryBuilder('booking')
      .where('booking.clientId = :clientId', { clientId });

    if (filters?.status) {
      query.andWhere('booking.status = :status', { status: filters.status });
    }

    if (filters?.sortBy) {
      query.orderBy(
        `booking.${filters.sortBy}`,
        filters.sortOrder || 'DESC',
      );
    }

    if (filters?.skip !== undefined) {
      query.skip(filters.skip);
    }

    if (filters?.take !== undefined) {
      query.take(filters.take);
    }

    return await query.getManyAndCount();
  }

  /**
   * Obtener todas las reservas de un resi
   */
  async findByResiId(
    resiId: string,
    filters?: {
      status?: BookingStatus;
      skip?: number;
      take?: number;
      sortBy?: string;
      sortOrder?: 'ASC' | 'DESC';
    },
  ): Promise<[Booking[], number]> {
    const query = this.repository
      .createQueryBuilder('booking')
      .where('booking.resiId = :resiId', { resiId });

    if (filters?.status) {
      query.andWhere('booking.status = :status', { status: filters.status });
    }

    if (filters?.sortBy) {
      query.orderBy(
        `booking.${filters.sortBy}`,
        filters.sortOrder || 'DESC',
      );
    }

    if (filters?.skip !== undefined) {
      query.skip(filters.skip);
    }

    if (filters?.take !== undefined) {
      query.take(filters.take);
    }

    return await query.getManyAndCount();
  }

  /**
   * Obtener reservas por estado
   */
  async findByStatus(
    status: BookingStatus,
    skip: number = 0,
    take: number = 20,
  ): Promise<[Booking[], number]> {
    return await this.repository.findAndCount({
      where: { status },
      skip,
      take,
      order: { createdAt: 'DESC' },
      relations: ['client', 'resi'],
    });
  }

  /**
   * Obtener reservas por rango de fecha
   */
  async findByDateRange(
    startDate: Date,
    endDate: Date,
    skip: number = 0,
    take: number = 20,
  ): Promise<[Booking[], number]> {
    return await this.repository.findAndCount({
      where: {
        scheduledAt: Between(startDate, endDate),
      },
      skip,
      take,
      order: { scheduledAt: 'ASC' },
      relations: ['client', 'resi'],
    });
  }

  /**
   * Obtener reservas pendientes de confirmación para un resi
   */
  async findPendingForResi(_resiId: string): Promise<Booking[]> {
    return await this.repository.find({
      where: {
        status: BookingStatus.PENDING,
      },
      relations: ['client'],
      order: { createdAt: 'DESC' },
      take: 50,
    });
  }

  /**
   * Actualizar una reserva
   */
  async update(id: string, updates: Partial<Booking>): Promise<Booking> {
    await this.repository.update(id, updates);
    return await this.findById(id);
  }

  /**
   * Eliminar una reserva (soft delete via status = CANCELLED)
   */
  async cancel(id: string, reason?: string): Promise<Booking> {
    const booking = await this.findById(id);

    // Validar transición de estado
    this.validateStateTransition(booking.status, BookingStatus.CANCELLED);

    return await this.update(id, {
      status: BookingStatus.CANCELLED,
      metadata: {
        ...booking.metadata,
        cancelledAt: new Date(),
        cancellationReason: reason,
      },
    });
  }

  /**
   * Validar transición de estado (state machine)
   */
  validateStateTransition(
    currentStatus: BookingStatus,
    newStatus: BookingStatus,
  ): boolean {
    const validTransitions: Record<BookingStatus, BookingStatus[]> = {
      [BookingStatus.PENDING]: [
        BookingStatus.CONFIRMED,
        BookingStatus.CANCELLED,
      ],
      [BookingStatus.CONFIRMED]: [
        BookingStatus.IN_PROGRESS,
        BookingStatus.CANCELLED,
      ],
      [BookingStatus.IN_PROGRESS]: [
        BookingStatus.COMPLETED,
        BookingStatus.DISPUTED,
      ],
      [BookingStatus.COMPLETED]: [BookingStatus.DISPUTED],
      [BookingStatus.CANCELLED]: [],
      [BookingStatus.DISPUTED]: [BookingStatus.COMPLETED, BookingStatus.CANCELLED],
    };

    const allowed = validTransitions[currentStatus] || [];

    if (!allowed.includes(newStatus)) {
      throw new BadRequestException(
        `No se puede transicionar de ${currentStatus} a ${newStatus}`,
      );
    }

    return true;
  }

  /**
   * Obtener reservas cercanas sin resi asignado (para matching)
   */
  async findUnassignedNearby(
    addressId: string,
    scheduledAt: Date,
  ): Promise<Booking[]> {
    return await this.repository
      .createQueryBuilder('booking')
      .where('booking.addressId = :addressId', { addressId })
      .andWhere('booking.resiId IS NULL')
      .andWhere('booking.status = :status', { status: BookingStatus.PENDING })
      .andWhere(
        'ABS(EXTRACT(EPOCH FROM booking.scheduledAt - :scheduledAt)) < 86400',
        { scheduledAt },
      ) // 24 hours
      .orderBy('booking.createdAt', 'ASC')
      .limit(10)
      .getMany();
  }

  /**
   * Obtener estadísticas de una reserva
   */
  async getBookingStats(bookingId: string): Promise<{
    resiRatingCount: number;
    clientRatingCount: number;
    averageResiRating: number;
    averageClientRating: number;
  }> {
    const bookings = await this.repository.find({
      where: {
        id: bookingId,
      },
    });

    if (bookings.length === 0) {
      throw new NotFoundException(`Booking ${bookingId} no encontrado`);
    }

    const resiRatedBookings = await this.repository.count({
      where: {
        resiRating: In([1, 2, 3, 4, 5]),
      },
    });

    const clientRatedBookings = await this.repository.count({
      where: {
        clientRating: In([1, 2, 3, 4, 5]),
      },
    });

    const avgResiRating = await this.repository
      .createQueryBuilder('booking')
      .select('AVG(booking.resiRating)', 'avg')
      .where('booking.resiRating IS NOT NULL')
      .getRawOne();

    const avgClientRating = await this.repository
      .createQueryBuilder('booking')
      .select('AVG(booking.clientRating)', 'avg')
      .where('booking.clientRating IS NOT NULL')
      .getRawOne();

    return {
      resiRatingCount: resiRatedBookings,
      clientRatingCount: clientRatedBookings,
      averageResiRating: parseFloat(avgResiRating?.avg || 0),
      averageClientRating: parseFloat(avgClientRating?.avg || 0),
    };
  }
}
