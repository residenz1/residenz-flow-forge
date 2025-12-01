import { Module } from '@nestjs/common';
import { JwtStrategy } from './strategies/jwt.strategy';

/**
 * Auth Module
 * Gestiona autenticación, OTP, JWT tokens
 */
@Module({
  providers: [JwtStrategy],
  exports: [JwtStrategy],
})
export class AuthModule {}
