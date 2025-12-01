import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IdempotencyKey } from '@database/entities/idempotency-key.entity';

/**
 * Idempotency Repository
 * 
 * Gestiona la prevención de procesamiento duplicado de webhooks.
 * Implementa el patrón "Idempotent Consumer" para operaciones financieras.
 * 
 * Estrategia:
 * 1. Antes de procesar: Verificar si existe
 * 2. Crear registro con status PROCESSING (lock optimista)
 * 3. Procesar evento
 * 4. Actualizar a PROCESSED o FAILED
 */
@Injectable()
export class IdempotencyRepository {
    private readonly logger = new Logger(IdempotencyRepository.name);

    constructor(
        @InjectRepository(IdempotencyKey)
        private readonly repository: Repository<IdempotencyKey>,
    ) { }

    /**
     * Verifica si un evento ya fue procesado
     * 
     * @param providerEventId - ID del evento del proveedor
     * @param providerName - Nombre del proveedor (stripe, prometeo)
     * @returns true si ya fue procesado exitosamente
     */
    async exists(providerEventId: string, providerName: string): Promise<boolean> {
        const existing = await this.repository.findOne({
            where: {
                providerEventId,
                providerName,
                status: 'PROCESSED',
            },
        });

        return !!existing;
    }

    /**
     * Verifica si un evento está siendo procesado actualmente
     * Útil para evitar race conditions
     */
    async isProcessing(providerEventId: string, providerName: string): Promise<boolean> {
        const existing = await this.repository.findOne({
            where: {
                providerEventId,
                providerName,
                status: 'PROCESSING',
            },
        });

        return !!existing;
    }

    /**
     * Crea un registro de idempotencia (Lock optimista)
     * 
     * @throws Error si el evento ya existe (duplicate key)
     * @returns IdempotencyKey creado
     */
    async create(params: {
        providerEventId: string;
        providerName: string;
        eventType?: string;
        payload?: Record<string, any>;
    }): Promise<IdempotencyKey> {
        try {
            const key = this.repository.create({
                providerEventId: params.providerEventId,
                providerName: params.providerName,
                eventType: params.eventType,
                payload: params.payload,
                status: 'PROCESSING',
                expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 días
            });

            const saved = await this.repository.save(key);

            this.logger.log(
                `[IDEMPOTENCY] Created key: ${params.providerName}:${params.providerEventId}`,
            );

            return saved;
        } catch (error: any) {
            // Si falla por duplicate key, significa que ya existe
            if (error.code === '23505') {
                // PostgreSQL unique violation
                this.logger.warn(
                    `[IDEMPOTENCY] Duplicate event detected: ${params.providerName}:${params.providerEventId}`,
                );
                throw new Error('DUPLICATE_EVENT');
            }
            throw error;
        }
    }

    /**
     * Marca un evento como procesado exitosamente
     */
    async markAsProcessed(
        providerEventId: string,
        providerName: string,
        result?: Record<string, any>,
    ): Promise<void> {
        await this.repository.update(
            { providerEventId, providerName },
            {
                status: 'PROCESSED',
                processedAt: new Date(),
                result,
            },
        );

        this.logger.log(
            `[IDEMPOTENCY] Marked as processed: ${providerName}:${providerEventId}`,
        );
    }

    /**
     * Marca un evento como fallido
     * Permite reintentos posteriores
     */
    async markAsFailed(
        providerEventId: string,
        providerName: string,
        errorMessage: string,
    ): Promise<void> {
        await this.repository.update(
            { providerEventId, providerName },
            {
                status: 'FAILED',
                errorMessage,
                processedAt: new Date(),
            },
        );

        this.logger.error(
            `[IDEMPOTENCY] Marked as failed: ${providerName}:${providerEventId} - ${errorMessage}`,
        );
    }

    /**
     * Obtiene un registro de idempotencia
     */
    async findOne(
        providerEventId: string,
        providerName: string,
    ): Promise<IdempotencyKey | null> {
        return await this.repository.findOne({
            where: { providerEventId, providerName },
        });
    }

    /**
     * Limpia registros expirados (Cron job)
     * Se debe ejecutar periódicamente para liberar espacio
     */
    async cleanExpired(): Promise<number> {
        const result = await this.repository
            .createQueryBuilder()
            .delete()
            .where('expires_at < :now', { now: new Date() })
            .execute();

        this.logger.log(`[IDEMPOTENCY] Cleaned ${result.affected} expired keys`);

        return result.affected || 0;
    }

    /**
     * Obtiene estadísticas de idempotencia (para monitoring)
     */
    async getStats(): Promise<{
        total: number;
        processing: number;
        processed: number;
        failed: number;
    }> {
        const [total, processing, processed, failed] = await Promise.all([
            this.repository.count(),
            this.repository.count({ where: { status: 'PROCESSING' } }),
            this.repository.count({ where: { status: 'PROCESSED' } }),
            this.repository.count({ where: { status: 'FAILED' } }),
        ]);

        return { total, processing, processed, failed };
    }
}
