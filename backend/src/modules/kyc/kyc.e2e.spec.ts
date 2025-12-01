import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { KycModule } from '../kyc.module';
import { JwtService } from '@nestjs/jwt';

describe('KYC Module E2E', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let authToken: string;
  let adminToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [KycModule],
    })
      .overrideProvider(JwtService)
      .useValue({
        sign: () => 'mock-token',
        verify: () => ({ sub: 'user-123', role: 'RESI' }),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    jwtService = moduleFixture.get<JwtService>(JwtService);
    authToken = 'Bearer mock-token';
    adminToken = 'Bearer mock-admin-token';

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /kyc/sessions', () => {
    it('should create a KYC session', () => {
      const dto = {
        documentType: 'NATIONAL_ID',
        captureMethod: 'SELFIE',
      };

      return request(app.getHttpServer())
        .post('/kyc/sessions')
        .set('Authorization', authToken)
        .send(dto)
        .expect(HttpStatus.CREATED)
        .expect((res) => {
          expect(res.body).toHaveProperty('kycVerificationId');
          expect(res.body).toHaveProperty('clientToken');
        });
    });

    it('should reject request without authentication', () => {
      const dto = {
        documentType: 'NATIONAL_ID',
        captureMethod: 'SELFIE',
      };

      return request(app.getHttpServer())
        .post('/kyc/sessions')
        .send(dto)
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should reject invalid document type', () => {
      const dto = {
        documentType: 'INVALID_TYPE',
        captureMethod: 'SELFIE',
      };

      return request(app.getHttpServer())
        .post('/kyc/sessions')
        .set('Authorization', authToken)
        .send(dto)
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe('GET /kyc/status', () => {
    it('should get KYC status', () => {
      return request(app.getHttpServer())
        .get('/kyc/status')
        .set('Authorization', authToken)
        .expect(HttpStatus.OK)
        .expect((res) => {
          expect(res.body).toHaveProperty('status');
        });
    });

    it('admin should get status for other users', () => {
      return request(app.getHttpServer())
        .get('/kyc/status?userId=other-user-123')
        .set('Authorization', adminToken)
        .expect(HttpStatus.OK);
    });
  });

  describe('POST /kyc/webhook', () => {
    it('should accept webhook without authentication', () => {
      const payload = {
        sessionId: 'session-123',
        result: 'APPROVED',
        metadata: {},
      };

      return request(app.getHttpServer())
        .post('/kyc/webhook')
        .set('x-metamap-signature', 'valid-signature')
        .send(payload)
        .expect(HttpStatus.OK)
        .expect({ success: true });
    });

    it('should reject invalid webhook signature', () => {
      const payload = {
        sessionId: 'session-123',
        result: 'APPROVED',
        metadata: {},
      };

      return request(app.getHttpServer())
        .post('/kyc/webhook')
        .set('x-metamap-signature', 'invalid-signature')
        .send(payload)
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('POST /kyc/bank-account', () => {
    it('should validate bank account', () => {
      const dto = {
        accountNumber: '1234567890',
        bankCode: 'BBVA',
        ownerName: 'John Doe',
      };

      return request(app.getHttpServer())
        .post('/kyc/bank-account')
        .set('Authorization', authToken)
        .send(dto)
        .expect(HttpStatus.CREATED)
        .expect((res) => {
          expect(res.body).toHaveProperty('verified');
        });
    });

    it('should reject invalid bank account data', () => {
      const dto = {
        accountNumber: '',
        bankCode: '',
        ownerName: '',
      };

      return request(app.getHttpServer())
        .post('/kyc/bank-account')
        .set('Authorization', authToken)
        .send(dto)
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe('PATCH /kyc/retry', () => {
    it('should retry KYC verification', () => {
      const dto = {
        kycVerificationId: 'kyc-123',
        reason: 'Retry',
      };

      return request(app.getHttpServer())
        .patch('/kyc/retry')
        .set('Authorization', authToken)
        .send(dto)
        .expect(HttpStatus.OK)
        .expect((res) => {
          expect(res.body).toHaveProperty('clientToken');
        });
    });
  });

  describe('PATCH /kyc/:id/approve', () => {
    it('should approve KYC (admin only)', () => {
      const dto = {
        notes: 'Approved',
      };

      return request(app.getHttpServer())
        .patch('/kyc/kyc-123/approve')
        .set('Authorization', adminToken)
        .send(dto)
        .expect(HttpStatus.OK)
        .expect({ success: true, message: 'KYC approved' });
    });

    it('should reject approval by non-admin', () => {
      const dto = {
        notes: 'Approved',
      };

      return request(app.getHttpServer())
        .patch('/kyc/kyc-123/approve')
        .set('Authorization', authToken)
        .send(dto)
        .expect(HttpStatus.FORBIDDEN);
    });
  });

  describe('PATCH /kyc/:id/reject', () => {
    it('should reject KYC (admin only)', () => {
      const dto = {
        reason: 'Invalid document',
      };

      return request(app.getHttpServer())
        .patch('/kyc/kyc-123/reject')
        .set('Authorization', adminToken)
        .send(dto)
        .expect(HttpStatus.OK)
        .expect({ success: true, message: 'KYC rejected' });
    });

    it('should reject rejection by non-admin', () => {
      const dto = {
        reason: 'Invalid document',
      };

      return request(app.getHttpServer())
        .patch('/kyc/kyc-123/reject')
        .set('Authorization', authToken)
        .send(dto)
        .expect(HttpStatus.FORBIDDEN);
    });
  });

  describe('GET /kyc/stats', () => {
    it('should get KYC statistics (admin only)', () => {
      return request(app.getHttpServer())
        .get('/kyc/stats')
        .set('Authorization', adminToken)
        .expect(HttpStatus.OK)
        .expect((res) => {
          expect(res.body).toHaveProperty('total');
          expect(res.body).toHaveProperty('approvalRate');
        });
    });

    it('should deny statistics access to non-admin', () => {
      return request(app.getHttpServer())
        .get('/kyc/stats')
        .set('Authorization', authToken)
        .expect(HttpStatus.FORBIDDEN);
    });
  });
});
