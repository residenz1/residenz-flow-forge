import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { BookingService } from '../services/booking.service';
import {
  CreateBookingDto,
  UpdateBookingDto,
  RateBookingDto,
  ListBookingsDto,
  FindResiDto,
} from '../dtos';
import { JwtAuthGuard, RolesGuard } from '@common/guards';
import { CurrentUser, Roles } from '@common/decorators';

/**
 * Bookings Controller
 * Endpoints para gestión de reservas
 * Rutas:
 * - POST   /bookings              - Crear reserva
 * - GET    /bookings/:id          - Obtener reserva por ID
 * - GET    /bookings              - Listar mis reservas
 * - GET    /bookings/resi/:resiId - Listar reservas de un resi
 * - PATCH  /bookings/:id          - Actualizar reserva
 * - PATCH  /bookings/:id/confirm  - Confirmar reserva (resi)
 * - PATCH  /bookings/:id/start    - Iniciar reserva (resi)
 * - PATCH  /bookings/:id/complete - Completar reserva (resi)
 * - PATCH  /bookings/:id/cancel   - Cancelar reserva
 * - PATCH  /bookings/:id/dispute  - Disputar reserva
 * - POST   /bookings/:id/rate     - Calificar reserva
 * - GET    /bookings/search/resis - Buscar resis disponibles
 */
@Controller('bookings')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BookingsController {
  constructor(private bookingService: BookingService) {}

  /**
   * Crear una nueva reserva
   * POST /bookings
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles('CLIENT')
  async createBooking(
    @CurrentUser('sub') clientId: string,
    @Body() dto: CreateBookingDto,
  ) {
    return await this.bookingService.createBooking(clientId, dto);
  }

  /**
   * Obtener una reserva por ID
   * GET /bookings/:id
   */
  @Get(':id')
  async getBooking(@Param('id') bookingId: string) {
    return await this.bookingService.getBooking(bookingId);
  }

  /**
   * Listar mis reservas (cliente o resi)
   * GET /bookings?page=1&limit=20&status=CONFIRMED
   */
  @Get()
  async listMyBookings(
    @CurrentUser('sub') userId: string,
    @CurrentUser('role') role: string,
    @Query() dto: ListBookingsDto,
  ) {
    if (role === 'CLIENT') {
      return await this.bookingService.getClientBookings(userId, dto);
    } else if (role === 'RESI') {
      return await this.bookingService.getResiBookings(userId, dto);
    }
    return { data: [], total: 0, page: 0, limit: 0 };
  }

  /**
   * Listar reservas de un resi específico
   * GET /bookings/resi/:resiId
   */
  @Get('resi/:resiId')
  @Roles('ADMIN')
  async getResiBookings(
    @Param('resiId') resiId: string,
    @Query() dto: ListBookingsDto,
  ) {
    return await this.bookingService.getResiBookings(resiId, dto);
  }

  /**
   * Actualizar una reserva
   * PATCH /bookings/:id
   */
  @Patch(':id')
  @Roles('CLIENT', 'RESI')
  async updateBooking(
    @Param('id') bookingId: string,
    @CurrentUser('sub') userId: string,
    @Body() dto: UpdateBookingDto,
  ) {
    // Validar que el usuario sea propietario de la reserva
    const booking = await this.bookingService.getBooking(bookingId);
    if (booking.clientId !== userId && booking.resiId !== userId) {
      throw new Error('No tienes permiso para actualizar esta reserva');
    }

    return await this.bookingService.updateBooking(bookingId, dto);
  }

  /**
   * Confirmar una reserva (PENDING → CONFIRMED)
   * PATCH /bookings/:id/confirm
   */
  @Patch(':id/confirm')
  @HttpCode(HttpStatus.OK)
  @Roles('RESI')
  async confirmBooking(
    @Param('id') bookingId: string,
    @CurrentUser('sub') _resiId: string,
  ) {
    return await this.bookingService.confirmBooking(bookingId, _resiId);
  }

  /**
   * Iniciar reserva (CONFIRMED → IN_PROGRESS)
   * PATCH /bookings/:id/start
   */
  @Patch(':id/start')
  @HttpCode(HttpStatus.OK)
  @Roles('RESI')
  async startBooking(
    @Param('id') bookingId: string,
    @CurrentUser('sub') _resiId: string,
  ) {
    return await this.bookingService.startBooking(bookingId);
  }

  /**
   * Completar reserva (IN_PROGRESS → COMPLETED)
   * PATCH /bookings/:id/complete
   */
  @Patch(':id/complete')
  @HttpCode(HttpStatus.OK)
  @Roles('RESI')
  async completeBooking(
    @Param('id') bookingId: string,
    @CurrentUser('sub') _resiId: string,
  ) {
    return await this.bookingService.completeBooking(bookingId);
  }

  /**
   * Cancelar una reserva
   * DELETE /bookings/:id
   * o
   * PATCH /bookings/:id/cancel
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @Roles('CLIENT', 'RESI')
  async cancelBooking(
    @Param('id') bookingId: string,
    @CurrentUser('sub') _userId: string,
    @Query('reason') reason?: string,
  ) {
    return await this.bookingService.cancelBooking(bookingId, reason);
  }

  /**
   * Disputar una reserva
   * PATCH /bookings/:id/dispute
   */
  @Patch(':id/dispute')
  @HttpCode(HttpStatus.OK)
  @Roles('CLIENT', 'RESI')
  async disputeBooking(
    @Param('id') bookingId: string,
    @Body('reason') reason: string,
  ) {
    return await this.bookingService.disputeBooking(bookingId, reason);
  }

  /**
   * Calificar una reserva
   * POST /bookings/:id/rate
   */
  @Post(':id/rate')
  @HttpCode(HttpStatus.CREATED)
  @Roles('CLIENT', 'RESI')
  async rateBooking(
    @Param('id') bookingId: string,
    @CurrentUser('sub') userId: string,
    @CurrentUser('role') role: string,
    @Body() dto: RateBookingDto,
  ) {
    return await this.bookingService.rateBooking(
      bookingId,
      userId,
      role as 'CLIENT' | 'RESI',
      dto,
    );
  }

  /**
   * Buscar resis disponibles
   * GET /bookings/search/resis
   */
  @Get('search/resis')
  @Roles('CLIENT')
  async findAvailableResis(@Query() dto: FindResiDto) {
    return await this.bookingService.findAvailableResis(dto);
  }

  /**
   * Obtener estadísticas de una reserva
   * GET /bookings/:id/stats
   */
  @Get(':id/stats')
  async getBookingStats(@Param('id') bookingId: string) {
    return await this.bookingService.getBookingStats(bookingId);
  }
}
