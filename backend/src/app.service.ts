import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * App Service
 * Servicios generales de la aplicación
 */
@Injectable()
export class AppService {
  private readonly _logger = new Logger(AppService.name);

  constructor(private configService: ConfigService) {}

  /**
   * Retorna información de salud del servidor
   */
  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: this.configService.get('app.nodeEnv'),
    };
  }

  /**
   * Retorna versión de la aplicación
   */
  getVersion() {
    return {
      version: '1.0.0',
      name: this.configService.get('app.name'),
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Verifica si la aplicación está lista para recibir tráfico
   */
  ready() {
    return {
      ready: true,
      timestamp: new Date().toISOString(),
    };
  }
}
