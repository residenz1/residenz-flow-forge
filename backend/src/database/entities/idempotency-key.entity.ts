import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
} from 'typeorm';

/**
 * Idempotency Key Entity
 * 
 * Previene procesamiento duplicado de webhooks y operaciones de pago.
 * Crítico para evitar duplicación de saldos o pagos.
 * 
 * Casos de uso:
 * - Webhooks de Stripe (payment_intent.succeeded puede llegar 2-3 veces)
 * - Webhooks de Prometeo (confirmación de transferencias)
 * - Operaciones de pago manuales con retry
 * 
 * Estrategia: "At-least-once delivery" → Guardamos cada evento procesado
 */
@Entity('idempotency_keys')
@Index(['providerEventId', 'providerName'], { unique: true })
export class IdempotencyKey {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    /**
     * ID único del evento del proveedor
     * Ejemplos:
     * - Stripe: evt_1234567890
     * - Prometeo: payment_abc123
     */
    @Column({ name: 'provider_event_id', type: 'varchar', length: 255 })
    @Index()
    providerEventId!: string;

    /**
     * Nombre del proveedor
     * Valores: 'stripe' | 'prometeo' | 'manual'
     */
    @Column({ name: 'provider_name', type: 'varchar', length: 50 })
    providerName!: string;

    /**
     * Estado del procesamiento
     * - PROCESSING: Evento en proceso (lock optimista)
     * - PROCESSED: Evento procesado exitosamente
     * - FAILED: Evento falló (se puede reintentar)
     */
    @Column({
        type: 'enum',
        enum: ['PROCESSING', 'PROCESSED', 'FAILED'],
        default: 'PROCESSING',
    })
    status!: 'PROCESSING' | 'PROCESSED' | 'FAILED';

    /**
     * Tipo de evento
     * Ejemplos: 'payment.succeeded', 'payout.completed', 'charge.refunded'
     */
    @Column({ name: 'event_type', type: 'varchar', length: 100, nullable: true })
    eventType?: string;

    /**
     * Payload completo del webhook (para debugging)
     * Almacenamos el JSON original por si necesitamos reprocesar
     */
    @Column({ type: 'jsonb', nullable: true })
    payload?: Record<string, any>;

    /**
     * Resultado del procesamiento
     * Útil para auditoría y debugging
     */
    @Column({ type: 'jsonb', nullable: true })
    result?: Record<string, any>;

    /**
     * Mensaje de error (si status = FAILED)
     */
    @Column({ name: 'error_message', type: 'text', nullable: true })
    errorMessage?: string;

    /**
     * Timestamp de cuando se procesó
     */
    @Column({ name: 'processed_at', type: 'timestamp', nullable: true })
    processedAt?: Date;

    /**
     * TTL: Los registros se pueden limpiar después de 90 días
     * (Cumplimiento de retención de datos)
     */
    @Column({ name: 'expires_at', type: 'timestamp', nullable: true })
    expiresAt?: Date;

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date;
}
