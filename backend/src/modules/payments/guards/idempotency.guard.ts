import {
    Injectable,
    CanActivate,
    ExecutionContext,
    ConflictException,
    BadRequestException,
    Logger,
} from '@nestjs/common';
import { Request } from 'express';
import { IdempotencyRepository } from '../repositories/idempotency.repository';

/**
 * Idempotency Guard
 * 
 * Previene procesamiento duplicado de webhooks y operaciones de pago.
 * 
 * Funcionamiento:
 * 1. Extrae el ID del evento del header o body
 * 2. Verifica si ya fue procesado
 * 3. Si no existe, crea un registro con status PROCESSING (lock)
 * 4. Si ya existe, rechaza la petición
 * 
 * Uso:
 * @UseGuards(IdempotencyGuard)
 * async handleWebhook(@Req() req: Request) { ... }
 * 
 * Headers esperados:
 * - Idempotency-Key: ID único del cliente (opcional)
 * - x-stripe-signature: Firma de Stripe
 * - x-prometeo-signature: Firma de Prometeo
 */
@Injectable()
export class IdempotencyGuard implements CanActivate {
    private readonly logger = new Logger(IdempotencyGuard.name);

    constructor(private readonly idempotencyRepo: IdempotencyRepository) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>();

        // Extraer información del proveedor y evento
        const provider = this.extractProvider(request);
        const eventId = this.extractEventId(request, provider);
        const eventType = this.extractEventType(request, provider);

        if (!eventId) {
            this.logger.warn('[IDEMPOTENCY] No event ID found in request');
            throw new BadRequestException('Missing event ID for idempotency check');
        }

        this.logger.log(`[IDEMPOTENCY] Checking: ${provider}:${eventId}`);

        try {
            // 1. Verificar si ya fue procesado
            const alreadyProcessed = await this.idempotencyRepo.exists(eventId, provider);

            if (alreadyProcessed) {
                this.logger.warn(
                    `[IDEMPOTENCY] ⚠️  Duplicate event detected: ${provider}:${eventId}`,
                );
                throw new ConflictException({
                    message: 'Event already processed',
                    eventId,
                    provider,
                    status: 'DUPLICATE',
                });
            }

            // 2. Verificar si está siendo procesado (race condition)
            const isProcessing = await this.idempotencyRepo.isProcessing(eventId, provider);

            if (isProcessing) {
                this.logger.warn(
                    `[IDEMPOTENCY] ⚠️  Event currently processing: ${provider}:${eventId}`,
                );
                throw new ConflictException({
                    message: 'Event is currently being processed',
                    eventId,
                    provider,
                    status: 'PROCESSING',
                });
            }

            // 3. Crear registro de idempotencia (lock optimista)
            await this.idempotencyRepo.create({
                providerEventId: eventId,
                providerName: provider,
                eventType,
                payload: request.body,
            });

            // 4. Adjuntar metadata al request para uso posterior
            (request as any).idempotencyKey = {
                eventId,
                provider,
                eventType,
            };

            this.logger.log(`[IDEMPOTENCY] ✅ Lock acquired: ${provider}:${eventId}`);

            return true;
        } catch (error: any) {
            if (error instanceof ConflictException) {
                throw error;
            }

            // Si es error de duplicate key de la DB, también es conflicto
            if (error.message === 'DUPLICATE_EVENT') {
                throw new ConflictException({
                    message: 'Event already processed (race condition)',
                    eventId,
                    provider,
                    status: 'DUPLICATE',
                });
            }

            // Otros errores se propagan
            this.logger.error(`[IDEMPOTENCY] Error: ${error.message}`, error.stack);
            throw error;
        }
    }

    /**
     * Extrae el nombre del proveedor de la ruta o headers
     */
    private extractProvider(request: Request): string {
        // Opción 1: De la ruta /webhooks/:provider
        if (request.params?.provider) {
            return request.params.provider.toLowerCase();
        }

        // Opción 2: De los headers
        if (request.headers['x-stripe-signature']) {
            return 'stripe';
        }

        if (request.headers['x-prometeo-signature']) {
            return 'prometeo';
        }

        // Opción 3: Del body
        if (request.body?.provider) {
            return request.body.provider.toLowerCase();
        }

        return 'unknown';
    }

    /**
     * Extrae el ID del evento según el proveedor
     */
    private extractEventId(request: Request, provider: string): string | null {
        // Opción 1: Header Idempotency-Key (estándar)
        const headerKey = request.headers['idempotency-key'] as string;
        if (headerKey) {
            return headerKey;
        }

        // Opción 2: Del body según proveedor
        const body = request.body;

        if (provider === 'stripe') {
            // Stripe webhooks tienen body.id
            return body?.id || null;
        }

        if (provider === 'prometeo') {
            // Prometeo puede tener diferentes estructuras
            return body?.data?.id || body?.id || body?.transaction_id || null;
        }

        // Opción 3: Genérico
        return body?.eventId || body?.event_id || body?.id || null;
    }

    /**
     * Extrae el tipo de evento
     */
    private extractEventType(request: Request, provider: string): string | undefined {
        const body = request.body;

        if (provider === 'stripe') {
            return body?.type; // e.g., 'payment_intent.succeeded'
        }

        if (provider === 'prometeo') {
            return body?.event_type || body?.type;
        }

        return body?.type || body?.event_type;
    }
}
