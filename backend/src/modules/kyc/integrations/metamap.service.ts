import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';

/**
 * MetaMap Integration Service
 * Integrarse con MetaMap para verificación de identidad
 * API: https://docs.metamap.io
 */
@Injectable()
export class MetamapService {
  private readonly logger = new Logger(MetamapService.name);
  private readonly httpClient: AxiosInstance;
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get('metamap.apiKey') || 'metamap-key';
    this.baseUrl = this.configService.get('metamap.baseUrl') || 'https://api.metamap.io';

    this.httpClient = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });
  }

  /**
   * Crear sesión de verificación
   * Retorna clientToken para iframe del cliente
   */
  async createSession(params: {
    email?: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
  }): Promise<{
    sessionId: string;
    clientToken: string;
    expiresAt: Date;
  }> {
    try {
      this.logger.log(`Creating MetaMap session for ${params.email || params.phone}`);

      const response = await this.httpClient.post('/v1/sessions', {
        email: params.email,
        phone: params.phone,
        firstName: params.firstName,
        lastName: params.lastName,
        language: 'es', // Spanish
      });

      const { id: sessionId, clientToken, expiresAt } = response.data;

      this.logger.log(`Session created: ${sessionId}`);

      return {
        sessionId,
        clientToken,
        expiresAt: new Date(expiresAt),
      };
    } catch (error) {
      const err = error as any;
      this.logger.error(`Error creating MetaMap session: ${err.message}`, err.stack);
      throw new BadRequestException('Failed to create verification session');
    }
  }

  /**
   * Obtener resultado de sesión
   * Se llama después de que el usuario completa la verificación
   */
  async getSessionResult(sessionId: string): Promise<{
    status: 'verified' | 'rejected' | 'pending' | 'expired';
    livenessScore: number;
    documentScore: number;
    documentNumber?: string;
    documentType?: string;
    rejectionReason?: string;
    data?: Record<string, any>;
  }> {
    try {
      this.logger.log(`Getting MetaMap result for session: ${sessionId}`);

      const response = await this.httpClient.get(`/v1/sessions/${sessionId}`);

      const {
        status,
        verification,
        document,
      } = response.data;

      const result = {
        status: status?.toLowerCase() || 'pending',
        livenessScore: verification?.livenessScore || 0,
        documentScore: verification?.documentScore || 0,
        documentNumber: document?.number,
        documentType: document?.type,
        rejectionReason: response.data.rejectionReason,
        data: response.data,
      };

      this.logger.log(`Session result: status=${result.status}, liveness=${result.livenessScore}`);

      return result;
    } catch (error) {
      const err = error as any;
      this.logger.error(`Error getting MetaMap result: ${err.message}`, err.stack);
      throw new BadRequestException('Failed to get verification result');
    }
  }

  /**
   * Verificar si una sesión está completada
   */
  async isSessionComplete(sessionId: string): Promise<boolean> {
    try {
      const result = await this.getSessionResult(sessionId);
      return result.status !== 'pending';
    } catch {
      return false;
    }
  }

  /**
   * Cancelar una sesión
   */
  async cancelSession(sessionId: string): Promise<boolean> {
    try {
      this.logger.log(`Cancelling MetaMap session: ${sessionId}`);

      await this.httpClient.post(`/v1/sessions/${sessionId}/cancel`);

      this.logger.log(`Session cancelled: ${sessionId}`);
      return true;
    } catch (error) {
      const err = error as any;
      this.logger.error(`Error cancelling session: ${err.message}`, err.stack);
      return false;
    }
  }

  /**
   * Validar webhook de MetaMap
   * Verifica que el webhook sea legítimo
   */
  validateWebhook(payload: any, signature: string): boolean {
    try {
      const crypto = require('crypto');
      const webhookSecret = this.configService.get('metamap.webhookSecret');

      if (!webhookSecret || !signature) {
        return false;
      }

      const hash = crypto
        .createHmac('sha256', webhookSecret)
        .update(JSON.stringify(payload))
        .digest('hex');

      return hash === signature;
    } catch (error) {
      const err = error as any;
      this.logger.error(`Error validating webhook: ${err.message}`);
      return false;
    }
  }

  /**
   * Obtener historial de intentos de un usuario
   */
  async getUserHistory(email: string): Promise<any[]> {
    try {
      this.logger.log(`Getting MetaMap history for ${email}`);

      const response = await this.httpClient.get('/v1/sessions', {
        params: { email },
      });

      return response.data.sessions || [];
    } catch (error) {
      const err = error as any;
      this.logger.error(`Error getting user history: ${err.message}`, err.stack);
      return [];
    }
  }
}
