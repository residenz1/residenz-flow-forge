import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { KycVerification } from '@database/entities/kyc-verification.entity';
import { KycController } from './controllers/kyc.controller';
import { KycScheduler } from './kyc.scheduler';
import { KycService } from './services/kyc.service';
import { MetamapService } from './integrations/metamap.service';
import { PrometeoService } from './integrations/prometeo.service';
import { KycVerificationRepository } from './repositories/kyc-verification.repository';

/**
 * KYC Module
 * Gestiona verificación de identidad con MetaMap y Prometeo
 * 
 * Componentes:
 * - Controller: Endpoints HTTP para gestión de KYC
 * - Service: Lógica de negocio de verificación
 * - MetamapService: Integración con API de MetaMap
 * - PrometeoService: Integración con validación bancaria
 * - Repository: Capa de acceso a datos
 * 
 * Estados: PENDING, IN_PROGRESS, APPROVED, REJECTED, EXPIRED
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([KycVerification]),
    HttpModule,
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
  ],
  controllers: [KycController],
  providers: [
    KycService,
    MetamapService,
    PrometeoService,
    KycScheduler,
    KycVerificationRepository,
  ],
  exports: [KycService, KycVerificationRepository],
})
export class KycModule {}
