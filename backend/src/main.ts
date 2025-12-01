import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';

import { AppModule } from './app.module';
import { AllExceptionsFilter } from '@common/filters';
import { LoggingInterceptor } from '@common/interceptors';

/**
 * Bootstrap de la aplicación NestJS con Fastify
 */
async function bootstrap() {
  const logger = new Logger('Bootstrap');

  try {
    // Crear aplicación con Fastify adapter
    const app = await NestFactory.create<NestFastifyApplication>(
      AppModule,
      new FastifyAdapter({ logger: true }),
    );

    const configService = app.get(ConfigService);
    const port = configService.get('app.port');
    const corsOrigin = configService.get('app.cors.origin');

    // Seguridad
    app.use(helmet());

    // CORS
    app.enableCors({
      origin: corsOrigin,
      credentials: configService.get('app.cors.credentials'),
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    });

    // Validación global
    app.useGlobalPipes(new ValidationPipe({ transform: true }));

    // Filtros y interceptors globales
    app.useGlobalFilters(new AllExceptionsFilter());
    app.useGlobalInterceptors(new LoggingInterceptor());

    // Iniciar servidor
    await app.listen(port, '0.0.0.0');

    logger.log(`🚀 Residenz API running at http://localhost:${port}`);
    logger.log(`📝 Environment: ${configService.get('app.nodeEnv')}`);
    logger.log(`🔐 CORS enabled for: ${corsOrigin.join(', ')}`);
  } catch (error) {
    logger.error('Failed to start application', error);
    process.exit(1);
  }
}

bootstrap();
