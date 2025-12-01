import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@database/entities';
import { MatchingService } from '../services/matching.service';

describe('MatchingService', () => {
  let service: MatchingService;
  let userRepository: Repository<User>;
  let mockUserRepository: any;

  const mockResis = [
    {
      id: 'resi-1',
      firstName: 'Alice',
      role: 'RESI',
      rating: 4.8,
      totalReviews: 50,
      isActive: true,
      kycStatus: 'APPROVED',
    },
    {
      id: 'resi-2',
      firstName: 'Bob',
      role: 'RESI',
      rating: 4.2,
      totalReviews: 30,
      isActive: true,
      kycStatus: 'APPROVED',
    },
    {
      id: 'resi-3',
      firstName: 'Carol',
      role: 'RESI',
      rating: 3.5,
      totalReviews: 10,
      isActive: true,
      kycStatus: 'APPROVED',
    },
  ];

  beforeEach(async () => {
    mockUserRepository = {
      createQueryBuilder: jest.fn().mockReturnValue({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        addOrderBy: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockResis[0]),
        getMany: jest.fn().mockResolvedValue(mockResis),
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MatchingService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<MatchingService>(MatchingService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  describe('findBestResi', () => {
    it('debe encontrar el mejor resi disponible', async () => {
      const result = await service.findBestResi('address-123', new Date());

      expect(result).toBeDefined();
      expect(result.id).toEqual('resi-1');
      expect(result.rating).toEqual(4.8);
    });

    it('debe retornar null si no hay resis disponibles', async () => {
      mockUserRepository.createQueryBuilder = jest.fn().mockReturnValue({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        addOrderBy: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      });

      const result = await service.findBestResi('address-123', new Date());

      expect(result).toBeNull();
    });

    it('debe excluir resis específicos', async () => {
      await service.findBestResi('address-123', new Date(), {
        excludeResiIds: ['resi-1', 'resi-2'],
      });

      expect(mockUserRepository.createQueryBuilder).toHaveBeenCalled();
    });
  });

  describe('findResiCandidates', () => {
    it('debe encontrar múltiples candidatos de resis', async () => {
      const result = await service.findResiCandidates(
        'address-123',
        new Date(),
        5,
      );

      expect(result).toHaveLength(3);
      expect(result[0].id).toEqual('resi-1');
    });

    it('debe respetar el límite de candidatos', async () => {
      await service.findResiCandidates('address-123', new Date(), 2);

      const builder = mockUserRepository.createQueryBuilder();
      expect(builder.limit).toHaveBeenCalledWith(2);
    });
  });

  describe('calculateCompatibilityScore', () => {
    it('debe calcular score de compatibilidad correctamente', () => {
      const resi = mockResis[0] as any;

      const score = service.calculateCompatibilityScore(resi);

      expect(score).toBeGreaterThan(0);
      expect(score).toBeLessThanOrEqual(100);
    });

    it('debe dar más puntos a resis con más reseñas', () => {
      const highReviewsResi = { ...mockResis[0], totalReviews: 100 } as any;
      const lowReviewsResi = { ...mockResis[2], totalReviews: 5 } as any;

      const scoreHigh = service.calculateCompatibilityScore(highReviewsResi);
      const scoreLow = service.calculateCompatibilityScore(lowReviewsResi);

      expect(scoreHigh).toBeGreaterThan(scoreLow);
    });

    it('debe dar bonus por verificación KYC', () => {
      const verifiedResi = { ...mockResis[0], kycStatus: 'APPROVED' } as any;
      const unverifiedResi = { ...mockResis[0], kycStatus: 'PENDING' } as any;

      const scoreVerified = service.calculateCompatibilityScore(verifiedResi);
      const scoreUnverified = service.calculateCompatibilityScore(unverifiedResi);

      expect(scoreVerified).toBeGreaterThan(scoreUnverified);
    });
  });

  describe('rankResis', () => {
    it('debe rankear resis correctamente', async () => {
      const ranked = await service.rankResis(mockResis as any);

      expect(ranked[0].id).toEqual('resi-1'); // Mejor rating
      expect(ranked[ranked.length - 1].id).toEqual('resi-3'); // Peor rating
    });

    it('debe priorizar experiencia si se indica', async () => {
      const ranked = await service.rankResis(mockResis as any, {
        prioritizeExperience: true,
      });

      expect(ranked[0].totalReviews).toBeGreaterThanOrEqual(
        ranked[1].totalReviews,
      );
    });
  });

  describe('validateResiAvailability', () => {
    it('debe validar disponibilidad del resi', async () => {
      const isAvailable = await service.validateResiAvailability(
        'resi-1',
        new Date(),
        120,
      );

      expect(isAvailable).toBe(true);
    });
  });
});
