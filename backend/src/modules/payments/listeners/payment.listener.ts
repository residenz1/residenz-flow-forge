import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EventEmitter2 } from '@nestjs/event-emitter';

/**
 * Payment Listener
 * Escucha eventos de pagos y realiza acciones según el estado
 * 
 * Flujo de eventos:
 * 1. mercadopago.payment.approved → Acreditar al usuario, marcar booking como pagado
 * 2. mercadopago.payment.rejected → Liberar fondos en escrow, notificar al usuario
 * 3. mercadopago.payment.pending → Enviar recordatorio, aguardar confirmación
 * 4. mercadopago.payment.cancelled → Liberar fondos, marcar booking como cancelado
 * 
 * Los eventos son emitidos por:
 * - GatewayService.charge()
 * - WebhookController (desde webhook de MercadoPago)
 * 
 * Estos listeners son consumidores de eventos que:
 * - Actualizan estado de pagos en BD
 * - Acreditan/debitan cuentas de usuarios (banking module)
 * - Actualizan estado de bookings
 * - Envían notificaciones (SMS, push, email)
 * - Disparan otros eventos (cascada de eventos)
 */
@Injectable()
export class PaymentListener {
  private readonly logger = new Logger(PaymentListener.name);

  constructor(
    private eventEmitter: EventEmitter2,
  ) {}

  /**
   * Evento: mercadopago.payment.approved
   * 
   * Cuando un pago es aprobado:
   * 1. Buscar el booking asociado
   * 2. Acreditar al usuario (crear transacción en banking)
   * 3. Marcar booking como "payment_confirmed"
   * 4. Liberar dinero del escrow a la cuenta principal del usuario
   * 5. Acreditar dinero al resi (wallet)
   * 6. Enviar notificaciones (SMS/email)
   * 7. Disparar evento "booking.payment_confirmed"
   * 
   * Payload:
   * {
   *   "paymentId": "MP-123456",
   *   "amount": 50.00,
   *   "currency": "PEN",
   *   "externalReference": "booking_123",
   *   "userId": "user_123",
   *   "metadata": { ... }
   * }
   */
  @OnEvent('mercadopago.payment.approved')
  async handlePaymentApproved(payload: any) {
    this.logger.log(
      `[PAYMENT APPROVED] Payment ${payload.paymentId} for booking ${payload.externalReference}`,
    );

    try {
      const {
        paymentId,
        amount,
        currency,
        externalReference: bookingId,
        userId,
        _metadata = {},
      } = payload;

      /**
       * Paso 1: Buscar el booking
       * TODO: Implementar BookingsService.findById(bookingId)
       * const booking = await this.bookingsService.findById(bookingId);
       * if (!booking) throw new Error(`Booking not found: ${bookingId}`);
       */

      /**
       * Paso 2: Acreditar al usuario
       * - Mover dinero desde "escrow" a "principal" de usuario
       * TODO: Implementar BankingService.credit()
       * await this.bankingService.credit({
       *   userId,
       *   amount,
       *   currency,
       *   accountType: 'principal', // Cuenta principal del cliente
       *   description: `Payment received for booking ${bookingId}`,
       *   reference: paymentId,
       *   transactionType: 'payment_received'
       * });
       */

      /**
       * Paso 3: Actualizar booking a "payment_confirmed"
       * TODO: Implementar BookingsService.updateStatus()
       * await this.bookingsService.updateStatus(bookingId, {
       *   status: 'payment_confirmed',
       *   paymentId: paymentId,
       *   paidAmount: amount,
       *   paidAt: new Date()
       * });
       */

      /**
       * Paso 4: Acreditar al resi
       * - Si el booking tiene un resi asignado, acreditarle comisión
       * TODO: Implementar ResiPaymentService
       * if (booking.resiId) {
       *   const commission = amount * 0.85; // 85% para resi, 15% plataforma
       *   await this.resiService.creditWallet({
       *     resiId: booking.resiId,
       *     amount: commission,
       *     description: `Commission for booking ${bookingId}`,
       *     reference: paymentId
       *   });
       * }
       */

      /**
       * Paso 5: Enviar notificaciones
       * TODO: Implementar NotificationsService
       * await this.notificationsService.sendPaymentConfirmedNotification({
       *   userId,
       *   bookingId,
       *   amount,
       *   currency,
       *   paymentId
       * });
       */

      /**
       * Paso 6: Disparar evento cascada
       * Otros módulos pueden escuchar este evento
       */
      this.eventEmitter.emit('booking.payment_confirmed', {
        bookingId,
        paymentId,
        amount,
        currency,
        userId,
      });

      this.logger.log(
        `✅ [PAYMENT APPROVED] Successfully processed payment ${paymentId} for booking ${bookingId}`,
      );
    } catch (error: any) {
      this.logger.error(
        `❌ [PAYMENT APPROVED] Error processing payment: ${error.message}`,
        error.stack,
      );

      // Disparar evento de error para que otros listeners lo capturen
      this.eventEmitter.emit('payment.error', {
        ...payload,
        error: error.message,
      });
    }
  }

  /**
   * Evento: mercadopago.payment.rejected
   * 
   * Cuando un pago es rechazado:
   * 1. Buscar el booking asociado
   * 2. Liberar fondos del escrow del usuario
   * 3. Marcar booking como "payment_failed"
   * 4. Enviar notificación al usuario con razón de rechazo
   * 5. Disparar evento "booking.payment_failed"
   * 
   * Payload:
   * {
   *   "paymentId": "MP-123456",
   *   "amount": 50.00,
   *   "externalReference": "booking_123",
   *   "userId": "user_123",
   *   "failureCode": "rejected_by_bank",
   *   "failureMessage": "Fondos insuficientes"
   * }
   */
  @OnEvent('mercadopago.payment.rejected')
  async handlePaymentRejected(payload: any) {
    this.logger.log(
      `[PAYMENT REJECTED] Payment ${payload.paymentId} - Reason: ${payload.failureMessage}`,
    );

    try {
      const {
        paymentId,
        amount,
        currency,
        externalReference: bookingId,
        userId: _userId,
        failureCode,
        failureMessage,
      } = payload;

      /**
       * Paso 1: Buscar el booking
       * TODO: Implementar BookingsService.findById()
       * const booking = await this.bookingsService.findById(bookingId);
       */

      /**
       * Paso 2: Liberar fondos del escrow
       * TODO: Implementar BankingService.releaseEscrow()
       * await this.bankingService.releaseEscrow({
       *   userId,
       *   amount,
       *   reason: 'Payment rejected',
       *   reference: paymentId
       * });
       */

      /**
       * Paso 3: Actualizar booking a "payment_failed"
       * TODO: Implementar BookingsService.updateStatus()
       * await this.bookingsService.updateStatus(bookingId, {
       *   status: 'payment_failed',
       *   paymentId: paymentId,
       *   failureCode,
       *   failureMessage,
       *   failedAt: new Date()
       * });
       */

      /**
       * Paso 4: Enviar notificación al usuario
       * TODO: Implementar NotificationsService
       * await this.notificationsService.sendPaymentFailedNotification({
       *   userId,
       *   bookingId,
       *   amount,
       *   reason: failureMessage,
       *   paymentId
       * });
       */

      /**
       * Paso 5: Disparar evento cascada
       */
      this.eventEmitter.emit('booking.payment_failed', {
        bookingId,
        paymentId,
        amount,
        currency,
        userId: _userId,
        failureCode,
        failureMessage,
      });

      this.logger.log(
        `⚠️ [PAYMENT REJECTED] Processed rejection for payment ${paymentId}`,
      );
    } catch (error: any) {
      this.logger.error(
        `❌ [PAYMENT REJECTED] Error processing rejection: ${error.message}`,
        error.stack,
      );

      this.eventEmitter.emit('payment.error', {
        ...payload,
        error: error.message,
      });
    }
  }

  /**
   * Evento: mercadopago.payment.pending
   * 
   * Cuando un pago está pendiente (usuario aún no confirmó en su app):
   * 1. Marcar booking como "awaiting_payment_confirmation"
   * 2. Enviar recordatorio al usuario
   * 3. Guardar timestamp para expiración
   * 
   * Si pasa más de 60 minutos sin confirmación → mercadopago.payment.cancelled
   * 
   * Payload:
   * {
   *   "paymentId": "MP-123456",
   *   "externalReference": "booking_123",
   *   "userId": "user_123",
   *   "expiresAt": "2025-12-01T11:30:00Z"
   * }
   */
  @OnEvent('mercadopago.payment.pending')
  async handlePaymentPending(payload: any) {
    this.logger.log(
      `[PAYMENT PENDING] Awaiting confirmation for payment ${payload.paymentId}`,
    );

    try {
      const {
        paymentId,
        externalReference: _bookingId,
        userId: _userId,
        expiresAt,
      } = payload;

      /**
       * Paso 1: Actualizar booking a "awaiting_payment_confirmation"
       * TODO: Implementar BookingsService.updateStatus()
       * await this.bookingsService.updateStatus(bookingId, {
       *   status: 'awaiting_payment_confirmation',
       *   paymentId: paymentId,
       *   expiresAt: new Date(expiresAt)
       * });
       */

      /**
       * Paso 2: Enviar recordatorio al usuario
       * TODO: Implementar NotificationsService
       * await this.notificationsService.sendPaymentReminderNotification({
       *   userId,
       *   bookingId,
       *   paymentId,
       *   expiresAt
       * });
       */

      this.logger.log(
        `⏳ [PAYMENT PENDING] Set expiration for payment ${paymentId} at ${expiresAt}`,
      );
    } catch (error: any) {
      this.logger.error(
        `❌ [PAYMENT PENDING] Error processing pending payment: ${error.message}`,
        error.stack,
      );

      this.eventEmitter.emit('payment.error', {
        ...payload,
        error: error.message,
      });
    }
  }

  /**
   * Evento: mercadopago.payment.cancelled
   * 
   * Cuando un pago es cancelado (timeout o cancelación del usuario):
   * 1. Buscar el booking
   * 2. Liberar fondos del escrow
   * 3. Marcar booking como "cancelled"
   * 4. Enviar notificación al usuario
   * 5. Si hay un resi asignado, liberarlo también
   * 
   * Payload:
   * {
   *   "paymentId": "MP-123456",
   *   "externalReference": "booking_123",
   *   "userId": "user_123",
   *   "reason": "timeout" | "user_cancelled"
   * }
   */
  @OnEvent('mercadopago.payment.cancelled')
  async handlePaymentCancelled(payload: any) {
    this.logger.log(
      `[PAYMENT CANCELLED] Payment ${payload.paymentId} cancelled - Reason: ${payload.reason}`,
    );

    try {
      const {
        paymentId,
        externalReference: _bookingId,
        userId: _userId,
        reason: _reason,
      } = payload;

      /**
       * Paso 1: Buscar el booking
       * TODO: Implementar BookingsService.findById()
       * const booking = await this.bookingsService.findById(bookingId);
       */

      /**
       * Paso 2: Liberar fondos del escrow
       * TODO: Implementar BankingService.releaseEscrow()
       * await this.bankingService.releaseEscrow({
       *   userId,
       *   reason: `Payment cancelled - ${reason}`,
       *   reference: paymentId
       * });
       */

      /**
       * Paso 3: Marcar booking como "cancelled"
       * TODO: Implementar BookingsService.updateStatus()
       * await this.bookingsService.updateStatus(bookingId, {
       *   status: 'cancelled',
       *   paymentId: paymentId,
       *   cancelledAt: new Date(),
       *   cancelReason: reason
       * });
       */

      /**
       * Paso 4: Liberar al resi si estaba asignado
       * TODO: Implementar ResiService
       * if (booking.resiId) {
       *   await this.resiService.releaseBooking(booking.resiId, bookingId);
       * }
       */

      /**
       * Paso 5: Enviar notificación
       * TODO: Implementar NotificationsService
       * await this.notificationsService.sendPaymentCancelledNotification({
       *   userId,
       *   bookingId,
       *   reason
       * });
       */

      this.logger.log(
        `❌ [PAYMENT CANCELLED] Processed cancellation for payment ${paymentId}`,
      );
    } catch (error: any) {
      this.logger.error(
        `❌ [PAYMENT CANCELLED] Error processing cancellation: ${error.message}`,
        error.stack,
      );

      this.eventEmitter.emit('payment.error', {
        ...payload,
        error: error.message,
      });
    }
  }

  /**
   * Evento: payment.error
   * 
   * Cuando hay un error procesando cualquier pago
   * Este listener asegura que los errores se registren y notifiquen
   */
  @OnEvent('payment.error')
  async handlePaymentError(payload: any) {
    this.logger.error(
      `[PAYMENT ERROR] Error in payment processing: ${payload.error}`,
      `Payment: ${payload.paymentId}, Booking: ${payload.externalReference}`,
    );

    try {
      // TODO: Implementar alertas a administrador
      // await this.alertService.notifyAdmins({
      //   severity: 'high',
      //   message: `Payment error: ${payload.error}`,
      //   payload
      // });
    } catch (error: any) {
      this.logger.error(
        `Failed to notify admins about payment error: ${error.message}`,
      );
    }
  }
}
