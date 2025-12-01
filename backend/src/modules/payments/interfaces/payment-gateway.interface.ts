/**
 * Payment Gateway Interface
 * Abstraction for payment providers (Stripe, Prometeo, PayPal, etc.)
 */
export interface IPaymentGateway {
  /**
   * Charge a customer (client payment)
   * @param amount - Amount in currency units (e.g., USD)
   * @param currency - Currency code (USD, MXN, etc.)
   * @param source - Payment source (card token, payment method ID)
   * @param metadata - Additional metadata
   */
  charge(
    amount: number,
    currency: string,
    source: string,
    metadata?: Record<string, any>,
  ): Promise<PaymentResult>;

  /**
   * Payout to a recipient (Resi payment)
   * @param amount - Amount in currency units
   * @param destination - Destination account (bank account, Stripe account ID)
   * @param metadata - Additional metadata
   */
  payout(
    amount: number,
    destination: string,
    metadata?: Record<string, any>,
  ): Promise<PayoutResult>;

  /**
   * Get payment status
   * @param paymentId - Payment ID from provider
   */
  getPaymentStatus(paymentId: string): Promise<PaymentStatus>;

  /**
   * Refund a payment
   * @param paymentId - Payment ID to refund
   * @param amount - Amount to refund (optional, defaults to full amount)
   */
  refund(paymentId: string, amount?: number): Promise<RefundResult>;
}

/**
 * Payment Result
 */
export interface PaymentResult {
  success: boolean;
  paymentId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'succeeded' | 'failed' | 'requires_action';
  providerResponse?: any;
  errorCode?: string;
  errorMessage?: string;
  metadata?: Record<string, any>;
}

/**
 * Payout Result
 */
export interface PayoutResult {
  success: boolean;
  payoutId: string;
  amount: number;
  destination: string;
  status: 'pending' | 'in_transit' | 'paid' | 'failed' | 'canceled';
  estimatedArrival?: Date;
  providerResponse?: any;
  errorCode?: string;
  errorMessage?: string;
  metadata?: Record<string, any>;
}

/**
 * Payment Status
 */
export interface PaymentStatus {
  id: string;
  status: 'pending' | 'succeeded' | 'failed' | 'requires_action' | 'canceled';
  amount: number;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
  metadata?: Record<string, any>;
}

/**
 * Refund Result
 */
export interface RefundResult {
  success: boolean;
  refundId: string;
  paymentId: string;
  amount: number;
  status: 'pending' | 'succeeded' | 'failed';
  errorCode?: string;
  errorMessage?: string;
}
