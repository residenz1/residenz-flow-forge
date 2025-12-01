# Gateway Agent (El Cajero) - Implementation

## ✅ Completed

### 1. **Payment Gateway Interface** (`interfaces/payment-gateway.interface.ts`)
- ✅ `IPaymentGateway` interface for abstraction
- ✅ `PaymentResult`, `PayoutResult`, `PaymentStatus`, `RefundResult` types
- ✅ Supports multiple providers (Stripe, Prometeo, PayPal, etc.)

### 2. **Stripe Service** (`services/stripe.service.ts`)
- ✅ Wrapper around Stripe SDK
- ✅ Implements `IPaymentGateway` interface
- ✅ Methods: `charge()`, `payout()`, `getPaymentStatus()`, `refund()`
- ✅ Additional: `createCustomer()`, `attachPaymentMethod()`
- ✅ Automatic amount conversion to cents
- ✅ Comprehensive error handling

### 3. **Gateway Service** (`services/gateway.service.ts`)
- ✅ Orchestrator for dual payment strategy
- ✅ **Stripe** for client charges
- ✅ **Prometeo** for Resi payouts (via KYC module)
- ✅ KYC validation before payouts
- ✅ Event emission: `payment.authorized`, `payout.initiated`, `payout.completed`
- ✅ High-level methods: `chargeClientForBooking()`, `payoutToResiForBooking()`
- ✅ Validation: `validateResiForPayout()`

### 4. **Payments Module** (`payments.module.ts`)
- ✅ Complete module configuration
- ✅ Imports: `ConfigModule`, `HttpModule`, `CacheModule`, `TypeOrmModule`, `KycModule`
- ✅ Providers: `StripeService`, `GatewayService`
- ✅ Exports for use in other modules

---

## 📋 Usage Examples

### Example 1: Charge Client for Booking

\`\`\`typescript
import { GatewayService } from '@modules/payments/services/gateway.service';

@Injectable()
export class BookingService {
  constructor(private gatewayService: GatewayService) {}

  async chargeClientForBooking(booking: Booking, paymentMethodId: string) {
    const result = await this.gatewayService.chargeClientForBooking({
      bookingId: booking.id,
      clientId: booking.clientId,
      amount: booking.clientPrice,
      currency: 'USD',
      paymentMethodId,
    });

    if (!result.success) {
      throw new BadRequestException(\`Payment failed: \${result.errorMessage}\`);
    }

    // Update booking with payment info
    booking.metadata = {
      ...booking.metadata,
      paymentId: result.paymentId,
      paymentStatus: result.status,
    };

    return result;
  }
}
\`\`\`

### Example 2: Payout to Resi After Booking Completion

\`\`\`typescript
import { GatewayService } from '@modules/payments/services/gateway.service';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class PayoutService {
  constructor(private gatewayService: GatewayService) {}

  @OnEvent('booking.completed')
  async handleBookingCompleted(payload: { bookingId: string; resiId: string; agreedPayout: number }) {
    // 1. Validate Resi can receive payout
    const validation = await this.gatewayService.validateResiForPayout(payload.resiId);
    
    if (!validation.canReceivePayout) {
      this.logger.error(\`Cannot payout to Resi: \${validation.reason}\`);
      return;
    }

    // 2. Initiate payout
    const result = await this.gatewayService.payoutToResiForBooking({
      bookingId: payload.bookingId,
      resiId: payload.resiId,
      amount: payload.agreedPayout,
    });

    if (result.success) {
      this.logger.log(\`Payout initiated: \${result.payoutId}\`);
    } else {
      this.logger.error(\`Payout failed: \${result.errorMessage}\`);
    }
  }
}
\`\`\`

### Example 3: Refund a Payment

\`\`\`typescript
import { GatewayService } from '@modules/payments/services/gateway.service';

@Injectable()
export class RefundService {
  constructor(private gatewayService: GatewayService) {}

  async refundBooking(booking: Booking, reason: string) {
    const paymentId = booking.metadata?.paymentId;
    
    if (!paymentId) {
      throw new BadRequestException('No payment found for this booking');
    }

    const result = await this.gatewayService.refund(paymentId);

    if (result.success) {
      // Update booking status
      booking.status = BookingStatus.CANCELLED;
      booking.metadata = {
        ...booking.metadata,
        refundId: result.refundId,
        refundReason: reason,
      };
    }

    return result;
  }
}
\`\`\`

---

## 🔧 Configuration

### Environment Variables

\`\`\`env
# Stripe
STRIPE_API_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# Prometeo (from KYC module)
PROMETEO_API_KEY=Wa4Cim5rJkFX8QoZdeM9S6bxaIs6rIRwN36RG7mcu4imUCvnRlsjEHNSToZ57oTG
PROMETEO_API_URL=https://api.prometeo.com

# MetaMap (from KYC module)
METAMAP_CLIENT_ID=692d35cb93703d4d2057a850
METAMAP_API_KEY=sk_live_xxxxx
METAMAP_WEBHOOK_SECRET=whsec_xxxxx
\`\`\`

---

## 🎯 Integration Flow

\`\`\`
1. Client creates booking
   ↓
2. Gateway.chargeClient() → Stripe Payment Intent
   ↓ Event: payment.authorized
3. Ledger Agent records transaction (DEBIT client, CREDIT escrow)
   ↓
4. Resi completes service
   ↓ Event: booking.completed
5. Gateway.payoutToResi() → Prometeo transfer
   ↓ Validates: KYC status === 'APPROVED'
   ↓ Event: payout.initiated
6. Ledger Agent records transaction (DEBIT escrow, CREDIT resi)
   ↓ Event: payout.completed
7. Resi receives money in bank account (2-3 days)
\`\`\`

---

## 📊 Events Emitted

| Event | Payload | Description |
|-------|---------|-------------|
| \`payment.authorized\` | \`{ paymentId, amount, currency, bookingId, clientId }\` | Client payment successful |
| \`payout.initiated\` | \`{ payoutId, amount, resiId, bookingId, bankAccount }\` | Payout started |
| \`payout.completed\` | \`{ payoutId, amount, resiId, status }\` | Payout completed |
| \`payment.refunded\` | \`{ refundId, paymentId, amount }\` | Payment refunded |

---

## 🚧 TODO (Next Steps)

### 1. Extend PrometeoService
- [ ] Add \`initiatePayment()\` method to \`backend/src/modules/kyc/integrations/prometeo.service.ts\`
- [ ] Add \`getPaymentStatus()\` method
- [ ] Test Prometeo payout flow

### 2. Webhook Controller
- [ ] Create \`controllers/webhook.controller.ts\`
- [ ] Endpoint: \`POST /payments/webhook/stripe\`
- [ ] Endpoint: \`POST /payments/webhook/prometeo\`
- [ ] Signature verification

### 3. Idempotency Guard
- [ ] Create \`guards/idempotency.guard.ts\`
- [ ] Redis-based key storage
- [ ] Apply to charge/payout endpoints

### 4. Tests
- [ ] Unit tests for \`StripeService\`
- [ ] Unit tests for \`GatewayService\`
- [ ] Integration tests for payment flow
- [ ] E2E tests for booking → charge → payout

---

## 📝 Notes

- **Stripe** is used for client charges because it's PCI DSS compliant and handles card tokenization securely
- **Prometeo** is used for Resi payouts because it has lower fees for bank transfers
- **KYC validation** is mandatory before payouts to ensure bank accounts are verified
- **Events** are emitted for Ledger Agent to record double-entry transactions
- **Idempotency** will be added via guard to prevent duplicate charges/payouts
