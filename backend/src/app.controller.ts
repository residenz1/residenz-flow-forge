import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from '@common/decorators';

/**
 * App Controller
 * Health checks y endpoints públicos generales
 */
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * Health check endpoint
   * GET /health
   */
  @Get('/health')
  @HttpCode(HttpStatus.OK)
  @Public()
  health() {
    return this.appService.getHealth();
  }

  /**
   * Version endpoint
   * GET /version
   */
  @Get('/version')
  @HttpCode(HttpStatus.OK)
  @Public()
  version() {
    return this.appService.getVersion();
  }

  /**
   * Ready endpoint (Kubernetes readiness probe)
   * GET /ready
   */
  @Get('/ready')
  @HttpCode(HttpStatus.OK)
  @Public()
  ready() {
    return this.appService.ready();
  }
}
