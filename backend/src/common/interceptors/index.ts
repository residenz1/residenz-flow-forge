import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

/**
 * Logging Interceptor
 * Registra detalles de cada request/response
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;
    const now = Date.now();

    return next.handle().pipe(
      tap({
        next: (_data: any) => {
          const duration = Date.now() - now;
          this.logger.log(
            `${method} ${url} - ${duration}ms`,
            'HTTP'
          );
        },
        error: (error: any) => {
          const duration = Date.now() - now;
          this.logger.error(
            `${method} ${url} - ${duration}ms - ${error.message}`,
            error.stack,
            'HTTP'
          );
        },
      }),
    );
  }
}

/**
 * Transform Response Interceptor
 * Transforma todas las respuestas a formato consistente
 */
@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      tap(data => {
        const response = context.switchToHttp().getResponse();
        if (!response.headersSent) {
          response.json({
            statusCode: response.statusCode || 200,
            message: 'Success',
            data,
            timestamp: new Date().toISOString(),
          });
        }
      }),
    );
  }
}
