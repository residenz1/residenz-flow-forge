import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Booking, BookingStatus, BookingFrequency } from '@database/entities';
import { BookingRepository } from '../repositories/booking.repository';

describe('BookingRepository', () => {
  let repository: BookingRepository;
  let mockRepository: any;
  let mockDataSource: any;

  const mockBooking = {
    id: 'booking-123',
    clientId: 'client-123',
    resiId: 'resi-123',
    addressId: 'address-123',
    status: BookingStatus.PENDING,
    frequency: BookingFrequency.ONE_TIME,
    agreedPayout: 100,
    clientPrice: 120,
    scheduledAt: new Date(),
    metadata: {},
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    mockRepository = {
      create: jest.fn().mockReturnValue(mockBooking),
      save: jest.fn().mockResolvedValue(mockBooking),
      findOne: jest.fn().mockResolvedValue(mockBooking),
      update: jest.fn().mockResolvedValue({ affected: 1 }),
      find: jest.fn().mockResolvedValue([mockBooking]),
      count: jest.fn().mockResolvedValue(1),
      findAndCount: jest.fn().mockResolvedValue([[mockBooking], 1]),
      createQueryBuilder: jest.fn().mockReturnValue({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        addOrderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([[mockBooking], 1]),
        getMany: jest.fn().mockResolvedValue([mockBooking]),
        getRawOne: jest.fn().mockResolvedValue({ avg: 4.5 }),
      }),
    };

    mockDataSource = {
      getRepository: jest.fn().mockReturnValue(mockRepository),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingRepository,
        {
          provide: getRepositoryToken(Booking),
          useValue: mockRepository,
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    repository = module.get<BookingRepository>(BookingRepository);
  });

  describe('create', () => {
    it('debe crear una nueva reserva', async () => {
      const result = await repository.create({
        clientId: 'client-123',
        addressId: 'address-123',
        status: BookingStatus.PENDING,
      });

      expect(result).toEqual(mockBooking);
      expect(mockRepository.create).toHaveBeenCalled();
      expect(mockRepository.save).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('debe encontrar una reserva por ID', async () => {
      const result = await repository.findById('booking-123');

      expect(result).toEqual(mockBooking);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'booking-123' },
        relations: ['client', 'resi', 'transactions'],
      });
    });

    it('debe lanzar error si la reserva no existe', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(repository.findById('invalid')).rejects.toThrow();
    });
  });

  describe('findByClientId', () => {
    it('debe encontrar las reservas de un cliente', async () => {
      const [bookings, total] = await repository.findByClientId('client-123');

      expect(bookings).toContainEqual(mockBooking);
      expect(total).toEqual(1);
    });

    it('debe filtrar por estado', async () => {
      await repository.findByClientId('client-123', {
        status: BookingStatus.CONFIRMED,
      });

      const builder = mockRepository.createQueryBuilder();
      expect(builder.andWhere).toHaveBeenCalled();
    });
  });

  describe('findByResiId', () => {
    it('debe encontrar las reservas de un resi', async () => {
      const [bookings, total] = await repository.findByResiId('resi-123');

      expect(bookings).toContainEqual(mockBooking);
      expect(total).toEqual(1);
    });
  });

  describe('findByStatus', () => {
    it('debe encontrar reservas por estado', async () => {
      const [bookings, total] = await repository.findByStatus(
        BookingStatus.PENDING,
      );

      expect(bookings).toContainEqual(mockBooking);
      expect(mockRepository.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { status: BookingStatus.PENDING },
        }),
      );
    });
  });

  describe('validateStateTransition', () => {
    it('debe validar transiciones de estado permitidas', () => {
      const isValid = repository.validateStateTransition(
        BookingStatus.PENDING,
        BookingStatus.CONFIRMED,
      );

      expect(isValid).toBe(true);
    });

    it('debe lanzar error para transiciones no permitidas', () => {
      expect(() => {
        repository.validateStateTransition(
          BookingStatus.COMPLETED,
          BookingStatus.IN_PROGRESS,
        );
      }).toThrow();
    });
  });

  describe('cancel', () => {
    it('debe cancelar una reserva', async () => {
      const result = await repository.cancel('booking-123', 'Usuario cambió de opinión');

      expect(result.status).toEqual(BookingStatus.CANCELLED);
      expect(mockRepository.update).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('debe actualizar una reserva', async () => {
      const result = await repository.update('booking-123', {
        status: BookingStatus.CONFIRMED,
      });

      expect(mockRepository.update).toHaveBeenCalledWith('booking-123', {
        status: BookingStatus.CONFIRMED,
      });
    });
  });

  describe('getBookingStats', () => {
    it('debe obtener estadísticas de una reserva', async () => {
      const stats = await repository.getBookingStats('booking-123');

      expect(stats).toHaveProperty('resiRatingCount');
      expect(stats).toHaveProperty('clientRatingCount');
      expect(stats).toHaveProperty('averageResiRating');
      expect(stats).toHaveProperty('averageClientRating');
    });
  });
});
