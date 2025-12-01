import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { PrometeoService } from './prometeo.service';
import { of, throwError } from 'rxjs';

describe('PrometeoService', () => {
  let service: PrometeoService;
  let httpService: HttpService;

  const mockHttpService = {
    post: jest.fn(),
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrometeoService,
        { provide: HttpService, useValue: mockHttpService },
      ],
    }).compile();

    service = module.get<PrometeoService>(PrometeoService);
    httpService = module.get<HttpService>(HttpService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validateBankAccount', () => {
    it('should validate bank account successfully', async () => {
      const params = {
        accountNumber: '1234567890',
        bankCode: 'BBVA',
        ownerName: 'John Doe',
      };

      const response = {
        data: {
          isValid: true,
          ownerMatch: true,
          bankName: 'BBVA Argentina',
        },
      };

      mockHttpService.post.mockReturnValue(of(response));

      const result = await service.validateBankAccount(params);

      expect(result.isValid).toBe(true);
      expect(result.ownerMatch).toBe(true);
      expect(mockHttpService.post).toHaveBeenCalled();
    });

    it('should return invalid for non-existent account', async () => {
      const params = {
        accountNumber: 'invalid',
        bankCode: 'INVALID',
        ownerName: 'Unknown',
      };

      const response = {
        data: {
          isValid: false,
          ownerMatch: false,
          error: 'Account not found',
        },
      };

      mockHttpService.post.mockReturnValue(of(response));

      const result = await service.validateBankAccount(params);

      expect(result.isValid).toBe(false);
    });

    it('should handle API errors', async () => {
      const params = {
        accountNumber: '1234567890',
        bankCode: 'BBVA',
        ownerName: 'John Doe',
      };

      mockHttpService.post.mockReturnValue(
        throwError(() => new Error('API Error')),
      );

      await expect(service.validateBankAccount(params)).rejects.toThrow();
    });
  });

  describe('getBankInfo', () => {
    it('should get bank information', async () => {
      const bankCode = 'BBVA';
      const response = {
        data: {
          name: 'BBVA Argentina',
          code: 'BBVA',
          country: 'AR',
        },
      };

      mockHttpService.get.mockReturnValue(of(response));

      const result = await service.getBankInfo(bankCode);

      expect(result.name).toBe('BBVA Argentina');
      expect(mockHttpService.get).toHaveBeenCalled();
    });
  });

  describe('getUserAccounts', () => {
    it('should get user linked accounts', async () => {
      const userId = 'user-123';
      const response = {
        data: {
          accounts: [
            {
              accountId: 'acc-1',
              bankCode: 'BBVA',
              accountType: 'CHECKING',
            },
          ],
        },
      };

      mockHttpService.get.mockReturnValue(of(response));

      const result = await service.getUserAccounts(userId);

      expect(result.accounts).toHaveLength(1);
      expect(mockHttpService.get).toHaveBeenCalled();
    });
  });

  describe('createAccountLinkToken', () => {
    it('should create account link token', async () => {
      const userId = 'user-123';
      const response = {
        data: {
          linkToken: 'link-123',
          expiresAt: '2024-01-01T12:00:00Z',
        },
      };

      mockHttpService.post.mockReturnValue(of(response));

      const result = await service.createAccountLinkToken(userId);

      expect(result.linkToken).toBe('link-123');
      expect(mockHttpService.post).toHaveBeenCalled();
    });
  });

  describe('exchangeLinkToken', () => {
    it('should exchange link token for access', async () => {
      const userId = 'user-123';
      const linkToken = 'link-123';
      const response = {
        data: {
          accessToken: 'access-123',
          itemId: 'item-123',
        },
      };

      mockHttpService.post.mockReturnValue(of(response));

      const result = await service.exchangeLinkToken(userId, linkToken);

      expect(result.accessToken).toBe('access-123');
      expect(mockHttpService.post).toHaveBeenCalled();
    });
  });

  describe('getBankCode', () => {
    it('should map bank name to code', () => {
      const result = service.getBankCode('BBVA Argentina');

      expect(result).toBe('BBVA');
    });

    it('should return null for unknown bank', () => {
      const result = service.getBankCode('Unknown Bank');

      expect(result).toBeNull();
    });

    it('should handle partial matches', () => {
      const result = service.getBankCode('BBVA');

      expect(result).toBe('BBVA');
    });
  });

  describe('getVerificationStatus', () => {
    it('should get verification status', async () => {
      const userId = 'user-123';
      const response = {
        data: {
          status: 'VERIFIED',
          verifiedAt: '2024-01-01T12:00:00Z',
        },
      };

      mockHttpService.get.mockReturnValue(of(response));

      const result = await service.getVerificationStatus(userId);

      expect(result.status).toBe('VERIFIED');
      expect(mockHttpService.get).toHaveBeenCalled();
    });
  });
});
