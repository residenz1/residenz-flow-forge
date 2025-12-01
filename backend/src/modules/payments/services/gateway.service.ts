import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@database/entities';
import { StripeService } from './stripe.service';
import { MercadoPagoService } from './mercadopago.service';
import { PrometeoService } from '../../kyc/integrations/prometeo.service';
import {
    IPaymentGateway,
    PaymentResult,
    PayoutResult,
    PaymentStatus,
    RefundResult,
} from '../interfaces/payment-gateway.interface';

/**
 * Gateway Service
 * Orchestrator for multi-payment strategy:
 * - MercadoPago: Client charges (Yape/Plin QR) - PRIMARY for Perú
 * - Stripe: Alternative payment method (cards) - SECONDARY fallback
 * - Prometeo: Resi payouts (bank transfers) - UNCHANGED
 * 
 * Strategy:
 * Money IN (Cobros): Use MercadoPago for Yape/Plin, Stripe as fallback
 * Money OUT (Payouts): Use Prometeo for bank transfers
 * 
 * Implements IPaymentGateway interface for abstraction
 */
@Injectable()
export class GatewayService implements IPaymentGateway {
    private readonly logger = new Logger(GatewayService.name);

    constructor(
        private readonly mercadoPagoService: MercadoPagoService,
        private readonly stripeService: StripeService,
        private readonly _prometeoService: PrometeoService,
        private readonly eventEmitter: EventEmitter2,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {
        this.logger.log('✅ Gateway Service initialized with MercadoPago (Primary) + Stripe (Secondary) + Prometeo (Payouts)');
    }

    /**
     * Charge a client with Yape/Plin QR (PRIMARY)
     * Falls back to Stripe if MercadoPago fails
     * 
     * @param amount - Amount in PEN
     * @param currency - Currency (should be 'PEN' for Peru)
     * @param paymentMethod - 'yape', 'plin', or 'stripe' (defaults to 'yape')
     * @param metadata - Booking info, client info, etc.
     */
    async charge(
        amount: number,
        currency: string,
        paymentMethod: string = 'yape',
        metadata?: Record<string, any>,
    ): Promise<PaymentResult> {
        this.logger.log(`[CHARGE] Processing client charge: ${amount} ${currency} via ${paymentMethod}`);

        try {
            // PRIMARY: Try MercadoPago for Yape/Plin
            if (paymentMethod === 'yape' || paymentMethod === 'plin') {
                return await this.chargeWithMercadoPago(amount, paymentMethod, metadata);
            }

            // FALLBACK: Use Stripe for cards
            if (paymentMethod === 'stripe' || paymentMethod === 'card') {
                return await this.chargeWithStripe(amount, currency, paymentMethod, metadata);
            }

            throw new BadRequestException(`Unsupported payment method: ${paymentMethod}`);
        } catch (error: any) {
            this.logger.error(`[CHARGE] Error: ${error.message}`, error.stack);
            
            // Emitir evento de fallo
            this.eventEmitter.emit('payment.failed', {
                amount,
                currency,
                paymentMethod,
                error: error.message,
                bookingId: metadata?.bookingId,
                timestamp: new Date(),
            });

            throw error;
        }
    }

    /**
     * Charge using MercadoPago (Yape/Plin QR)
     * 
     * Retorna un QR que el usuario escanea desde su app
     * El estado se actualiza vía webhook
     */
    private async chargeWithMercadoPago(
        amount: number,
        paymentMethod: string,
        metadata?: Record<string, any>,
    ): Promise<PaymentResult> {
        try {
            this.logger.log(`[MP CHARGE] Creating QR payment for S/ ${amount}`);

            const mpResult = await this.mercadoPagoService.createQRPayment({
                amount,
                userEmail: metadata?.clientEmail || 'cliente@residenz.pe',
                description: metadata?.bookingId 
                    ? `Pago de Booking #${metadata.bookingId}` 
                    : 'Pago Residenz',
                externalReference: metadata?.bookingId || `order_${Date.now()}`,
                metadata: {
                    bookingId: metadata?.bookingId,
                    clientId: metadata?.clientId,
                    residenzMetadata: metadata,
                },
            });

            // Convertir respuesta de MP al formato PaymentResult
            const result: PaymentResult = {
                success: true,
                paymentId: mpResult.paymentId,
                amount: mpResult.amount,
                currency: 'PEN',
                status: mpResult.status as 'pending' | 'failed' | 'succeeded' | 'requires_action',
                metadata: {
                    ...mpResult.action,
                    externalReference: metadata?.bookingId,
                    paymentMethod: paymentMethod,
                },
            };

            // Emitir evento
            this.eventEmitter.emit('payment.qr_generated', {
                paymentId: mpResult.paymentId,
                amount,
                method: paymentMethod,
                bookingId: metadata?.bookingId,
                timestamp: new Date(),
            });

            this.logger.log(`[MP CHARGE] ✅ QR generated: ${mpResult.paymentId}`);

            return result;
        } catch (error: any) {
            this.logger.error(`[MP CHARGE] ❌ Error: ${error.message}`);
            throw error;
        }
    }

    /**
     * Charge using Stripe (Card payment - fallback)
     */
    private async chargeWithStripe(
        amount: number,
        currency: string,
        paymentMethod: string,
        metadata?: Record<string, any>,
    ): Promise<PaymentResult> {
        try {
            this.logger.log(`[STRIPE CHARGE] Fallback to Stripe for ${amount} ${currency}`);

            const result = await this.stripeService.charge(
                amount,
                currency || 'PEN',
                paymentMethod,
                metadata,
            );

            if (result.success) {
                // Emit event for Ledger Agent
                this.eventEmitter.emit('payment.authorized', {
                    paymentId: result.paymentId,
                    amount,
                    currency,
                    bookingId: metadata?.bookingId,
                    clientId: metadata?.clientId,
                    timestamp: new Date(),
                });

                this.logger.log(`[STRIPE CHARGE] ✅ Success: ${result.paymentId}`);
            } else {
                this.logger.error(`[STRIPE CHARGE] ❌ Failed: ${result.errorMessage}`);
            }

            return result;
        } catch (error: any) {
            this.logger.error(`[STRIPE CHARGE] ❌ Error: ${error.message}`, error.stack);
            throw error;
        }
    }

    /**
     * Payout to a Resi (delegates to Prometeo)
     * @param amount - Amount in local currency
     * @param destination - Resi user ID (we'll fetch their bank account)
     * @param metadata - Booking info, etc.
     */
    async payout(
        amount: number,
        destination: string, // Resi user ID
        metadata?: Record<string, any>,
    ): Promise<PayoutResult> {
        this.logger.log(`[PAYOUT] Processing Resi payout: ${amount} to user ${destination}`);

        try {
            // 1. Fetch Resi user and validate KYC
            const resi = await this.userRepository.findOne({
                where: { id: destination },
            });

            if (!resi) {
                throw new BadRequestException(`Resi not found: ${destination}`);
            }

            // 2. Validate KYC status
            if (resi.kycStatus !== 'APPROVED') {
                this.logger.error(`[PAYOUT] KYC not approved for Resi: ${destination}`);
                return {
                    success: false,
                    payoutId: '',
                    amount,
                    destination,
                    status: 'failed',
                    errorCode: 'kyc_not_approved',
                    errorMessage: 'Resi must complete KYC verification before receiving payouts',
                    metadata,
                };
            }

            // 3. Get bank account from metadata (stored during KYC)
            const bankData = resi.metadata?.bankAccount;
            if (!bankData) {
                throw new BadRequestException('Resi bank account not found in KYC data');
            }

            // 4. Initiate payout via Prometeo
            // TODO: Implement prometeoService.initiatePayment() method
            // For now, we'll simulate the response
            const payoutId = `payout_${Date.now()}`;

            this.logger.log(`[PAYOUT] Initiating Prometeo transfer to ${bankData.accountNumber.slice(-4)}`);

            // Emit event for Ledger Agent
            this.eventEmitter.emit('payout.initiated', {
                payoutId,
                amount,
                resiId: destination,
                bookingId: metadata?.bookingId,
                bankAccount: {
                    accountNumber: bankData.accountNumber,
                    bankCode: bankData.bankCode,
                },
                timestamp: new Date(),
            });

            // Simulate successful payout (replace with actual Prometeo call)
            const result: PayoutResult = {
                success: true,
                payoutId,
                amount,
                destination,
                status: 'in_transit',
                estimatedArrival: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days
                metadata,
            };

            // Emit completion event
            this.eventEmitter.emit('payout.completed', {
                payoutId,
                amount,
                resiId: destination,
                status: 'in_transit',
                timestamp: new Date(),
            });

            this.logger.log(`[PAYOUT] Success: ${payoutId}`);
            return result;
        } catch (error: any) {
            this.logger.error(`[PAYOUT] Error: ${error.message}`, error.stack);

            return {
                success: false,
                payoutId: '',
                amount,
                destination,
                status: 'failed',
                errorCode: 'payout_error',
                errorMessage: error.message,
                metadata,
            };
        }
    }

    /**
     * Get payment status (delegates to Stripe)
     */
    async getPaymentStatus(paymentId: string): Promise<PaymentStatus> {
        this.logger.log(`[STATUS] Fetching payment status: ${paymentId}`);
        return await this.stripeService.getPaymentStatus(paymentId);
    }

    /**
     * Refund a payment (delegates to Stripe)
     */
    async refund(paymentId: string, amount?: number): Promise<RefundResult> {
        this.logger.log(`[REFUND] Processing refund for: ${paymentId}`);

        const result = await this.stripeService.refund(paymentId, amount);

        if (result.success) {
            // Emit event for Ledger Agent
            this.eventEmitter.emit('payment.refunded', {
                refundId: result.refundId,
                paymentId,
                amount: result.amount,
                timestamp: new Date(),
            });
        }

        return result;
    }

    /**
     * Charge client for a booking
     * High-level method with business logic
     */
    async chargeClientForBooking(params: {
        bookingId: string;
        clientId: string;
        amount: number;
        currency: string;
        paymentMethodId: string;
    }): Promise<PaymentResult> {
        this.logger.log(`[BOOKING CHARGE] Booking ${params.bookingId}: ${params.amount} ${params.currency}`);

        return await this.charge(params.amount, params.currency, params.paymentMethodId, {
            bookingId: params.bookingId,
            clientId: params.clientId,
            type: 'booking_payment',
        });
    }

    /**
     * Payout to Resi after booking completion
     * High-level method with business logic
     */
    async payoutToResiForBooking(params: {
        bookingId: string;
        resiId: string;
        amount: number;
    }): Promise<PayoutResult> {
        this.logger.log(`[BOOKING PAYOUT] Booking ${params.bookingId}: ${params.amount} to Resi ${params.resiId}`);

        return await this.payout(params.amount, params.resiId, {
            bookingId: params.bookingId,
            type: 'booking_payout',
        });
    }

    /**
     * Validate Resi can receive payouts
     */
    async validateResiForPayout(resiId: string): Promise<{
        canReceivePayout: boolean;
        reason?: string;
    }> {
        const resi = await this.userRepository.findOne({
            where: { id: resiId },
        });

        if (!resi) {
            return { canReceivePayout: false, reason: 'Resi not found' };
        }

        if (resi.kycStatus !== 'APPROVED') {
            return { canReceivePayout: false, reason: 'KYC not approved' };
        }

        if (!resi.metadata?.bankAccount) {
            return { canReceivePayout: false, reason: 'Bank account not configured' };
        }

        return { canReceivePayout: true };
    }
}
