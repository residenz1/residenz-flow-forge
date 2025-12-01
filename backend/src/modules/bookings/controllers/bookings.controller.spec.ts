import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { BookingsController } from '../controllers/bookings.controller';
import { BookingService } from '../services/booking.service';
import { Booking, BookingStatus, BookingFrequency } from '@database/entities';

describe('BookingsController (Integration)', () => {
  let app: INestApplication;
  let bookingService: BookingService;

  const mockBooking: Booking = {
    id: 'booking-123',
    clientId: 'client-123',
    resiId: 'resi-123',
    addressId: 'address-123',
    status: BookingStatus.PENDING,
    frequency: BookingFrequency.ONE_TIME,
    agreedPayout: 100,
    clientPrice: 120,
    scheduledAt: new Date(Date.now() + 86400000),
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

  const mockBookingService = {
    createBooking: jest.fn().mockResolvedValue(mockBooking),
    getBooking: jest.fn().mockResolvedValue(mockBooking),
    getClientBookings: jest.fn().mockResolvedValue({
      data: [mockBooking],
      total: 1,
      page: 1,
      limit: 20,
    }),
    getResiBookings: jest.fn().mockResolvedValue({
      data: [mockBooking],
      total: 1,
      page: 1,
      limit: 20,
    }),
    updateBooking: jest.fn().mockResolvedValue(mockBooking),
    confirmBooking: jest.fn().mockResolvedValue({
      ...mockBooking,
      status: BookingStatus.CONFIRMED,
    }),
    startBooking: jest.fn().mockResolvedValue({
      ...mockBooking,
      status: BookingStatus.IN_PROGRESS,
    }),
    completeBooking: jest.fn().mockResolvedValue({
      ...mockBooking,
      status: BookingStatus.COMPLETED,
    }),
    cancelBooking: jest.fn().mockResolvedValue({
      ...mockBooking,
      status: BookingStatus.CANCELLED,
    }),
    disputeBooking: jest.fn().mockResolvedValue({
      ...mockBooking,
      status: BookingStatus.DISPUTED,
    }),
    rateBooking: jest.fn().mockResolvedValue({
      ...mockBooking,
      resiRating: 5,
      resiReview: 'Great!',
    }),
    findAvailableResis: jest.fn().mockResolvedValue([
      {
        id: 'resi-1',
        firstName: 'John',
        lastName: 'Doe',
        rating: 4.5,
        totalReviews: 10,
        compatibilityScore: 85,
      },
    ]),
    getBookingStats: jest.fn().mockResolvedValue({
      resiRatingCount: 1,
      clientRatingCount: 1,
      averageResiRating: 4.5,
      averageClientRating: 4.2,
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookingsController],
      providers: [
        {
          provide: BookingService,
          useValue: mockBookingService,
        },
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    bookingService = module.get<BookingService>(BookingService);
  });

  afterEach(async () => {
    await app.close();
  });

  describe('POST /bookings', () => {
    it('debe crear una nueva reserva', async () => {
      const dto = {
        addressId: 'address-123',
        frequency: BookingFrequency.ONE_TIME,
        agreedPayout: 100,
        clientPrice: 120,
        scheduledAt: new Date(Date.now() + 86400000),
        estimatedDurationMinutes: 120,
      };

      const response = await request(app.getHttpServer())
        .post('/bookings')
        .set('Authorization', 'Bearer test-token')
        .send(dto);

      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body).toEqual(mockBooking);
    });
  });

  describe('GET /bookings/:id', () => {
    it('debe obtener una reserva por ID', async () => {
      const response = await request(app.getHttpServer())
        .get('/bookings/booking-123')
        .set('Authorization', 'Bearer test-token');

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toEqual(mockBooking);
    });
  });

  describe('GET /bookings', () => {
    it('debe listar mis reservas', async () => {
      const response = await request(app.getHttpServer())
        .get('/bookings?page=1&limit=20')
        .set('Authorization', 'Bearer test-token');

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.data).toContainEqual(mockBooking);
    });
  });

  describe('PATCH /bookings/:id/confirm', () => {
    it('debe confirmar una reserva', async () => {
      const response = await request(app.getHttpServer())
        .patch('/bookings/booking-123/confirm')
        .set('Authorization', 'Bearer test-token');

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.status).toBe(BookingStatus.CONFIRMED);
    });
  });

  describe('PATCH /bookings/:id/start', () => {
    it('debe iniciar una reserva', async () => {
      const response = await request(app.getHttpServer())
        .patch('/bookings/booking-123/start')
        .set('Authorization', 'Bearer test-token');

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.status).toBe(BookingStatus.IN_PROGRESS);
    });
  });

  describe('PATCH /bookings/:id/complete', () => {
    it('debe completar una reserva', async () => {
      const response = await request(app.getHttpServer())
        .patch('/bookings/booking-123/complete')
        .set('Authorization', 'Bearer test-token');

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.status).toBe(BookingStatus.COMPLETED);
    });
  });

  describe('DELETE /bookings/:id', () => {
    it('debe cancelar una reserva', async () => {
      const response = await request(app.getHttpServer())
        .delete('/bookings/booking-123')
        .set('Authorization', 'Bearer test-token')
        .query({ reason: 'Changed my mind' });

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.status).toBe(BookingStatus.CANCELLED);
    });
  });

  describe('PATCH /bookings/:id/dispute', () => {
    it('debe disputar una reserva', async () => {
      const response = await request(app.getHttpServer())
        .patch('/bookings/booking-123/dispute')
        .set('Authorization', 'Bearer test-token')
        .send({ reason: 'Work quality issue' });

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.status).toBe(BookingStatus.DISPUTED);
    });
  });

  describe('POST /bookings/:id/rate', () => {
    it('debe calificar una reserva', async () => {
      const dto = {
        rating: 5,
        review: 'Great!',
      };

      const response = await request(app.getHttpServer())
        .post('/bookings/booking-123/rate')
        .set('Authorization', 'Bearer test-token')
        .send(dto);

      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body.resiRating).toBe(5);
    });
  });

  describe('GET /bookings/search/resis', () => {
    it('debe buscar resis disponibles', async () => {
      const response = await request(app.getHttpServer())
        .get('/bookings/search/resis')
        .query({
          addressId: 'address-123',
          scheduledAt: new Date(Date.now() + 86400000),
          minRating: 3.0,
        })
        .set('Authorization', 'Bearer test-token');

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toBeInstanceOf(Array);
    });
  });

  describe('GET /bookings/:id/stats', () => {
    it('debe obtener estadísticas de una reserva', async () => {
      const response = await request(app.getHttpServer())
        .get('/bookings/booking-123/stats')
        .set('Authorization', 'Bearer test-token');

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toHaveProperty('averageResiRating');
    });
  });
});
