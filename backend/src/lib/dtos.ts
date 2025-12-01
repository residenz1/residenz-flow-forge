/**
 * DTOs (Data Transfer Objects) de validación
 */

import { IsEmail, IsPhoneNumber, IsString, MinLength, IsEnum, MaxLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email?: string;

  @IsPhoneNumber()
  phone?: string;

  @IsString()
  @MinLength(8)
  password?: string;

  @IsString()
  firstName?: string;

  @IsString()
  lastName?: string;

  @IsEnum(['CLIENT', 'RESI'])
  role?: string;
}

export class LoginDto {
  @IsEmail()
  email?: string;

  @IsString()
  @MinLength(8)
  password?: string;
}

export class VerifyOtpDto {
  @IsString()
  phone?: string;

  @IsString()
  @MinLength(6)
  @MaxLength(6)
  code?: string;
}
