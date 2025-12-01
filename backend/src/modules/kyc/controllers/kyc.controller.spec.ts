import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';
import { KycController } from './kyc.controller';
import { KycService } from '../services/kyc.service';
import {
  CreateKycSessionDto,
  HandleMetamapWebhookDto,
  ValidateBankAccountDto,
  ApproveKycDto,
  RejectKycDto,
  RetryKycDto,
} from '../dtos';

describe('KycController', () => {
  let controller: KycController;
  let service: KycService;

  const mockKycService = {
    createKycSession: jest.fn(),
    getKycStatus: jest.fn(),
    handleMetamapWebhook: jest.fn(),
    validateBankAccount: jest.fn(),
    retryKyc: jest.fn(),
    approveKyc: jest.fn(),
    rejectKyc: jest.fn(),
    getKycStats: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KycController],
      providers: [{ provide: KycService, useValue: mockKycService }],
    }).compile();

    controller = module.get<KycController>(KycController);
    service = module.get<KycService>(KycService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createKycSession', () => {
    it('should create a KYC session', async () => {
      const userId = 'user-123';
      const dto: CreateKycSessionDto = {
        documentType: 'NATIONAL_ID',
        captureMethod: 'SELFIE',
      };

      const response = {
        kycVerificationId: 'kyc-123',
        clientToken: 'token-123',
        sessionId: 'session-123',
        expiresAt: new Date(),
      };

      mockKycService.createKycSession.mockResolvedValue(response);

      const result = await controller.createKycSession(userId, dto);

      expect(result).toEqual(response);
      expect(mockKycService.createKycSession).toHaveBeenCalledWith(userId, dto);
    });

    it('should handle validation errors', async () => {
      const userId = 'user-123';
      const invalidDto = { documentType: 'INVALID' } as any;

      mockKycService.createKycSession.mockRejectedValue(
        new Error('Validation error'),
      );

      await expect(
        controller.createKycSession(userId, invalidDto),
      ).rejects.toThrow();
    });
  });

  describe('getKycStatus', () => {
    it('should get KYC status for current user', async () => {
      const userId = 'user-123';
      const response = {
        status: 'PENDING',
        identityVerified: false,
        bankVerified: false,
      };

      mockKycService.getKycStatus.mockResolvedValue(response);

      const result = await controller.getKycStatus(userId);

      expect(result).toEqual(response);
      expect(mockKycService.getKycStatus).toHaveBeenCalledWith(userId);
    });

    it('admin should get KYC status for other users', async () => {
      const currentUserId = 'admin-123';
      const targetUserId = 'user-123';
      const response = {
        status: 'APPROVED',
      };

      mockKycService.getKycStatus.mockResolvedValue(response);

      const result = await controller.getKycStatus(currentUserId, targetUserId);

      expect(result).toEqual(response);
      expect(mockKycService.getKycStatus).toHaveBeenCalledWith(targetUserId);
    });
  });

  describe('handleMetamapWebhook', () => {
    it('should handle webhook', async () => {
      const signature = 'valid-signature';
      const payload: HandleMetamapWebhookDto = {
        sessionId: 'session-123',
        result: 'APPROVED',
        metadata: {},
      };

      mockKycService.handleMetamapWebhook.mockResolvedValue(undefined);

      const result = await controller.handleMetamapWebhook(signature, payload);

      expect(result).toEqual({ success: true });
      expect(mockKycService.handleMetamapWebhook).toHaveBeenCalledWith(
        signature,
        payload,
      );
    });

    it('should reject invalid webhook', async () => {
      const signature = 'invalid-signature';
      const payload: HandleMetamapWebhookDto = {
        sessionId: 'session-123',
        result: 'APPROVED',
        metadata: {},
      };

      mockKycService.handleMetamapWebhook.mockRejectedValue(
        new Error('Invalid webhook signature'),
      );

      await expect(
        controller.handleMetamapWebhook(signature, payload),
      ).rejects.toThrow('Invalid webhook signature');
    });
  });

  describe('validateBankAccount', () => {
    it('should validate bank account', async () => {
      const userId = 'user-123';
      const dto: ValidateBankAccountDto = {
        accountNumber: '1234567890',
        bankCode: 'BBVA',
        ownerName: 'John Doe',
      };

      const response = {
        verified: true,
        accountId: 'acc-123',
      };

      mockKycService.validateBankAccount.mockResolvedValue(response);

      const result = await controller.validateBankAccount(userId, dto);

      expect(result).toEqual(response);
      expect(mockKycService.validateBankAccount).toHaveBeenCalledWith(userId, dto);
    });
  });

  describe('retryKyc', () => {
    it('should retry KYC verification', async () => {
      const userId = 'user-123';
      const dto: RetryKycDto = {
        kycVerificationId: 'kyc-123',
        reason: 'Retry',
      };

      const response = {
        clientToken: 'token-456',
        sessionId: 'session-456',
      };

      mockKycService.retryKyc.mockResolvedValue(response);

      const result = await controller.retryKyc(userId, dto);

      expect(result).toEqual(response);
      expect(mockKycService.retryKyc).toHaveBeenCalledWith(userId, dto);
    });
  });

  describe('approveKyc', () => {
    it('should approve KYC', async () => {
      const kycVerificationId = 'kyc-123';
      const dto: ApproveKycDto = {
        notes: 'Approved',
      };

      mockKycService.approveKyc.mockResolvedValue(undefined);

      const result = await controller.approveKyc(kycVerificationId, dto);

      expect(result).toEqual({ success: true, message: 'KYC approved' });
      expect(mockKycService.approveKyc).toHaveBeenCalledWith(kycVerificationId, dto);
    });
  });

  describe('rejectKyc', () => {
    it('should reject KYC', async () => {
      const kycVerificationId = 'kyc-123';
      const dto: RejectKycDto = {
        reason: 'Invalid document',
      };

      mockKycService.rejectKyc.mockResolvedValue(undefined);

      const result = await controller.rejectKyc(kycVerificationId, dto);

      expect(result).toEqual({ success: true, message: 'KYC rejected' });
      expect(mockKycService.rejectKyc).toHaveBeenCalledWith(kycVerificationId, dto);
    });
  });

  describe('getKycStats', () => {
    it('should return KYC statistics', async () => {
      const response = {
        total: 100,
        approved: 85,
        rejected: 10,
        pending: 5,
        approvalRate: 0.85,
      };

      mockKycService.getKycStats.mockResolvedValue(response);

      const result = await controller.getKycStats();

      expect(result).toEqual(response);
      expect(mockKycService.getKycStats).toHaveBeenCalled();
    });
  });
});
