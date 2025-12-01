import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';
import { User } from '@database/entities';
import { IdempotencyKey } from '@database/entities/idempotency-key.entity';
import { KycModule } from '@modules/kyc/kyc.module';
import { MercadoPagoService } from './services/mercadopago.service';
import { StripeService } from './services/stripe.service';
import { GatewayService } from './services/gateway.service';
import { WebhookController } from './controllers/webhook.controller';
import { PaymentsController } from './controllers/payments.controller';
import { PaymentListener } from './listeners/payment.listener';
import { IdempotencyGuard } from './guards/idempotency.guard';
import { IdempotencyRepository } from './repositories/idempotency.repository';

/**
 * Payments Module
 * Gateway Agent (El Cajero) - Multi-gateway payment strategy:
 * - MercadoPago: Client charges via Yape/Plin QR (PRIMARY for Peru)
 * - Stripe: Client charges via cards (SECONDARY fallback)
 * - Prometeo: Resi payouts (bank transfers via KYC module)
 * 
 * Architecture:
 * Money IN (Cobros):
 *   1. MercadoPago generaGenera un QR interoperable
 *   2. Usuario escanea con Yape o Plin desde su celular
 *   3. MercadoPago envía webhook (patrón Fetch-Back)
 *   4. Consultamos a MP el estado real del pago
 *   5. Procesamos evento y acreditamos al usuario
 * 
 * Money OUT (Payouts):
 *   1. Prometeo realiza transferencias a cuentas vinculadas en Yape/Plin
 *   2. Validamos KYC antes de permitir payout
 *   3. Transferencia vía CCI (cuenta corriente interbancaria)
 * 
 * Features:
 * - ✅ Yape/Plin QR support (interoperable)
 * - ✅ PCI DSS compliant card processing (Stripe)
 * - ✅ Bank account payouts (Prometeo)
 * - ✅ KYC validation before payouts
 * - ✅ Event-driven architecture
 * - ✅ Idempotency support (prevents duplicate webhooks)
 * - ✅ Secure webhook handling with signature verification
 * - ✅ Patrón Fetch-Back para MercadoPago (no confiamos en webhook)
 * 
 * Security:
 * - HMAC-SHA256 signature verification (Stripe)
 * - X-Signature header verification (MercadoPago)
 * - API Key verification (Prometeo)
 * - Idempotency Guard (prevents duplicate processing)
 * - Rate limiting recommended on all endpoints
 */
@Module({
    imports: [
        ConfigModule,
        HttpModule,
        CacheModule.register(),
        TypeOrmModule.forFeature([User, IdempotencyKey]),
        KycModule, // Import KYC module to reuse PrometeoService
    ],
    controllers: [
        WebhookController,
        PaymentsController,
    ],
    providers: [
        MercadoPagoService,
        StripeService,
        GatewayService,
        PaymentListener,
        IdempotencyGuard,
        IdempotencyRepository,
    ],
    exports: [
        MercadoPagoService,
        StripeService,
        GatewayService,
        IdempotencyRepository,
    ],
})
export class PaymentsModule { }
