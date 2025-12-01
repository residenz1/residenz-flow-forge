import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { KycVerification } from '../entities/kyc-verification.entity';
import { KycVerificationRepository } from './kyc-verification.repository';
import { Repository } from 'typeorm';

describe('KycVerificationRepository', () => {
  let repository: KycVerificationRepository;
  let typeOrmRepository: Repository<KycVerification>;

  const mockRepository = {
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    count: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        KycVerificationRepository,
        {
          provide: getRepositoryToken(KycVerification),
          useValue: mockRepository,
        },
      ],
    }).compile();

    repository = module.get<KycVerificationRepository>(KycVerificationRepository);
    typeOrmRepository = module.get<Repository<KycVerification>>(
      getRepositoryToken(KycVerification),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new KYC verification', async () => {
      const data = {
        userId: 'user-123',
        sessionId: 'session-123',
        status: 'PENDING' as const,
      };

      const entity = {
        id: 'kyc-123',
        ...data,
        identityVerified: false,
        bankVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.save.mockResolvedValue(entity);

      const result = await repository.create(data);

      expect(result.id).toBe('kyc-123');
      expect(result.status).toBe('PENDING');
      expect(mockRepository.save).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should find KYC verification by ID', async () => {
      const id = 'kyc-123';
      const entity = {
        id,
        userId: 'user-123',
        status: 'PENDING',
      };

      mockRepository.findOne.mockResolvedValue(entity);

      const result = await repository.findById(id);

      expect(result).toEqual(entity);
      expect(mockRepository.findOne).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id } }),
      );
    });

    it('should return null if not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await repository.findById('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('findByUserId', () => {
    it('should find latest KYC verification for user', async () => {
      const userId = 'user-123';
      const entity = {
        id: 'kyc-123',
        userId,
        status: 'PENDING',
      };

      mockRepository.findOne.mockResolvedValue(entity);

      const result = await repository.findByUserId(userId);

      expect(result).toEqual(entity);
      expect(mockRepository.findOne).toHaveBeenCalled();
    });
  });

  describe('findBySessionId', () => {
    it('should find KYC verification by session ID', async () => {
      const sessionId = 'session-123';
      const entity = {
        id: 'kyc-123',
        sessionId,
        status: 'PENDING',
      };

      mockRepository.findOne.mockResolvedValue(entity);

      const result = await repository.findBySessionId(sessionId);

      expect(result).toEqual(entity);
      expect(mockRepository.findOne).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should find all verifications with pagination', async () => {
      const entities = [
        { id: 'kyc-1', userId: 'user-1', status: 'PENDING' },
        { id: 'kyc-2', userId: 'user-2', status: 'APPROVED' },
      ];

      mockRepository.find.mockResolvedValue(entities);
      mockRepository.count.mockResolvedValue(2);

      const result = await repository.findAll({
        page: 1,
        limit: 20,
      });

      expect(result.data).toHaveLength(2);
      expect(result.total).toBe(2);
    });
  });

  describe('findByStatus', () => {
    it('should find verifications by status', async () => {
      const status = 'PENDING';
      const entities = [
        { id: 'kyc-1', status: 'PENDING' },
        { id: 'kyc-2', status: 'PENDING' },
      ];

      mockRepository.find.mockResolvedValue(entities);

      const result = await repository.findByStatus(status);

      expect(result).toHaveLength(2);
      expect(result.every((v) => v.status === status)).toBe(true);
    });
  });

  describe('findExpiredVerifications', () => {
    it('should find expired verifications', async () => {
      const entities = [
        {
          id: 'kyc-1',
          expiresAt: new Date(Date.now() - 86400000),
        },
      ];

      mockRepository.find.mockResolvedValue(entities);

      const result = await repository.findExpiredVerifications();

      expect(result).toHaveLength(1);
    });
  });

  describe('findPendingVerifications', () => {
    it('should find pending verifications', async () => {
      const entities = [
        { id: 'kyc-1', status: 'PENDING' },
        { id: 'kyc-2', status: 'PENDING' },
      ];

      mockRepository.find.mockResolvedValue(entities);

      const result = await repository.findPendingVerifications();

      expect(result).toHaveLength(2);
    });
  });

  describe('update', () => {
    it('should update KYC verification', async () => {
      const id = 'kyc-123';
      const updates = { status: 'APPROVED' as const };
      const updated = {
        id,
        userId: 'user-123',
        ...updates,
      };

      mockRepository.save.mockResolvedValue(updated);

      const result = await repository.update(id, updates);

      expect(result.status).toBe('APPROVED');
    });
  });

  describe('getStats', () => {
    it('should return KYC statistics', async () => {
      const stats = {
        total: 100,
        approved: 80,
        rejected: 10,
        pending: 10,
        approvalRate: 0.8,
      };

      mockRepository.count.mockResolvedValue(100);

      const result = await repository.getStats();

      expect(result).toHaveProperty('total');
      expect(result).toHaveProperty('approvalRate');
    });
  });

  describe('getUserHistory', () => {
    it('should get user verification history', async () => {
      const userId = 'user-123';
      const entities = [
        { id: 'kyc-1', status: 'REJECTED', createdAt: new Date('2024-01-01') },
        { id: 'kyc-2', status: 'PENDING', createdAt: new Date('2024-01-02') },
      ];

      mockRepository.find.mockResolvedValue(entities);

      const result = await repository.getUserHistory(userId);

      expect(result).toHaveLength(2);
      expect(mockRepository.find).toHaveBeenCalled();
    });
  });
});
