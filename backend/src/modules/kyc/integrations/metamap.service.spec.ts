import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { MetamapService } from './metamap.service';
import { of, throwError } from 'rxjs';
import * as crypto from 'crypto';

describe('MetamapService', () => {
  let service: MetamapService;
  let httpService: HttpService;

  const mockHttpService = {
    post: jest.fn(),
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MetamapService,
        { provide: HttpService, useValue: mockHttpService },
      ],
    }).compile();

    service = module.get<MetamapService>(MetamapService);
    httpService = module.get<HttpService>(HttpService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createSession', () => {
    it('should create a MetaMap session', async () => {
      const params = {
        documentType: 'NATIONAL_ID',
        captureMethod: 'SELFIE',
      };

      const response = {
        data: {
          sessionId: 'session-123',
          clientToken: 'token-123',
          expiresAt: '2024-01-01T12:00:00Z',
        },
      };

      mockHttpService.post.mockReturnValue(of(response));

      const result = await service.createSession(params);

      expect(result).toHaveProperty('sessionId');
      expect(result).toHaveProperty('clientToken');
      expect(mockHttpService.post).toHaveBeenCalled();
    });

    it('should handle API errors', async () => {
      const params = {
        documentType: 'NATIONAL_ID',
        captureMethod: 'SELFIE',
      };

      mockHttpService.post.mockReturnValue(
        throwError(() => new Error('API Error')),
      );

      await expect(service.createSession(params)).rejects.toThrow();
    });
  });

  describe('getSessionResult', () => {
    it('should get session result', async () => {
      const sessionId = 'session-123';
      const response = {
        data: {
          result: 'APPROVED',
          identityVerified: true,
          documentOcr: { name: 'John Doe' },
        },
      };

      mockHttpService.get.mockReturnValue(of(response));

      const result = await service.getSessionResult(sessionId);

      expect(result).toHaveProperty('result');
      expect(result).toHaveProperty('identityVerified');
      expect(mockHttpService.get).toHaveBeenCalled();
    });
  });

  describe('isSessionComplete', () => {
    it('should return true if session is complete', async () => {
      const sessionId = 'session-123';
      const response = {
        data: {
          status: 'COMPLETED',
        },
      };

      mockHttpService.get.mockReturnValue(of(response));

      const result = await service.isSessionComplete(sessionId);

      expect(result).toBe(true);
    });

    it('should return false if session is not complete', async () => {
      const sessionId = 'session-123';
      const response = {
        data: {
          status: 'IN_PROGRESS',
        },
      };

      mockHttpService.get.mockReturnValue(of(response));

      const result = await service.isSessionComplete(sessionId);

      expect(result).toBe(false);
    });
  });

  describe('validateWebhook', () => {
    it('should validate webhook with correct signature', () => {
      const payload = { sessionId: 'session-123', result: 'APPROVED' };
      const secret = process.env.METAMAP_WEBHOOK_SECRET || 'test-secret';

      const signature = crypto
        .createHmac('sha256', secret)
        .update(JSON.stringify(payload))
        .digest('hex');

      const result = service.validateWebhook(signature, payload);

      expect(result).toBe(true);
    });

    it('should reject webhook with invalid signature', () => {
      const payload = { sessionId: 'session-123', result: 'APPROVED' };
      const invalidSignature = 'invalid-signature';

      const result = service.validateWebhook(invalidSignature, payload);

      expect(result).toBe(false);
    });
  });

  describe('cancelSession', () => {
    it('should cancel session', async () => {
      const sessionId = 'session-123';
      const response = {
        data: {
          success: true,
        },
      };

      mockHttpService.post.mockReturnValue(of(response));

      const result = await service.cancelSession(sessionId);

      expect(result.success).toBe(true);
    });
  });
});
