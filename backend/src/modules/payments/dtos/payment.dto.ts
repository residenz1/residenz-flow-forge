import { IsNumber, IsString, IsOptional, IsEmail, MinLength, MaxLength, IsEnum } from 'class-validator';

/**
 * DTO para crear un pago con Yape/Plin QR
 * 
 * Ejemplo:
 * {
 *   "amount": 50.00,
 *   "userEmail": "cliente@example.com",
 *   "description": "Pago por servicio de booking",
 *   "bookingId": "booking_123",
 *   "paymentMethod": "yape"
 * }
 */
export class CreatePaymentDto {
  @IsNumber({ maxDecimalPlaces: 2 })
  amount?: number;

  @IsEmail()
  userEmail?: string;

  @IsString()
  @MinLength(5)
  @MaxLength(100)
  description?: string;

  @IsString()
  @MinLength(1)
  bookingId?: string;

  @IsOptional()
  @IsEnum(['yape', 'plin', 'stripe', 'card'])
  paymentMethod?: string;

  @IsOptional()
  metadata?: Record<string, any>;
}

/**
 * DTO para obtener el estado de un pago
 * 
 * Response:
 * {
 *   "paymentId": "MP-123456",
 *   "status": "approved",
 *   "amount": 50.00,
 *   "currency": "PEN",
 *   "createdAt": "2025-12-01T10:30:00Z",
 *   "approvedAt": "2025-12-01T10:31:00Z",
 *   "bookingId": "booking_123"
 * }
 */
export class PaymentStatusDto {
  paymentId?: string;
  status?: 'pending' | 'approved' | 'rejected' | 'cancelled' | 'expired' | 'refunded';
  amount?: number;
  currency?: string;
  externalReference?: string;
  createdAt?: string;
  approvedAt?: string;
  rejectedAt?: string;
  paymentMethod?: string;
  lastStatus?: string;
  failureCode?: string;
  failureMessage?: string;
}

/**
 * DTO para solicitar un reembolso
 * 
 * Ejemplo:
 * {
 *   "paymentId": "MP-123456",
 *   "reason": "Solicitud del cliente",
 *   "amount": 50.00  // opcional, si no especifica reembolsa el total
 * }
 */
export class RefundPaymentDto {
  @IsString()
  paymentId?: string;

  @IsOptional()
  @IsString()
  reason?: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  amount?: number;
}

/**
 * DTO para la respuesta de reembolso
 */
export class RefundResponseDto {
  refundId?: string;
  paymentId?: string;
  amount?: number;
  currency?: string;
  status?: 'pending' | 'approved' | 'rejected';
  createdAt?: string;
  reason?: string;
}

/**
 * DTO para la respuesta al crear un pago QR
 * 
 * Ejemplo:
 * {
 *   "paymentId": "MP-123456",
 *   "status": "pending",
 *   "amount": 50.00,
 *   "currency": "PEN",
 *   "expiration": "2025-12-01T11:30:00Z",
 *   "action": {
 *     "type": "scan_qr",
 *     "instructions": "Escanea este QR con tu app de Yape o Plin",
 *     "qrRaw": "00020126000000",
 *     "qrImageBase64": "iVBORw0KGgoAAAANSUhEUgAAADIAA...",
 *     "ticketUrl": "https://mercadopago.com/tickets/MP-123456"
 *   }
 * }
 */
export class PaymentResponseDto {
  paymentId?: string;
  status?: 'pending' | 'approved' | 'rejected';
  amount?: number;
  currency?: string;
  expiration?: string;
  action?: {
    type: string;
    instructions: string;
    qrRaw: string;
    qrImageBase64: string;
    ticketUrl?: string;
  };
}

/**
 * DTO para webhook de MercadoPago
 */
export class MercadoPagoWebhookDto {
  id?: string;
  topic?: string;
  resource?: string;
  timestamp?: string;
}
