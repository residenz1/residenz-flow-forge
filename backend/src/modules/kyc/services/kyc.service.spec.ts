import { Test, TestingModule } from '@nestjs/testing';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { KycService } from './kyc.service';
import { KycVerificationRepository } from '../repositories/kyc-verification.repository';
import { MetamapService } from '../integrations/metamap.service';
import { PrometeoService } from '../integrations/prometeo.service';
import {
  CreateKycSessionDto,
  HandleMetamapWebhookDto,
  ValidateBankAccountDto,
  ApproveKycDto,
  RejectKycDto,
  RetryKycDto,
} from '../dtos';

describe('KycService', () => {
  let service: KycService;
  let repository: KycVerificationRepository;
  let metamapService: MetamapService;
  let prometeoService: PrometeoService;
  let eventEmitter: EventEmitter2;

  const mockRepository = {
    create: jest.fn(),
    findById: jest.fn(),
    findByUserId: jest.fn(),
    findBySessionId: jest.fn(),
    findAll: jest.fn(),
    findByStatus: jest.fn(),
    update: jest.fn(),
    getStats: jest.fn(),
  };

  const mockMetamapService = {
    createSession: jest.fn(),
    getSessionResult: jest.fn(),
    isSessionComplete: jest.fn(),
    validateWebhook: jest.fn(),
  };

  const mockPrometeoService = {
    validateBankAccount: jest.fn(),
  };

  const mockEventEmitter = {
    emit: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        KycService,
        { provide: KycVerificationRepository, useValue: mockRepository },
        { provide: MetamapService, useValue: mockMetamapService },
        { provide: PrometeoService, useValue: mockPrometeoService },
        { provide: EventEmitter2, useValue: mockEventEmitter },
      ],
    }).compile();

    service = module.get<KycService>(KycService);
    repository = module.get<KycVerificationRepository>(KycVerificationRepository);
    metamapService = module.get<MetamapService>(MetamapService);
    prometeoService = module.get<PrometeoService>(PrometeoService);
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createKycSession', () => {
    it('should create a new KYC session', async () => {
      const userId = 'user-123';
      const dto: CreateKycSessionDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
      };

      const metamapResponse = {
        sessionId: 'session-123',
        clientToken: 'token-123',
        expiresAt: new Date(Date.now() + 3600000),
      };

      const dbRecord = {
        id: 'kyc-123',
        userId,
        sessionId: 'session-123',
        status: 'PENDING',
      };

      mockMetamapService.createSession.mockResolvedValue(metamapResponse);
      mockRepository.create.mockResolvedValue(dbRecord);

      const result = await service.createKycSession(userId, dto);

      expect(result).toHaveProperty('kycVerificationId');
      expect(result).toHaveProperty('clientToken');
      expect(mockMetamapService.createSession).toHaveBeenCalled();
      expect(mockRepository.create).toHaveBeenCalled();
      expect(mockEventEmitter.emit).toHaveBeenCalledWith(
        'kyc.session_created',
        expect.any(Object),
      );
    });

    it('should throw error if MetaMap session fails', async () => {
      const userId = 'user-123';
      const dto: CreateKycSessionDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
      };

      mockMetamapService.createSession.mockRejectedValue(
        new Error('MetaMap API error'),
      );

      await expect(service.createKycSession(userId, dto)).rejects.toThrow();
    });
  });

  describe('handleMetamapWebhook', () => {
    it('should handle successful webhook', async () => {
      const signature = 'valid-signature';
      const payload: HandleMetamapWebhookDto = {
        sessionId: 'session-123',
        status: 'verified',
        livenessScore: 0.85,
        documentScore: 0.90,
        metadata: {},
      };

      const kycRecord = {
        id: 'kyc-123',
        userId: 'user-123',
        status: 'PENDING',
      };

      mockMetamapService.validateWebhook.mockResolvedValue(true);
      mockRepository.findBySessionId.mockResolvedValue(kycRecord);
      mockRepository.update.mockResolvedValue({ ...kycRecord, status: 'APPROVED' });

      await service.handleMetamapWebhook(signature, payload);

      expect(mockMetamapService.validateWebhook).toHaveBeenCalledWith(signature, payload);
      expect(mockRepository.findBySessionId).toHaveBeenCalledWith('session-123');
      expect(mockRepository.update).toHaveBeenCalled();
      expect(mockEventEmitter.emit).toHaveBeenCalledWith(
        'kyc.verification_completed',
        expect.any(Object),
      );
    });

    it('should reject invalid webhook signature', async () => {
      const signature = 'invalid-signature';
      const payload: HandleMetamapWebhookDto = {
        sessionId: 'session-123',
        status: 'verified',
        livenessScore: 0.85,
        documentScore: 0.90,
      };

      mockMetamapService.validateWebhook.mockResolvedValue(false);

      await expect(
        service.handleMetamapWebhook(signature, payload),
      ).rejects.toThrow('Invalid webhook signature');
    });
  });

  describe('validateBankAccount', () => {
    it('should validate bank account successfully', async () => {
      const userId = 'user-123';
      const dto: ValidateBankAccountDto = {
        bankName: 'BBVA Argentina',
        accountNumber: '1234567890',
        routingNumber: '123456',
        accountHolderName: 'John Doe',
      };

      const kycRecord = {
        id: 'kyc-123',
        userId,
        status: 'PENDING',
      };

      mockRepository.findByUserId.mockResolvedValue(kycRecord);
      mockPrometeoService.validateBankAccount.mockResolvedValue({
        isValid: true,
        ownerMatch: true,
      });
      mockRepository.update.mockResolvedValue({
        ...kycRecord,
        bankVerified: true,
      });

      const result = await service.validateBankAccount(userId, dto);

      expect(result).toHaveProperty('isValid');
      expect(mockPrometeoService.validateBankAccount).toHaveBeenCalledWith(
        expect.objectContaining({
          accountNumber: dto.accountNumber,
          bankName: dto.bankName,
        }),
      );
    });

    it('should handle invalid bank account', async () => {
      const userId = 'user-123';
      const dto: ValidateBankAccountDto = {
        bankName: 'Invalid Bank',
        accountNumber: '9999999999',
        routingNumber: '999999',
        accountHolderName: 'John Doe',
      };

      mockRepository.findByUserId.mockResolvedValue({
        id: 'kyc-123',
        userId,
      });
      mockPrometeoService.validateBankAccount.mockResolvedValue({
        isValid: false,
        ownerMatch: false,
      });

      const result = await service.validateBankAccount(userId, dto);

      expect(result).toHaveProperty('isValid');
    });
  });

  describe('getKycStatus', () => {
    it('should return KYC status', async () => {
      const userId = 'user-123';
      const kycRecord = {
        id: 'kyc-123',
        userId,
        status: 'APPROVED',
        identityVerified: true,
        bankVerified: true,
      };

      mockRepository.findByUserId.mockResolvedValue(kycRecord);

      const result = await service.getKycStatus(userId);

      expect(result).toHaveProperty('status');
      expect(result).toHaveProperty('identityVerified');
      expect(result).toHaveProperty('bankVerified');
      expect(mockRepository.findByUserId).toHaveBeenCalledWith(userId);
    });

    it('should return null when no KYC record exists', async () => {
      const userId = 'user-123';
      mockRepository.findByUserId.mockResolvedValue(null);

      const result = await service.getKycStatus(userId);

      expect(result).toBeNull();
    });
  });

  describe('retryKyc', () => {
    it('should retry KYC verification', async () => {
      const userId = 'user-123';
      const dto: RetryKycDto = {
        reason: 'Document quality improved',
      };

      const oldRecord = {
        id: 'kyc-123',
        userId,
        status: 'REJECTED',
        retryAttempts: 0,
      };

      const metamapResponse = {
        sessionId: 'session-456',
        clientToken: 'token-456',
      };

      mockRepository.findById.mockResolvedValue(oldRecord);
      mockMetamapService.createSession.mockResolvedValue(metamapResponse);
      mockRepository.update.mockResolvedValue({
        ...oldRecord,
        sessionId: 'session-456',
        status: 'PENDING',
        retryAttempts: 1,
      });

      const result = await service.retryKyc(userId, dto);

      expect(result).toHaveProperty('clientToken');
      expect(mockRepository.findById).toHaveBeenCalledWith('kyc-123');
      expect(mockMetamapService.createSession).toHaveBeenCalled();
      expect(mockEventEmitter.emit).toHaveBeenCalledWith(
        'kyc.retry_started',
        expect.any(Object),
      );
    });

    it('should prevent retry on non-rejected status', async () => {
      const userId = 'user-123';
      const dto: RetryKycDto = {
        reason: 'Retry',
      };

      mockRepository.findById.mockResolvedValue({
        id: 'kyc-123',
        status: 'APPROVED',
      });

      await expect(service.retryKyc(userId, dto)).rejects.toThrow();
    });
  });

  describe('approveKyc', () => {
    it('should approve KYC', async () => {
      const kycVerificationId = 'kyc-123';
      const dto: ApproveKycDto = {
        reason: 'Document verified',
      };

      const record = {
        id: kycVerificationId,
        userId: 'user-123',
        status: 'PENDING',
      };

      mockRepository.findById.mockResolvedValue(record);
      mockRepository.update.mockResolvedValue({
        ...record,
        status: 'APPROVED',
      });

      await service.approveKyc(kycVerificationId, dto);

      expect(mockRepository.update).toHaveBeenCalled();
      expect(mockEventEmitter.emit).toHaveBeenCalledWith(
        'kyc.approved',
        expect.any(Object),
      );
    });
  });

  describe('rejectKyc', () => {
    it('should reject KYC', async () => {
      const kycVerificationId = 'kyc-123';
      const dto: RejectKycDto = {
        reason: 'Invalid document',
      };

      const record = {
        id: kycVerificationId,
        userId: 'user-123',
        status: 'PENDING',
      };

      mockRepository.findById.mockResolvedValue(record);
      mockRepository.update.mockResolvedValue({
        ...record,
        status: 'REJECTED',
      });

      await service.rejectKyc(kycVerificationId, dto);

      expect(mockRepository.update).toHaveBeenCalled();
      expect(mockEventEmitter.emit).toHaveBeenCalledWith(
        'kyc.rejected',
        expect.any(Object),
      );
    });
  });

  describe('getKycStats', () => {
    it('should return KYC statistics', async () => {
      const stats = {
        total: 100,
        approved: 85,
        rejected: 10,
        pending: 5,
        approvalRate: 0.85,
      };

      mockRepository.getStats.mockResolvedValue(stats);

      const result = await service.getKycStats();

      expect(result).toEqual(stats);
      expect(mockRepository.getStats).toHaveBeenCalled();
    });
  });

  describe('getPendingVerifications', () => {
    it('should return pending verifications for workers', async () => {
      const verifications = [
        { id: 'kyc-1', userId: 'user-1', status: 'PENDING' },
        { id: 'kyc-2', userId: 'user-2', status: 'PENDING' },
      ];

      mockRepository.findByStatus.mockResolvedValue(verifications);

      const result = await service.getPendingVerifications();

      expect(result).toHaveLength(2);
      expect(mockRepository.findByStatus).toHaveBeenCalledWith('PENDING');
    });
  });
});
