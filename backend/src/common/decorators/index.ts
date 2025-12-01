import { SetMetadata, createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Decorator para especificar roles requeridos en un endpoint
 * Uso: @Roles('ADMIN', 'RESI')
 */
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);

/**
 * Decorator para obtener el usuario actual del request
 * Uso: @CurrentUser() user: User o @CurrentUser('sub') userId: string
 */
export const CurrentUser = createParamDecorator(
  (field: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    
    if (!user) {
      return null;
    }
    
    if (field) {
      return user[field];
    }
    
    return user;
  },
);

/**
 * Decorator para especificar si un endpoint es público
 * Uso: @Public()
 */
export const Public = () => SetMetadata('isPublic', true);

/**
 * Decorator para rate limiting
 * Uso: @RateLimit(10)
 */
export const RateLimit = (limit: number) => SetMetadata('rateLimit', limit);
