import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ConfigService } from '@nestjs/config';

/**
 * Utility para setup testing
 */
export async function setupTestingModule() {
  const moduleFixture = await NestFactory.create(AppModule);
  const configService = moduleFixture.get(ConfigService);

  return {
    app: moduleFixture,
    configService,
  };
}

/**
 * Mock user para tests
 */
export const mockUser = {
  id: 'test-user-123',
  email: 'test@example.com',
  phone: '+1234567890',
  firstName: 'Test',
  lastName: 'User',
  role: 'CLIENT',
  kycStatus: 'APPROVED',
};

/**
 * Mock booking para tests
 */
export const mockBooking = {
  id: 'test-booking-123',
  clientId: 'client-123',
  resiId: 'resi-123',
  status: 'PENDING',
  agreedPayout: 50,
  scheduledAt: new Date(),
};

/**
 * Mock JWT token
 */
export const mockJwtToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0LXVzZXItMTIzIiwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIiwicm9sZSI6IkNMSUVOVCIsImlhdCI6MTYzNTc0MDAwMH0';
