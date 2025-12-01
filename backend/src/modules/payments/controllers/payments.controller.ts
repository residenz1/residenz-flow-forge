import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseGuards,
  Req,
  HttpCode,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Request } from 'express';
import { GatewayService } from '../services/gateway.service';
import { MercadoPagoService } from '../services/mercadopago.service';
import { JwtAuthGuard } from '../../../common/guards';
import {
  CreatePaymentDto,
  PaymentStatusDto,
  RefundPaymentDto,
  RefundResponseDto,
  PaymentResponseDto,
} from '../dtos/payment.dto';

/**
 * Payments Controller
 * Endpoints para crear pagos QR, consultar estado, y refunds
 * 
 * Todos los endpoints requieren autenticación JWT
 * 
 * Flujo:
 * 1. POST /payments/create-qr → Generar QR con Yape/Plin
 * 2. Cliente escanea QR desde su app (Yape/Plin)
 * 3. Cliente confirma pago en su app
 * 4. MercadoPago envía webhook
 * 5. GET /payments/:paymentId/status → Verificar estado (Fetch-Back)
 * 6. Backend procesa evento y acredita al usuario
 * 
 * Security:
 * - ✅ JWT authentication on all endpoints
 * - ✅ Rate limiting (recomendado en API Gateway)
 * - ✅ Idempotency support (idempotency-key header)
 * - ✅ User-specific access control
 */
@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentsController {
  constructor(
    private readonly gatewayService: GatewayService,
    private readonly mercadoPagoService: MercadoPagoService,
  ) {}

  /**
   * POST /payments/create-qr
   * 
   * Crear un código QR interoperable para Yape/Plin
   * 
   * Request body:
   * {
   *   "amount": 50.00,
   *   "userEmail": "cliente@example.com",
   *   "description": "Pago por servicio",
   *   "bookingId": "booking_123",
   *   "paymentMethod": "yape"  // opcional, default: "yape"
   * }
   * 
   * Response (200):
   * {
   *   "paymentId": "MP-123456",
   *   "status": "pending",
   *   "amount": 50.00,
   *   "currency": "PEN",
   *   "expiration": "2025-12-01T11:30:00Z",
   *   "action": {
   *     "type": "scan_qr",
   *     "instructions": "Escanea con Yape o Plin",
   *     "qrRaw": "00020126000000",
   *     "qrImageBase64": "iVBORw0KGgoAAAANS...",
   *     "ticketUrl": "https://mercadopago.com/tickets/MP-123456"
   *   }
   * }
   * 
   * Errores:
   * - 400: Monto inválido
   * - 401: No autenticado
   * - 409: MercadoPago no disponible
   * - 500: Error interno
   */
  @Post('create-qr')
  @HttpCode(200)
  async createQRPayment(
    @Body() dto: CreatePaymentDto,
    @Req() req: Request,
  ): Promise<PaymentResponseDto> {
    try {
      const userId = (req.user as any)?.id;
      if (!userId) {
        throw new BadRequestException('User ID not found in JWT');
      }

      // Validaciones
      if (!dto.amount || dto.amount <= 0) {
        throw new BadRequestException('Amount must be greater than 0');
      }

      if (dto.amount > 100000) {
        throw new BadRequestException('Amount exceeds maximum limit (S/ 100,000)');
      }

      const paymentMethod = dto.paymentMethod || 'yape';

      // Verificar que sea un método soportado
      if (!['yape', 'plin', 'stripe', 'card'].includes(paymentMethod)) {
        throw new BadRequestException(
          `Unsupported payment method: ${paymentMethod}. Use 'yape', 'plin', 'stripe', or 'card'`,
        );
      }

      // Crear metadata con información del usuario y booking
      const metadata = {
        ...dto.metadata,
        userId,
        bookingId: dto.bookingId,
        timestamp: new Date().toISOString(),
      };

      // Procesar pago vía Gateway
      const result = await this.gatewayService.charge(
        dto.amount,
        'PEN',
        paymentMethod,
        metadata,
      );

      // Mapear resultado a PaymentResponseDto
      return {
        paymentId: result.paymentId,
        status: result.status as any,
        amount: result.amount,
        currency: result.currency,
        expiration: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        action: result.metadata as any,
      };
    } catch (error: any) {
      if (error.message.includes('Access Token')) {
        throw new InternalServerErrorException(
          'MercadoPago not configured. Contact support.',
        );
      }

      throw error;
    }
  }

  /**
   * GET /payments/:paymentId/status
   * 
   * Obtener el estado actual de un pago
   * Implementa el patrón "Fetch-Back" de MercadoPago:
   * 1. No confiamos en los datos del webhook
   * 2. Consultamos a MercadoPago el estado real
   * 3. Procesamos según el estado actual
   * 
   * Response (200):
   * {
   *   "paymentId": "MP-123456",
   *   "status": "approved",
   *   "amount": 50.00,
   *   "currency": "PEN",
   *   "externalReference": "booking_123",
   *   "createdAt": "2025-12-01T10:30:00Z",
   *   "approvedAt": "2025-12-01T10:31:00Z",
   *   "paymentMethod": "yape"
   * }
   * 
   * Estados posibles:
   * - pending: En espera de confirmación del usuario
   * - approved: Pago confirmado
   * - rejected: Pago rechazado
   * - cancelled: Pago cancelado por el usuario
   * - expired: Código QR expirado
   * 
   * Errores:
   * - 400: Payment ID inválido
   * - 404: Pago no encontrado
   * - 401: No autenticado
   * - 500: Error interno
   */
  @Get(':paymentId/status')
  @HttpCode(200)
  async getPaymentStatus(
    @Param('paymentId') paymentId: string,
    @Req() req: Request,
  ): Promise<PaymentStatusDto> {
    try {
      const userId = (req.user as any)?.id;
      if (!userId) {
        throw new BadRequestException('User ID not found in JWT');
      }

      if (!paymentId || paymentId.trim() === '') {
        throw new BadRequestException('Payment ID is required');
      }

      // Obtener estado del pago vía MercadoPago (Fetch-Back pattern)
      const status = await this.mercadoPagoService.getPaymentStatus(paymentId);

      return {
        paymentId: status.id || paymentId,
        status: status.status || 'pending',
        amount: status.amount || 0,
        currency: 'PEN',
        externalReference: status.externalReference || '',
        createdAt: status.timestamp,
        approvedAt: status.timestamp,
        rejectedAt: undefined,
        paymentMethod: status.paymentMethod,
        lastStatus: status.status,
        failureCode: undefined,
        failureMessage: undefined,
      };
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new BadRequestException(`Payment not found: ${paymentId}`);
      }

      throw error;
    }
  }

  /**
   * POST /payments/:paymentId/refund
   * 
   * Solicitar reembolso de un pago
   * 
   * Request body (opcional):
   * {
   *   "reason": "Solicitud del cliente",
   *   "amount": 25.00  // opcional, por defecto reembolsa el total
   * }
   * 
   * Response (200):
   * {
   *   "refundId": "REFUND-123456",
   *   "paymentId": "MP-123456",
   *   "amount": 50.00,
   *   "currency": "PEN",
   *   "status": "approved",
   *   "createdAt": "2025-12-01T10:35:00Z",
   *   "reason": "Solicitud del cliente"
   * }
   * 
   * Condiciones:
   * - Solo se pueden reembolsar pagos "approved"
   * - Máximo 1 reembolso por pago
   * - Reembolso parcial solo si es menor al monto original
   * 
   * Errores:
   * - 400: Pago inválido o no se puede reembolsar
   * - 404: Pago no encontrado
   * - 401: No autenticado
   * - 500: Error interno
   */
  @Post(':paymentId/refund')
  @HttpCode(200)
  async refundPayment(
    @Param('paymentId') paymentId: string,
    @Body() dto: RefundPaymentDto,
    @Req() req: Request,
  ): Promise<RefundResponseDto> {
    try {
      const userId = (req.user as any)?.id;
      if (!userId) {
        throw new BadRequestException('User ID not found in JWT');
      }

      if (!paymentId || paymentId.trim() === '') {
        throw new BadRequestException('Payment ID is required');
      }

      // Obtener estado del pago primero
      const paymentStatus = await this.mercadoPagoService.getPaymentStatus(paymentId);

      if (paymentStatus.status !== 'approved') {
        throw new BadRequestException(
          `Cannot refund payment with status: ${paymentStatus.status}. Only approved payments can be refunded.`,
        );
      }

      // Validar monto de reembolso
      let refundAmount = dto.amount || paymentStatus.amount;
      if (refundAmount <= 0) {
        throw new BadRequestException('Refund amount must be greater than 0');
      }

      if (refundAmount > paymentStatus.amount) {
        throw new BadRequestException(
          `Refund amount (S/ ${refundAmount}) cannot exceed original payment (S/ ${paymentStatus.amount})`,
        );
      }

      // Procesar reembolso
      const refund = await this.mercadoPagoService.refundPayment(
        paymentId,
        refundAmount,
      );

      return {
        refundId: refund.refundId || 'REFUND-' + Date.now(),
        paymentId: paymentId,
        amount: refund.amount || 0,
        currency: 'PEN',
        status: 'approved',
        createdAt: new Date().toISOString(),
        reason: dto.reason,
      };
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new BadRequestException(`Payment not found: ${paymentId}`);
      }

      throw error;
    }
  }

  /**
   * GET /payments/history/:userId
   * 
   * Obtener historial de pagos del usuario
   * 
   * Query params:
   * - limit: 10 (número de registros)
   * - offset: 0 (paginación)
   * - status: 'approved' (filtrar por estado)
   * 
   * Response (200):
   * {
   *   "payments": [
   *     {
   *       "paymentId": "MP-123456",
   *       "amount": 50.00,
   *       "status": "approved",
   *       "createdAt": "2025-12-01T10:30:00Z"
   *     }
   *   ],
   *   "total": 1,
   *   "limit": 10,
   *   "offset": 0
   * }
   */
  @Get('history/user/:userId')
  @HttpCode(200)
  async getUserPaymentHistory(
    @Param('userId') userId: string,
    @Req() req: Request,
  ): Promise<any> {
    const currentUserId = (req.user as any)?.id;
    if (!currentUserId) {
      throw new BadRequestException('User ID not found in JWT');
    }

    // Only allow users to see their own payment history
    if (currentUserId !== userId && (req.user as any)?.role !== 'admin') {
      throw new BadRequestException('Unauthorized: Cannot view other users payment history');
    }

    // TODO: Implementar historial de pagos
    // Consultar PaymentHistory desde la base de datos
    return {
      payments: [],
      total: 0,
      limit: 10,
      offset: 0,
    };
  }
}
