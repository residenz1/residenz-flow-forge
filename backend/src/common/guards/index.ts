import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

/**
 * JWT Authentication Guard
 * Valida que el request tenga un JWT válido en el header Authorization
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      this.logger.warn(`Unauthorized access attempt: ${info?.message || err?.message}`);
      throw err || new UnauthorizedException('Invalid or missing token');
    }
    return user;
  }
}

/**
 * Roles Guard
 * Verifica que el usuario tenga uno de los roles requeridos
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!requiredRoles) {
      return true; // Si no hay roles especificados, permitir acceso
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return requiredRoles.includes(user.role);
  }
}

/**
 * Optional JWT Guard
 * Intenta validar JWT pero no falla si no está presente
 */
@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(_err: any, user: any) {
    return user || null;
  }
}
