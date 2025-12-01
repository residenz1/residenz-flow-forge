import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@database/entities';

/**
 * Matching Service
 * Algoritmo para encontrar el mejor resi para una reserva
 * Criterios: rating, distancia, disponibilidad, experiencia
 */
@Injectable()
export class MatchingService {
  private readonly logger = new Logger(MatchingService.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  /**
   * Encontrar el mejor resi disponible
   * Criterios de matching:
   * 1. Rating mínimo (default 3.0)
   * 2. Distancia máxima (default 10km)
   * 3. Disponibilidad (sin conflictos)
   * 4. Ubicación preferida
   */
  async findBestResi(
    _addressId: string,
    _scheduledAt: Date,
    options?: {
      maxDistance?: number;
      minRating?: number;
      excludeResiIds?: string[];
    },
  ): Promise<User | null> {
    const {
      maxDistance: _maxDistance = 10,
      minRating = 3.0,
      excludeResiIds = [],
    } = options || {};

    try {
      // Buscar resis activos con rating suficiente
      let query = this.userRepository
        .createQueryBuilder('user')
        .where('user.role = :role', { role: 'RESI' })
        .andWhere('user.isActive = true')
        .andWhere('user.totalReviews > 0') // Debe tener al menos una reseña
        .andWhere(
          `(user.rating IS NULL OR user.rating >= :minRating)`,
          { minRating },
        )
        .orderBy('COALESCE(user.rating, 3)', 'DESC') // Ordenar por rating
        .addOrderBy('user.totalReviews', 'DESC'); // Desempate por número de reseñas

      if (excludeResiIds.length > 0) {
        query = query.andWhere('user.id NOT IN (:...excludeResiIds)', {
          excludeResiIds,
        });
      }

      // TODO: Integrar cálculo de distancia cuando se implemente geolocalización
      // Por ahora, seleccionar el mejor disponible

      const resi = await query.getOne();

      if (!resi) {
        this.logger.warn(
          `No se encontró resi disponible para addressId=${_addressId}, minRating=${minRating}`,
        );
        return null;
      }

      this.logger.log(
        `Resi encontrado: ${resi.id} (rating=${resi.rating}, reviews=${resi.totalReviews})`,
      );

      return resi;
    } catch (error) {
      this.logger.error(
        `Error en findBestResi: ${(error as Error).message}`,
        (error as Error).stack,
      );
      return null;
    }
  }

  /**
   * Obtener múltiples candidatos (para presentar opciones al cliente)
   */
  async findResiCandidates(
    _addressId: string,
    _scheduledAt: Date,
    limit: number = 5,
    _options?: {
      maxDistance?: number;
      minRating?: number;
      excludeResiIds?: string[];
    },
  ): Promise<User[]> {
    const {
      maxDistance: _maxDistance = 10,
      minRating = 3.0,
      excludeResiIds = [],
    } = _options || {};

    try {
      let query = this.userRepository
        .createQueryBuilder('user')
        .where('user.role = :role', { role: 'RESI' })
        .andWhere('user.isActive = true')
        .andWhere('user.totalReviews > 0')
        .andWhere(
          `(user.rating IS NULL OR user.rating >= :minRating)`,
          { minRating },
        )
        .orderBy('COALESCE(user.rating, 3)', 'DESC')
        .addOrderBy('user.totalReviews', 'DESC')
        .limit(limit);

      if (excludeResiIds.length > 0) {
        query = query.andWhere('user.id NOT IN (:...excludeResiIds)', {
          excludeResiIds,
        });
      }

      return await query.getMany();
    } catch (error) {
      this.logger.error(
        `Error en findResiCandidates: ${(error as Error).message}`,
        (error as Error).stack,
      );
      return [];
    }
  }

  /**
   * Calcular score de compatibilidad
   * Usado para rankear resis en orden de preferencia
   */
  calculateCompatibilityScore(
    resi: User,
    _options?: {
      minRating?: number;
      preferredLanguages?: string[];
    },
  ): number {
    let score = 0;

    // Rating (0-50 puntos)
    if (resi.rating) {
      score += (resi.rating / 5) * 50;
    }

    // Número de reseñas (0-30 puntos)
    const maxReviews = 1000;
    const reviewScore = Math.min((resi.totalReviews / maxReviews) * 30, 30);
    score += reviewScore;

    // Verificación KYC (20 puntos)
    if (resi.kycStatus === 'APPROVED') {
      score += 20;
    }

    return Math.round(score);
  }

  /**
   * Validar disponibilidad del resi
   * Verifica que no haya conflictos de horario
   */
  async validateResiAvailability(
    _resiId: string,
    _scheduledAt: Date,
    _estimatedDurationMinutes: number = 120,
  ): Promise<boolean> {
    try {
      // TODO: Integrar con calendario/disponibilidad del resi
      // Por ahora, retornar true (todos disponibles)
      return true;
    } catch (error) {
      this.logger.error(
        `Error validando disponibilidad: ${(error as Error).message}`,
        (error as Error).stack,
      );
      return false;
    }
  }

  /**
   * Obtener resis cercanos geográficamente
   * (Requiere integración con geolocalización)
   */
  async findNearbyResis(
    _latitude: number,
    _longitude: number,
    _maxDistanceKm: number = 10,
    _limit: number = 10,
  ): Promise<User[]> {
    // TODO: Implementar búsqueda geográfica
    // Requiere:
    // - Latitud/longitud almacenados en User entity
    // - PostGIS extension en PostgreSQL
    // - Fórmula de Haversine

    this.logger.warn(
      'findNearbyResis: Búsqueda geográfica no implementada aún',
    );
    return [];
  }

  /**
   * Ranking de resis por múltiples criterios
   */
  async rankResis(
    resis: User[],
    criteria?: {
      prioritizeRating?: boolean;
      prioritizeExperience?: boolean;
      prioritizeNewResis?: boolean;
    },
  ): Promise<User[]> {
    const { prioritizeRating = true, prioritizeExperience = true } =
      criteria || {};

    return resis.sort((a, b) => {
      let scoreA = this.calculateCompatibilityScore(a);
      let scoreB = this.calculateCompatibilityScore(b);

      // Aplicar ajustes según criterios
      if (prioritizeExperience && a.totalReviews !== b.totalReviews) {
        return b.totalReviews - a.totalReviews;
      }

      if (prioritizeRating && a.rating !== b.rating) {
        return (b.rating || 0) - (a.rating || 0);
      }

      return scoreB - scoreA;
    });
  }
}
