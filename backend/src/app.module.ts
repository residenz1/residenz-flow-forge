import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { CacheModule } from '@nestjs/cache-manager';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { BullModule } from '@nestjs/bull';
// import * as redisStore from 'cache-manager-redis-store';

import {
  appConfig,
  databaseConfig,
  redisConfig,
  jwtConfig,
  otpConfig,
  twilioConfig,
  stripeConfig,
  metamapConfig,
  prometeoConfig,
} from '@config/configuration';
import { dataSourceOptions } from '@config/data-source';

import { AuthModule } from '@modules/auth/auth.module';
import { UsersModule } from '@modules/users/users.module';
import { BankingModule } from '@modules/banking/banking.module';
import { BookingsModule } from '@modules/bookings/bookings.module';
import { PaymentsModule } from '@modules/payments/payments.module';
import { KycModule } from '@modules/kyc/kyc.module';
import { ChatModule } from '@modules/chat/chat.module';
import { NotificationsModule } from '@modules/notifications/notifications.module';
import { WorkersModule } from '@modules/workers/workers.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';

/**
 * Root Application Module
 * Configura todos los módulos, servicios globales y middleware
 */
@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        appConfig,
        databaseConfig,
        redisConfig,
        jwtConfig,
        otpConfig,
        twilioConfig,
        stripeConfig,
        metamapConfig,
        prometeoConfig,
      ],
      envFilePath: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
    }),

    // Database
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async () => dataSourceOptions,
    }),

    // Authentication
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('jwt.secret'),
        signOptions: { expiresIn: configService.get('jwt.expiresIn') },
      }),
    }),

    // Caching
    CacheModule.registerAsync({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: async (_configService: ConfigService) => {
        return {
          ttl: 5 * 60, // 5 minutes
        };
      },
    }),

    // Event Emitter
    EventEmitterModule.forRoot({
      wildcard: true,
      delimiter: '.',
      newListener: false,
      removeListener: false,
      maxListeners: 10,
      verboseMemoryLeak: false,
      ignoreErrors: false,
    }),

    // Bull Queue
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const redisConfig = configService.get('redis');
        return {
          redis: {
            host: redisConfig.host,
            port: redisConfig.port,
            db: redisConfig.db,
          },
          settings: {
            lockDuration: 30000,
            lockRenewTime: 15000,
            keyPrefix: 'residenz:queue',
          },
        };
      },
    }),

    // Feature Modules
    AuthModule,
    UsersModule,
    BankingModule,
    BookingsModule,
    PaymentsModule,
    KycModule,
    ChatModule,
    NotificationsModule,
    WorkersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
