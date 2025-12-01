import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

/**
 * Validation Pipe
 * Valida DTOs contra sus esquemas de validación
 */
@Injectable()
export class ValidationPipe implements PipeTransform {
  async transform(value: any, metadata: any) {
    if (!metadata.type || typeof value !== 'object') {
      return value;
    }

    const object = plainToClass(metadata.type, value);
    const errors = await validate(object);

    if (errors.length > 0) {
      const messages = errors
        .map(error =>
          Object.values(error.constraints || {}).join(', ')
        )
        .join('; ');

      throw new BadRequestException(messages);
    }

    return value;
  }
}
