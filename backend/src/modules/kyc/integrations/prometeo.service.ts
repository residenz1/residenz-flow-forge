import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';

/**
 * Prometeo Integration Service
 * Validar cuentas bancarias con Prometeo
 * API: https://developers.prometeo.io
 */
@Injectable()
export class PrometeoService {
  private readonly logger = new Logger(PrometeoService.name);
  private readonly httpClient: AxiosInstance;
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get('prometeo.apiKey') || 'prometeo-key';
    this.baseUrl = this.configService.get('prometeo.baseUrl') || 'https://api.prometeo.io';

    this.httpClient = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      timeout: 15000,
    });
  }

  /**
   * Validar cuenta bancaria
   * Verifica que la cuenta existe y pertenece al titular
   */
  async validateBankAccount(params: {
    bankName: string;
    accountNumber: string;
    routingNumber: string;
    accountHolderName: string;
  }): Promise<{
    isValid: boolean;
    accountExists: boolean;
    ownerMatch: boolean;
    bankCode: string;
    accountType?: string;
    errorCode?: string;
    errorMessage?: string;
  }> {
    try {
      this.logger.log(
        `Validating bank account: ${params.bankName} ${params.accountNumber.slice(-4)}`,
      );

      const response = await this.httpClient.post('/v1/accounts/validate', {
        bank_code: this.getBankCode(params.bankName),
        account_number: params.accountNumber,
        routing_number: params.routingNumber,
        account_holder_name: params.accountHolderName,
      });

      const {
        valid,
        account_exists,
        owner_match,
        bank_code,
        account_type,
      } = response.data;

      const result = {
        isValid: valid === true,
        accountExists: account_exists === true,
        ownerMatch: owner_match === true,
        bankCode: bank_code,
        accountType: account_type,
      };

      this.logger.log(`Validation result: valid=${result.isValid}, ownerMatch=${result.ownerMatch}`);

      return result;
    } catch (error: any) {
      this.logger.warn(
        `Bank validation failed: ${error.response?.data?.message || error.message}`,
      );

      return {
        isValid: false,
        accountExists: false,
        ownerMatch: false,
        bankCode: '',
        errorCode: error.response?.data?.code,
        errorMessage: error.response?.data?.message,
      };
    }
  }

  /**
   * Obtener información de banco
   * Retorna datos del banco (código, nombre, etc)
   */
  async getBankInfo(bankName: string): Promise<{
    code: string;
    name: string;
    country?: string;
    supportedAccountTypes?: string[];
  }> {
    try {
      this.logger.log(`Getting bank info for: ${bankName}`);

      const response = await this.httpClient.get('/v1/banks/search', {
        params: { q: bankName },
      });

      const bank = response.data.banks?.[0];

      if (!bank) {
        return {
          code: '',
          name: bankName,
        };
      }

      return {
        code: bank.code,
        name: bank.name,
        country: bank.country,
        supportedAccountTypes: bank.account_types,
      };
    } catch (error) {
      const err = error as any;
      this.logger.warn(`Error getting bank info: ${err.message}`);
      return {
        code: '',
        name: bankName,
      };
    }
  }

  /**
   * Verificar cuentas enlazadas del usuario
   * Retorna todas las cuentas validadas
   */
  async getUserAccounts(userId: string): Promise<any[]> {
    try {
      this.logger.log(`Getting Prometeo accounts for user: ${userId}`);

      const response = await this.httpClient.get(`/v1/users/${userId}/accounts`);

      return response.data.accounts || [];
    } catch (error) {
      const err = error as any;
      this.logger.warn(`Error getting user accounts: ${err.message}`);
      return [];
    }
  }

  /**
   * Crear token de acceso temporal para enlace de cuenta
   */
  async createAccountLinkToken(userId: string): Promise<{
    linkToken: string;
    expiresAt: Date;
  }> {
    try {
      this.logger.log(`Creating link token for user: ${userId}`);

      const response = await this.httpClient.post('/v1/link-tokens', {
        user_id: userId,
        client_name: 'Residenz',
        language: 'es',
      });

      return {
        linkToken: response.data.link_token,
        expiresAt: new Date(response.data.expires_at),
      };
    } catch (error) {
      const err = error as any;
      this.logger.error(`Error creating link token: ${err.message}`);
      throw new BadRequestException('Failed to create account link token');
    }
  }

  /**
   * Intercambiar link token por acceso a cuenta
   */
  async exchangeLinkToken(linkToken: string): Promise<{
    accessToken: string;
    accountId: string;
  }> {
    try {
      this.logger.log(`Exchanging link token`);

      const response = await this.httpClient.post('/v1/link-tokens/exchange', {
        link_token: linkToken,
      });

      return {
        accessToken: response.data.access_token,
        accountId: response.data.account_id,
      };
    } catch (error) {
      const err = error as any;
      this.logger.error(`Error exchanging link token: ${err.message}`);
      throw new BadRequestException('Failed to exchange link token');
    }
  }

  /**
   * Mapear nombre de banco a código
   * Utility method
   */
  private getBankCode(bankName: string): string {
    const bankCodes: Record<string, string> = {
      'banorte': '072',
      'banamex': '002',
      'bbva': '012',
      'scotiabank': '044',
      'hsbc': '021',
      'citibanamex': '002',
      'santander': '014',
      'inbursa': '036',
      'interbank': '037',
      'banregio': '058',
      'invex': '059',
      'bansi': '060',
      'bajio': '030',
      'azteca': '127',
      'autofin': '062',
      'barclays': '102',
      'compartamos': '130',
      'bmultiva': '132',
      'donde': '156',
      'bancrea': '166',
      'mufg': '168',
      'sabadell': '156',
      'finamex': '614',
      'g. bursatil': '616',
      'masari': '638',
      'monexcb': '640',
      'gbolsa': '642',
      'cbdeutsche': '645',
      'zurich': '647',
      'zurichvi': '648',
      'skandia': '649',
      'bulltick casa': '651',
      'merrill': '652',
      'profuturo': '659',
      'caja pop mexicana': '662',
      'telecomm': '667',
      'evercore': '668',
      'skandia inversion': '670',
      'cbamex': '678',
      'dash': '679',
      'jpm': '680',
      'cibanco': '143',
      'hipotecaria su': '154',
      'bancoppel': '137',
      'consubanco': '140',
      'volkswagen': '141',
      'agrofinanzas': '163',
      'icbc': '607',
    };

    return bankCodes[bankName.toLowerCase()] || '';
  }

  /**
   * Validar estado de sesión de verificación
   */
  async getVerificationStatus(verificationId: string): Promise<{
    status: 'pending' | 'verified' | 'failed' | 'expired';
    errorMessage?: string;
  }> {
    try {
      const response = await this.httpClient.get(
        `/v1/verifications/${verificationId}`,
      );

      return {
        status: response.data.status?.toLowerCase() || 'pending',
        errorMessage: response.data.error_message,
      };
    } catch (error: any) {
      return {
        status: 'failed',
        errorMessage: error.response?.data?.message || error.message,
      };
    }
  }
}
