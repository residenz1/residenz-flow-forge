import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

/**
 * Health Check E2E Test
 */
describe('App (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/ (GET) health', () => {
    return request(app.getHttpServer())
      .get('/health')
      .expect(200)
      .expect(res => {
        expect(res.body).toHaveProperty('status');
        expect(res.body.status).toBe('ok');
      });
  });

  it('/ (GET) version', () => {
    return request(app.getHttpServer())
      .get('/version')
      .expect(200)
      .expect(res => {
        expect(res.body).toHaveProperty('version');
      });
  });

  it('/ (GET) ready', () => {
    return request(app.getHttpServer())
      .get('/ready')
      .expect(200)
      .expect(res => {
        expect(res.body).toHaveProperty('ready');
        expect(res.body.ready).toBe(true);
      });
  });
});
