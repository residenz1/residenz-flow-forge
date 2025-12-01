import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Booking, BookingStatus, BookingFrequency } from '@database/entities';
import { User } from '@database/entities';
import { BookingService } from '../services/booking.service';
import { BookingRepository } from '../repositories/booking.repository';
import { MatchingService } from '../services/matching.service';
import { CreateBookingDto, RateBookingDto } from '../dtos';

describe('BookingService', () => {
  let service: BookingService;
  let repository: BookingRepository;
  let matchingService: MatchingService;
  let eventEmitter: EventEmitter2;
  let mockBookingRepository: any;
  let mockUserRepository: any;
  let mockEventEmitter: any;

  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'RESI',
    rating: 4.5,
    totalReviews: 10,
    isActive: true,
    kycStatus: 'APPROVED',
  };

  const mockBooking: Booking = {
    id: 'booking-123',
    clientId: 'client-123',
    resiId: 'resi-123',
    addressId: 'address-123',
    status: BookingStatus.PENDING,
    frequency: BookingFrequency.ONE_TIME,
    agreedPayout: 100,
    clientPrice: 120,
    scheduledAt: new Date(Date.now() + 86400000), // Tomorrow
    estimatedDurationMinutes: 120,
    checkInAt: null,
    checkOutAt: null,
    escrowAccountId: null,
    payoutTransactionId: null,
    specialInstructions: 'Please bring supplies',
    resiRating: null,
    resiReview: null,
    clientRating: null,
    clientReview: null,
    metadata: {},
    createdAt: new Date(),
    updatedAt: new Date(),
    client: null,
    resi: null,
    transactions: [],
  };

  beforeEach(async () => {
    mockBookingRepository = {
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      cancel: jest.fn(),
      findByClientId: jest.fn(),
      findByResiId: jest.fn(),
      validateStateTransition: jest.fn(),
    };

    mockUserRepository = {
      findOne: jest.fn(),
    };

    mockEventEmitter = {
      emit: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingService,
        BookingRepository,
        MatchingService,
        {
          provide: getRepositoryToken(Booking),
          useValue: mockBookingRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: EventEmitter2,
          useValue: mockEventEmitter,
        },
      ],
    }).compile();

    service = module.get<BookingService>(BookingService);
    repository = module.get<BookingRepository>(BookingRepository);
    matchingService = module.get<MatchingService>(MatchingService);
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
  });

  describe('createBooking', () => {
    it('debe crear una nueva reserva', async () => {
      const dto: CreateBookingDto = {
        addressId: 'address-123',
        frequency: BookingFrequency.ONE_TIME,
        agreedPayout: 100,
        clientPrice: 120,
        scheduledAt: new Date(Date.now() + 86400000),
        estimatedDurationMinutes: 120,
        specialInstructions: 'Please bring supplies',
      };

      jest.spyOn(matchingService, 'findBestResi').mockResolvedValue(mockUser as any);
      jest.spyOn(repository, 'create').mockResolvedValue(mockBooking);

      const result = await service.createBooking('client-123', dto);

      expect(result).toEqual(mockBooking);
      expect(repository.create).toHaveBeenCalledWith(expect.objectContaining({
        clientId: 'client-123',
        addressId: 'address-123',
        status: BookingStatus.PENDING,
      }));
      expect(mockEventEmitter.emit).toHaveBeenCalledWith(
        'booking.created',
        expect.any(Object),
      );
    });

    it('debe lanzar error si la fecha es en el pasado', async () => {
      const dto: CreateBookingDto = {
        addressId: 'address-123',
        frequency: BookingFrequency.ONE_TIME,
        agreedPayout: 100,
        scheduledAt: new Date(Date.now() - 86400000), // Yesterday
      };

      await expect(service.createBooking('client-123', dto)).rejects.toThrow();
    });
  });

  describe('confirmBooking', () => {
    it('debe confirmar una reserva en estado PENDING', async () => {
      jest.spyOn(repository, 'findById').mockResolvedValue(mockBooking);
      jest.spyOn(repository, 'update').mockResolvedValue({
        ...mockBooking,
        status: BookingStatus.CONFIRMED,
      });

      const result = await service.confirmBooking('booking-123', 'resi-123');

      expect(result.status).toEqual(BookingStatus.CONFIRMED);
      expect(mockEventEmitter.emit).toHaveBeenCalledWith(
        'booking.confirmed',
        expect.any(Object),
      );
    });

    it('debe lanzar error si la reserva no está en estado PENDING', async () => {
      const confirmedBooking = { ...mockBooking, status: BookingStatus.CONFIRMED };
      jest.spyOn(repository, 'findById').mockResolvedValue(confirmedBooking);

      await expect(service.confirmBooking('booking-123', 'resi-123')).rejects.toThrow();
    });
  });

  describe('startBooking', () => {
    it('debe iniciar una reserva en estado CONFIRMED', async () => {
      const confirmedBooking = { ...mockBooking, status: BookingStatus.CONFIRMED };
      jest.spyOn(repository, 'findById').mockResolvedValue(confirmedBooking);
      jest.spyOn(repository, 'update').mockResolvedValue({
        ...confirmedBooking,
        status: BookingStatus.IN_PROGRESS,
        checkInAt: new Date(),
      });

      const result = await service.startBooking('booking-123');

      expect(result.status).toEqual(BookingStatus.IN_PROGRESS);
      expect(result.checkInAt).toBeDefined();
    });
  });

  describe('completeBooking', () => {
    it('debe completar una reserva en estado IN_PROGRESS', async () => {
      const inProgressBooking = { ...mockBooking, status: BookingStatus.IN_PROGRESS };
      jest.spyOn(repository, 'findById').mockResolvedValue(inProgressBooking);
      jest.spyOn(repository, 'update').mockResolvedValue({
        ...inProgressBooking,
        status: BookingStatus.COMPLETED,
        checkOutAt: new Date(),
      });

      const result = await service.completeBooking('booking-123');

      expect(result.status).toEqual(BookingStatus.COMPLETED);
      expect(result.checkOutAt).toBeDefined();
      expect(mockEventEmitter.emit).toHaveBeenCalledWith(
        'booking.completed',
        expect.any(Object),
      );
    });
  });

  describe('cancelBooking', () => {
    it('debe cancelar una reserva', async () => {
      jest.spyOn(repository, 'cancel').mockResolvedValue({
        ...mockBooking,
        status: BookingStatus.CANCELLED,
      });

      const result = await service.cancelBooking('booking-123', 'Usuario cambió de opinión');

      expect(result.status).toEqual(BookingStatus.CANCELLED);
      expect(mockEventEmitter.emit).toHaveBeenCalledWith(
        'booking.cancelled',
        expect.any(Object),
      );
    });
  });

  describe('rateBooking', () => {
    it('debe calificar una reserva completada', async () => {
      const completedBooking = { ...mockBooking, status: BookingStatus.COMPLETED };
      jest.spyOn(repository, 'findById').mockResolvedValue(completedBooking);
      jest.spyOn(repository, 'update').mockResolvedValue({
        ...completedBooking,
        resiRating: 5,
        resiReview: 'Excelente trabajo',
      });

      const dto: RateBookingDto = {
        rating: 5,
        review: 'Excelente trabajo',
      };

      const result = await service.rateBooking('booking-123', 'client-123', 'CLIENT', dto);

      expect(result.resiRating).toEqual(5);
      expect(result.resiReview).toEqual('Excelente trabajo');
    });

    it('debe lanzar error si intenta calificar una reserva no completada', async () => {
      jest.spyOn(repository, 'findById').mockResolvedValue(mockBooking);

      const dto: RateBookingDto = {
        rating: 5,
      };

      await expect(
        service.rateBooking('booking-123', 'client-123', 'CLIENT', dto),
      ).rejects.toThrow();
    });
  });

  describe('getClientBookings', () => {
    it('debe obtener las reservas de un cliente', async () => {
      jest.spyOn(repository, 'findByClientId').mockResolvedValue([
        [mockBooking],
        1,
      ]);

      const result = await service.getClientBookings('client-123', { page: 1, limit: 20 });

      expect(result.data).toContainEqual(mockBooking);
      expect(result.total).toEqual(1);
      expect(result.page).toEqual(1);
    });
  });

  describe('getResiBookings', () => {
    it('debe obtener las reservas de un resi', async () => {
      jest.spyOn(repository, 'findByResiId').mockResolvedValue([
        [mockBooking],
        1,
      ]);

      const result = await service.getResiBookings('resi-123', { page: 1, limit: 20 });

      expect(result.data).toContainEqual(mockBooking);
      expect(result.total).toEqual(1);
    });
  });

  describe('disputeBooking', () => {
    it('debe disputar una reserva completada', async () => {
      const completedBooking = { ...mockBooking, status: BookingStatus.COMPLETED };
      jest.spyOn(repository, 'findById').mockResolvedValue(completedBooking);
      jest.spyOn(repository, 'update').mockResolvedValue({
        ...completedBooking,
        status: BookingStatus.DISPUTED,
      });

      const result = await service.disputeBooking('booking-123', 'Work quality issue');

      expect(result.status).toEqual(BookingStatus.DISPUTED);
      expect(mockEventEmitter.emit).toHaveBeenCalledWith(
        'booking.disputed',
        expect.any(Object),
      );
    });
  });
});
