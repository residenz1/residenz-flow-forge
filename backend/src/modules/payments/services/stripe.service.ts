import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import Stripe from 'stripe';
import {
    IPaymentGateway,
    PaymentResult,
    PayoutResult,
    PaymentStatus,
    RefundResult,
} from '../interfaces/payment-gateway.interface';

/**
 * Stripe Service - Enhanced Implementation for Peru (PEN)
 * 
 * Features:
 * - 3D Secure (SCA) support
 * - Automatic retry logic for transient errors
 * - Comprehensive error handling
 * - Webhook signature verification
 * - Default currency: PEN (Soles Peruanos)
 * 
 * Security:
 * - PCI DSS Level 1 compliant (Stripe handles card data)
 * - Strong Customer Authentication (SCA/3DS2)
 * - Fraud detection via Stripe Radar
 * - HMAC-SHA256 webhook signature verification
 */
@Injectable()
export class StripeService implements IPaymentGateway {
    private readonly logger = new Logger(StripeService.name);
    private readonly stripe: Stripe;
    private readonly webhookSecret: string;

    constructor(
        private configService: ConfigService,
        private _eventEmitter: EventEmitter2,
    ) {
        const apiKey = this.configService.get<string>('stripe.apiKey');
        this.webhookSecret = this.configService.get<string>('stripe.webhookSecret') || '';

        if (!apiKey) {
            this.logger.warn('⚠️  Stripe API key not configured - payments will fail');
        }

        this.stripe = new Stripe(apiKey || 'sk_test_dummy', {
            apiVersion: '2023-10-16',
            typescript: true,
            maxNetworkRetries: 3,
            timeout: 30000,
        });

        this.logger.log('✅ Stripe service initialized (Currency: PEN - Soles Peruanos)');
    }

    /**
     * Create Payment Intent (Recommended - supports 3D Secure)
     * Default currency: PEN (Soles Peruanos)
     */
    async createPaymentIntent(params: {
        amount: number;
        currency?: string;
        customerId: string;
        paymentMethodId?: string;
        captureMethod?: 'automatic' | 'manual';
        metadata?: Record<string, any>;
    }): Promise<{
        paymentIntentId: string;
        clientSecret: string;
        status: string;
        requiresAction: boolean;
    }> {
        try {
            const { amount, currency = 'PEN', customerId, paymentMethodId, captureMethod, metadata } = params;
            this.logger.log(`[PAYMENT INTENT] Creating for ${amount} ${currency.toUpperCase()}`);

            const amountInCents = Math.round(amount * 100);

            const paymentIntent = await this.stripe.paymentIntents.create({
                amount: amountInCents,
                currency: currency.toLowerCase(),
                customer: customerId,
                payment_method: paymentMethodId,
                capture_method: captureMethod || 'automatic',
                confirmation_method: 'manual',
                payment_method_options: {
                    card: {
                        request_three_d_secure: 'automatic',
                    },
                },
                metadata: {
                    ...metadata,
                    source: 'residenz_backend',
                    timestamp: new Date().toISOString(),
                },
                return_url: this.configService.get('app.frontendUrl') + '/payments/confirm',
            });

            this.logger.log(`[PAYMENT INTENT] Created: ${paymentIntent.id}, status: ${paymentIntent.status}`);

            return {
                paymentIntentId: paymentIntent.id,
                clientSecret: paymentIntent.client_secret!,
                status: paymentIntent.status,
                requiresAction: paymentIntent.status === 'requires_action',
            };
        } catch (error: any) {
            this.logger.error(`[PAYMENT INTENT] Failed: ${error.message}`, error.stack);
            throw this.handleStripeError(error);
        }
    }

    /**
     * Charge (legacy method - implements IPaymentGateway)
     * Default currency: PEN (Soles Peruanos)
     */
    async charge(
        amount: number,
        currency: string = 'PEN',
        source: string,
        metadata?: Record<string, any>,
    ): Promise<PaymentResult> {
        try {
            this.logger.log(`[CHARGE] Direct charge: ${amount} ${currency.toUpperCase()}`);

            const amountInCents = Math.round(amount * 100);

            const paymentIntent = await this.stripe.paymentIntents.create({
                amount: amountInCents,
                currency: currency.toLowerCase(),
                payment_method: source,
                confirm: true,
                automatic_payment_methods: {
                    enabled: true,
                    allow_redirects: 'never',
                },
                metadata: metadata || {},
            });

            return {
                success: paymentIntent.status === 'succeeded',
                paymentId: paymentIntent.id,
                amount,
                currency: currency.toUpperCase(),
                status: this.mapStripeStatus(paymentIntent.status),
                providerResponse: paymentIntent,
                metadata,
            };
        } catch (error: any) {
            this.logger.error(`[CHARGE] Failed: ${error.message}`, error.stack);

            return {
                success: false,
                paymentId: '',
                amount,
                currency: currency.toUpperCase(),
                status: 'failed',
                errorCode: error.code || 'stripe_error',
                errorMessage: this.getUserFriendlyErrorMessage(error),
                metadata,
            };
        }
    }

    /**
     * Payout via Stripe (not recommended - use Prometeo instead)
     * Default currency: PEN (Soles Peruanos)
     */
    async payout(
        amount: number,
        destination: string,
        metadata?: Record<string, any>,
    ): Promise<PayoutResult> {
        this.logger.warn('[PAYOUT] ⚠️  Stripe payout called - use Prometeo for lower fees');

        try {
            const amountInCents = Math.round(amount * 100);

            const payout = await this.stripe.payouts.create({
                amount: amountInCents,
                currency: 'pen',
                destination: destination,
                metadata: metadata || {},
            });

            return {
                success: true,
                payoutId: payout.id,
                amount,
                destination,
                status: this.mapPayoutStatus(payout.status),
                estimatedArrival: payout.arrival_date ? new Date(payout.arrival_date * 1000) : undefined,
                providerResponse: payout,
                metadata,
            };
        } catch (error: any) {
            this.logger.error(`[PAYOUT] Failed: ${error.message}`, error.stack);

            return {
                success: false,
                payoutId: '',
                amount,
                destination,
                status: 'failed',
                errorCode: error.code || 'stripe_payout_error',
                errorMessage: error.message,
                metadata,
            };
        }
    }

    /**
     * Get payment status
     */
    async getPaymentStatus(paymentId: string): Promise<PaymentStatus> {
        try {
            const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentId);

            return {
                id: paymentIntent.id,
                status: this.mapStripeStatus(paymentIntent.status),
                amount: paymentIntent.amount / 100,
                currency: paymentIntent.currency.toUpperCase(),
                createdAt: new Date(paymentIntent.created * 1000),
                updatedAt: new Date(),
                metadata: paymentIntent.metadata,
            };
        } catch (error: any) {
            this.logger.error(`[STATUS] Failed to get payment status: ${error.message}`);
            throw this.handleStripeError(error);
        }
    }

    /**
     * Refund a payment
     */
    async refund(paymentId: string, amount?: number): Promise<RefundResult> {
        try {
            this.logger.log(`[REFUND] Creating refund for: ${paymentId}`);

            const refund = await this.stripe.refunds.create({
                payment_intent: paymentId,
                amount: amount ? Math.round(amount * 100) : undefined,
                reason: 'requested_by_customer',
            });

            this.logger.log(`[REFUND] Created: ${refund.id}, status: ${refund.status}`);

            return {
                success: refund.status === 'succeeded',
                refundId: refund.id,
                paymentId,
                amount: refund.amount / 100,
                status: refund.status as any,
            };
        } catch (error: any) {
            this.logger.error(`[REFUND] Failed: ${error.message}`, error.stack);

            return {
                success: false,
                refundId: '',
                paymentId,
                amount: amount || 0,
                status: 'failed',
                errorCode: error.code,
                errorMessage: error.message,
            };
        }
    }

    /**
     * Verify Stripe webhook signature
     * Critical for security - prevents fake webhooks
     * 
     * @param payload - Raw body from request (Buffer or string)
     * @param signature - Stripe-Signature header
     * @returns Verified Stripe event
     * @throws BadRequestException if signature is invalid
     */
    verifyWebhookSignature(payload: Buffer | string, signature: string): Stripe.Event {
        try {
            const event = this.stripe.webhooks.constructEvent(
                payload,
                signature,
                this.webhookSecret,
            );

            this.logger.log(`[WEBHOOK] ✅ Signature verified: ${event.type} (${event.id})`);

            return event;
        } catch (error: any) {
            this.logger.error(`[WEBHOOK] ❌ Invalid signature: ${error.message}`);
            throw new BadRequestException('Invalid webhook signature');
        }
    }

    /**
     * Map Stripe status to our status
     */
    private mapStripeStatus(
        status: Stripe.PaymentIntent.Status,
    ): 'pending' | 'succeeded' | 'failed' | 'requires_action' {
        const statusMap: Record<string, any> = {
            requires_payment_method: 'pending',
            requires_confirmation: 'pending',
            requires_action: 'requires_action',
            processing: 'pending',
            requires_capture: 'pending',
            canceled: 'failed',
            succeeded: 'succeeded',
        };

        return statusMap[status] || 'failed';
    }

    /**
     * Map Stripe payout status
     */
    private mapPayoutStatus(
        status: string,
    ): 'pending' | 'in_transit' | 'paid' | 'failed' | 'canceled' {
        const statusMap: Record<string, any> = {
            pending: 'pending',
            in_transit: 'in_transit',
            paid: 'paid',
            failed: 'failed',
            canceled: 'canceled',
        };

        return statusMap[status] || 'pending';
    }

    /**
     * Handle Stripe errors with proper error types
     */
    private handleStripeError(error: any): Error {
        const errorMap: Record<string, string> = {
            card_declined: 'Your card was declined. Please try another card.',
            insufficient_funds: 'Insufficient funds. Please use another card.',
            expired_card: 'Your card has expired. Please use another card.',
            incorrect_cvc: 'Incorrect CVC code. Please check and try again.',
            processing_error: 'An error occurred while processing your card. Please try again.',
            rate_limit: 'Too many requests. Please try again later.',
        };

        const message = errorMap[error.code] || error.message;

        return new BadRequestException(message);
    }

    /**
     * Get user-friendly error message in Spanish
     */
    private getUserFriendlyErrorMessage(error: any): string {
        const errorMessages: Record<string, string> = {
            card_declined: 'Tu tarjeta fue rechazada. Por favor intenta con otra tarjeta.',
            insufficient_funds: 'Fondos insuficientes. Por favor usa otra tarjeta.',
            expired_card: 'Tu tarjeta ha expirado. Por favor usa otra tarjeta.',
            incorrect_cvc: 'Código CVC incorrecto. Por favor verifica e intenta de nuevo.',
            incorrect_number: 'Número de tarjeta incorrecto. Por favor verifica e intenta de nuevo.',
            invalid_expiry_month: 'Mes de expiración inválido.',
            invalid_expiry_year: 'Año de expiración inválido.',
            processing_error: 'Ocurrió un error al procesar tu tarjeta. Por favor intenta de nuevo.',
            rate_limit: 'Demasiados intentos. Por favor intenta más tarde.',
        };

        return errorMessages[error.code] || 'Ocurrió un error al procesar el pago. Por favor intenta de nuevo.';
    }
}
