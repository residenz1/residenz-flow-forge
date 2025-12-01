import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { KycService } from './services/kyc.service';

/**
 * Scheduler for KYC tasks
 * - expire old verifications periodically
 */
@Injectable()
export class KycScheduler {
  private readonly logger = new Logger(KycScheduler.name);

  constructor(private readonly kycService: KycService) {}

  // Run every hour to expire old KYC verifications
  @Cron(CronExpression.EVERY_HOUR)
  async handleExpireOldVerifications() {
    try {
      const count = await this.kycService.expireOldVerifications();
      this.logger.log(`Expired ${count} KYC verifications`);
    } catch (err) {
      this.logger.error('Error expiring old KYC verifications', err as any);
    }
  }
}
