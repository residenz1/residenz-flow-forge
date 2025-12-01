# 🏗️ RESIDENZ BACKEND SETUP - NestJS + Fastify + TypeORM + BullMQ

## Documento Ejecutable - Copia/Pega Paso a Paso

**Última actualización:** Diciembre 1, 2025  
**Status:** Listo para MVP  
**Tiempo estimado:** 30-45 minutos para copiar/pegar todo

---

## 📋 ÍNDICE DE CARPETAS

1. [ROOT FILES](#root-files)
2. [SRC - MAIN FILES](#src---main-files)
3. [SRC/COMMON](#srccommon)
4. [SRC/ENTITIES](#srcentities)
5. [SRC/MODULES/AUTH](#srcmodulesauth)
6. [SRC/MODULES/USERS](#srcmodulesusers)
7. [SRC/MODULES/BANKING](#srcmodulesbanking)
8. [SRC/MODULES/KYC](#srcmoduleskyc)
9. [SRC/MODULES/BOOKINGS](#srcmodulesbookings)
10. [SRC/MODULES/CHAT](#srcmoduleschat)
11. [SRC/MODULES/PAYMENTS](#srcmodulespayments)
12. [SRC/MODULES/NOTIFICATIONS](#srcmodulesnotifications)
13. [SRC/MODULES/WORKER](#srcmodulesworker)
14. [SRC/INTEGRATIONS](#srcintegrations)
15. [SRC/UTILS](#srcutils)
16. [TEST FILES](#test-files)
17. [MIGRATIONS](#migrations)

---

## ROOT FILES

### 1. `.env.example`

\`\`\`bash
# Database (Supabase PostgreSQL)
DATABASE_URL=postgresql://postgres:password@localhost:5432/residenz_db
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_DATABASE=residenz_db

# PGP Encryption (pgcrypto extension)
PGP_SYM_KEY=your-32-char-hex-key-here

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production
JWT_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d

# Redis
REDIS_URL=redis://localhost:6379
REDIS_HOST=localhost
REDIS_PORT=6379

# Stripe
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_test_xxx

# Prometeo (Account Validation)
PROMETEO_API_KEY=your_prometeo_sandbox_key
PROMETEO_API_URL=https://api.sandbox.prometeo.io
PROMETEO_ENVIRONMENT=sandbox

# MetaMap (KYC)
METAMAP_API_KEY=your_metamap_api_key
METAMAP_API_SECRET=your_metamap_api_secret
METAMAP_ENV=sandbox

# Twilio (SMS/OTP)
TWILIO_ACCOUNT_SID=ACxxx
TWILIO_AUTH_TOKEN=xxx
TWILIO_PHONE_NUMBER=+1234567890

# App Config
NODE_ENV=development
PORT=3000
WEBSOCKET_PORT=3001
API_URL=http://localhost:3000
FRONTEND_URL=http://localhost:5173
CORS_ORIGIN=http://localhost:5173,http://localhost:3000

# Logging
LOG_LEVEL=debug

# Rate Limiting
RATE_LIMIT_GLOBAL=100
RATE_LIMIT_OTP_ATTEMPTS=5
\`\`\`

---

### 2. `docker-compose.yml`

\`\`\`yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: residenz-postgres
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_DB: residenz_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - residenz-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    container_name: residenz-redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    networks:
      - residenz-network
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  api:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: residenz-api
    ports:
      - "3000:3000"
      - "3001:3001"
    environment:
      - DATABASE_URL=postgresql://postgres:password@postgres:5432/residenz_db
      - REDIS_URL=redis://redis:6379
      - NODE_ENV=development
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    volumes:
      - .:/app
      - /app/node_modules
    networks:
      - residenz-network
    command: npm run start:dev

networks:
  residenz-network:
    driver: bridge

volumes:
  postgres_data:
  redis_data:
\`\`\`

---

### 3. `Dockerfile`

\`\`\`dockerfile
# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/dist ./dist

EXPOSE 3000 3001

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \\
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

CMD ["node", "dist/main.js"]
\`\`\`

---

### 4. `package.json`

\`\`\`json
{
  "name": "residenz-api",
  "version": "1.0.0",
  "description": "Residenz neobanco/marketplace backend",
  "author": "Residenz Team",
  "private": true,
  "license": "MIT",
  "scripts": {
    "prebuild": "rimraf dist",
    "build": "nest build",
    "format": "prettier --write \\"src/**/*.ts\\" \\"test/**/*.ts\\"",
    "start": "nest start",
    "start:dev": "nest start --watch",
    "start:debug": "nest start --debug --watch",
    "start:prod": "node dist/main",
    "lint": "eslint \\"{src,apps,libs,test}/**/*.ts\\" --fix",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage",
    "test:debug": "node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand",
    "test:e2e": "jest --config ./test/jest-e2e.json",
    "typeorm": "typeorm",
    "migration:generate": "typeorm migration:generate",
    "migration:create": "typeorm migration:create",
    "migration:run": "typeorm migration:run",
    "migration:revert": "typeorm migration:revert",
    "seed": "ts-node src/seeds/seed.ts"
  },
  "dependencies": {
    "@nestjs/cache-manager": "^2.1.1",
    "@nestjs/common": "^10.3.3",
    "@nestjs/config": "^3.2.0",
    "@nestjs/core": "^10.3.3",
    "@nestjs/event-emitter": "^2.0.4",
    "@nestjs/jwt": "^12.0.1",
    "@nestjs/passport": "^10.0.3",
    "@nestjs/platform-fastify": "^10.3.3",
    "@nestjs/swagger": "^7.1.17",
    "@nestjs/typeorm": "^9.0.1",
    "@nestjs/websockets": "^10.3.3",
    "bcrypt": "^5.1.1",
    "bull": "^4.13.0",
    "cache-manager": "^5.5.0",
    "class-transformer": "^0.5.1",
    "class-validator": "^0.14.1",
    "fastify": "^4.27.0",
    "pg": "^8.12.0",
    "redis": "^4.7.0",
    "stripe": "^14.28.0",
    "twilio": "^4.21.0",
    "typeorm": "^0.3.19"
  },
  "devDependencies": {
    "@nestjs/cli": "^10.3.2",
    "@nestjs/schematics": "^10.0.3",
    "@nestjs/testing": "^10.3.3",
    "@types/bcrypt": "^5.0.2",
    "@types/jest": "^29.5.11",
    "@types/node": "^20.10.6",
    "@typescript-eslint/eslint-plugin": "^6.17.0",
    "@typescript-eslint/parser": "^6.17.0",
    "eslint": "^8.56.0",
    "eslint-config-prettier": "^9.1.0",
    "eslint-plugin-prettier": "^5.1.2",
    "jest": "^29.7.0",
    "prettier": "^3.1.1",
    "rimraf": "^5.0.5",
    "supertest": "^6.3.3",
    "ts-jest": "^29.1.1",
    "ts-loader": "^9.5.1",
    "ts-node": "^10.9.2",
    "tsconfig-paths": "^4.2.0",
    "typescript": "^5.3.3"
  }
}
\`\`\`

---

### 5. `tsconfig.json`

\`\`\`json
{
  "compilerOptions": {
    "module": "commonjs",
    "target": "ES2021",
    "lib": ["ES2021"],
    "declaration": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "allowSyntheticDefaultImports": true,
    "moduleResolution": "node",
    "baseUrl": "./",
    "paths": {
      "@/*": ["src/*"],
      "@modules/*": ["src/modules/*"],
      "@common/*": ["src/common/*"],
      "@entities/*": ["src/entities/*"],
      "@utils/*": ["src/utils/*"]
    }
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist", "test"]
}
\`\`\`

---

## SRC - MAIN FILES

### 1. `src/main.ts`

\`\`\`typescript
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ValidationPipe } from '@nestjs/common';
import helmet from '@fastify/helmet';
import cors from '@fastify/cors';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  // Security
  await app.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
      },
    },
  });

  // CORS
  await app.register(cors, {
    origin: process.env.CORS_ORIGIN?.split(',') || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  });

  // Global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global error filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // Global interceptor for logging
  app.useGlobalInterceptors(new LoggingInterceptor());

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');

  console.log(\`✅ Application listening on http://localhost:\${port}\`);
}

bootstrap().catch((err) => {
  console.error('❌ Failed to start application:', err);
  process.exit(1);
});
\`\`\`

---

### 2. `src/app.module.ts`

\`\`\`typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { BullModule } from '@nestjs/bull';
import { CacheModule } from '@nestjs/cache-manager';
import { getDataSource } from './data-source';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { BankingModule } from './modules/banking/banking.module';
import { KycModule } from './modules/kyc/kyc.module';
import { BookingsModule } from './modules/bookings/bookings.module';
import { ChatModule } from './modules/chat/chat.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { WorkerModule } from './modules/worker/worker.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot(getDataSource().options),
    BullModule.forRoot({
      redis: {
        url: process.env.REDIS_URL || 'redis://localhost:6379',
      },
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: 300000,
    }),
    EventEmitterModule.forRoot(),
    AuthModule,
    UsersModule,
    BankingModule,
    KycModule,
    BookingsModule,
    ChatModule,
    PaymentsModule,
    NotificationsModule,
    WorkerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
\`\`\`

---

### 3. `src/app.controller.ts`

\`\`\`typescript
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  health() {
    return { status: 'ok', timestamp: new Date() };
  }
}
\`\`\`

---

### 4. `src/app.service.ts`

\`\`\`typescript
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Welcome to Residenz API 🏠';
  }
}
\`\`\`

---

### 5. `src/data-source.ts`

\`\`\`typescript
import { DataSource, DataSourceOptions } from 'typeorm';
import * as path from 'path';
import 'dotenv/config';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_DATABASE || 'residenz_db',
  entities: [path.join(__dirname, 'entities', '*.entity.{ts,js}')],
  migrations: [path.join(__dirname, 'migrations', '*.{ts,js}')],
  subscribers: [],
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
};

export const getDataSource = () => {
  return new DataSource(dataSourceOptions);
};

export default getDataSource();
\`\`\`

---

## SRC/COMMON

### 1. `src/common/decorators/roles.decorator.ts`

\`\`\`typescript
import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@entities/user.entity';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
\`\`\`

---

### 2. `src/common/decorators/current-user.decorator.ts`

\`\`\`typescript
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    return data ? user?.[data] : user;
  },
);
\`\`\`

---

### 3. `src/common/guards/jwt-auth.guard.ts`

\`\`\`typescript
import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      throw new UnauthorizedException(info?.message || 'Invalid token');
    }
    return user;
  }
}
\`\`\`

---

### 4. `src/common/guards/roles.guard.ts`

\`\`\`typescript
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { UserRole } from '@entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user) {
      throw new ForbiddenException('User not found');
    }

    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException(
        \`User role \${user.role} is not authorized to access this resource\`,
      );
    }

    return true;
  }
}
\`\`\`

---

### 5. `src/common/filters/http-exception.filter.ts`

\`\`\`typescript
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('HttpExceptionFilter');

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let details: any = null;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      message = (exceptionResponse as any).message || exception.message;
      details = (exceptionResponse as any).error;
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    this.logger.error(\`[\${request.method}] \${request.url} - \${status} - \${message}\`);

    response.status(status).send({
      statusCode: status,
      message,
      error: details,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
\`\`\`

---

### 6. `src/common/interceptors/logging.interceptor.ts`

\`\`\`typescript
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, user } = request;
    const startTime = Date.now();

    return next.handle().pipe(
      tap((data) => {
        const duration = Date.now() - startTime;
        const userId = user?.id || 'anonymous';
        this.logger.log(
          \`[\${method}] \${url} - User: \${userId} - \${duration}ms\`,
        );
      }),
    );
  }
}
\`\`\`

---

## SRC/ENTITIES

### 1. `src/entities/user.entity.ts`

\`\`\`typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { BankAccount } from './bank-account.entity';
import { Account } from './account.entity';
import { Booking } from './booking.entity';
import { KycVerification } from './kyc-verification.entity';

export enum UserRole {
  CLIENT = 'CLIENT',
  RESI = 'RESI',
  ADMIN = 'ADMIN',
}

export enum KycStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 20, unique: true })
  phone: string;

  @Column('varchar', { length: 255, nullable: true })
  email: string;

  @Column('varchar', { length: 100 })
  firstName: string;

  @Column('varchar', { length: 100 })
  lastName: string;

  @Column('enum', { enum: UserRole, default: UserRole.CLIENT })
  role: UserRole;

  @Column('enum', { enum: KycStatus, default: KycStatus.PENDING })
  kycStatus: KycStatus;

  @Column('varchar', { length: 255, select: false })
  passwordHash: string;

  @Column('varchar', { length: 255, nullable: true, select: false })
  refreshTokenHash: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => BankAccount, (ba) => ba.user)
  bankAccounts: BankAccount[];

  @OneToMany(() => Account, (acc) => acc.user)
  accounts: Account[];

  @OneToMany(() => Booking, (booking) => booking.client)
  clientBookings: Booking[];

  @OneToMany(() => Booking, (booking) => booking.resi)
  resiBookings: Booking[];

  @OneToMany(() => KycVerification, (kyc) => kyc.user)
  kycVerifications: KycVerification[];
}
\`\`\`

---

### 2. `src/entities/account.entity.ts`

\`\`\`typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { LedgerEntry } from './ledger-entry.entity';

export enum AccountType {
  WALLET = 'WALLET',
  ESCROW = 'ESCROW',
  RESERVE = 'RESERVE',
}

@Entity('accounts')
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @Column('enum', { enum: AccountType, default: AccountType.WALLET })
  accountType: AccountType;

  @Column('decimal', { precision: 18, scale: 2, default: 0 })
  balance: number;

  @Column('decimal', { precision: 18, scale: 2, default: 0 })
  balanceBlocked: number;

  @Column('varchar', { length: 3, default: 'PEN' })
  currency: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.accounts)
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => LedgerEntry, (entry) => entry.account)
  ledgerEntries: LedgerEntry[];
}
\`\`\`

---

### 3. `src/entities/bank-account.entity.ts`

\`\`\`typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

export enum BankAccountType {
  CORRIENTE = 'CORRIENTE',
  AHORRO = 'AHORRO',
}

@Entity('bank_accounts')
export class BankAccount {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @Column('varchar', { length: 20 })
  bankCode: string;

  @Column('text')
  accountNumber: string;

  @Column('varchar', { length: 255 })
  accountHolderName: string;

  @Column('enum', { enum: BankAccountType, default: BankAccountType.CORRIENTE })
  accountType: BankAccountType;

  @Column('boolean', { default: false })
  isVerified: boolean;

  @Column('varchar', { length: 100, nullable: true })
  prometeoVerificationId: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column('timestamp', { nullable: true })
  verifiedAt: Date;

  @ManyToOne(() => User, (user) => user.bankAccounts)
  @JoinColumn({ name: 'userId' })
  user: User;
}
\`\`\`

---

### 4. `src/entities/transaction.entity.ts`

\`\`\`typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { LedgerEntry } from './ledger-entry.entity';

export enum TransactionType {
  BOOKING_PAYOUT = 'BOOKING_PAYOUT',
  DEPOSIT = 'DEPOSIT',
  WITHDRAWAL = 'WITHDRAWAL',
  REFUND = 'REFUND',
  INTERNAL_TRANSFER = 'INTERNAL_TRANSFER',
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  SETTLED = 'SETTLED',
  FAILED = 'FAILED',
}

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  sourceAccountId: string;

  @Column('uuid')
  destAccountId: string;

  @Column('decimal', { precision: 18, scale: 2 })
  amount: number;

  @Column('enum', { enum: TransactionType })
  type: TransactionType;

  @Column('enum', { enum: TransactionStatus, default: TransactionStatus.PENDING })
  status: TransactionStatus;

  @Column('varchar', { length: 500, nullable: true })
  reference: string;

  @Column('jsonb', { nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @Column('timestamp', { nullable: true })
  settledAt: Date;

  @OneToMany(() => LedgerEntry, (entry) => entry.transaction)
  ledgerEntries: LedgerEntry[];
}
\`\`\`

---

### 5. `src/entities/ledger-entry.entity.ts`

\`\`\`typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Transaction } from './transaction.entity';
import { Account } from './account.entity';

export enum LedgerEntryType {
  DEBIT = 'DEBIT',
  CREDIT = 'CREDIT',
}

@Entity('ledger_entries')
export class LedgerEntry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  transactionId: string;

  @Column('uuid')
  accountId: string;

  @Column('enum', { enum: LedgerEntryType })
  entryType: LedgerEntryType;

  @Column('decimal', { precision: 18, scale: 2 })
  amount: number;

  @Column('varchar', { length: 500, nullable: true })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Transaction, (txn) => txn.ledgerEntries)
  @JoinColumn({ name: 'transactionId' })
  transaction: Transaction;

  @ManyToOne(() => Account, (acc) => acc.ledgerEntries)
  @JoinColumn({ name: 'accountId' })
  account: Account;
}
\`\`\`

---

### 6. `src/entities/booking.entity.ts`

\`\`\`typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum BookingFrequency {
  WEEKLY = 'WEEKLY',
  BIWEEKLY = 'BIWEEKLY',
  MONTHLY = 'MONTHLY',
}

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  clientId: string;

  @Column('uuid', { nullable: true })
  resiId: string;

  @Column('uuid')
  addressId: string;

  @Column('enum', { enum: BookingStatus, default: BookingStatus.PENDING })
  status: BookingStatus;

  @Column('enum', { enum: BookingFrequency, default: BookingFrequency.WEEKLY })
  frequency: BookingFrequency;

  @Column('decimal', { precision: 10, scale: 2 })
  agreedPayout: number;

  @Column('timestamp')
  scheduledAt: Date;

  @Column('timestamp', { nullable: true })
  checkInAt: Date;

  @Column('timestamp', { nullable: true })
  checkOutAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.clientBookings)
  @JoinColumn({ name: 'clientId' })
  client: User;

  @ManyToOne(() => User, (user) => user.resiBookings)
  @JoinColumn({ name: 'resiId' })
  resi: User;
}
\`\`\`

---

### 7. `src/entities/kyc-verification.entity.ts`

\`\`\`typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { KycStatus } from './user.entity';

@Entity('kyc_verifications')
export class KycVerification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @Column('enum', { enum: KycStatus, default: KycStatus.PENDING })
  status: KycStatus;

  @Column('varchar', { length: 100, nullable: true })
  metamapSessionId: string;

  @Column('jsonb', { nullable: true })
  metamapResult: Record<string, any>;

  @Column('text', { nullable: true })
  rejectionReason: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column('timestamp', { nullable: true })
  verifiedAt: Date;

  @ManyToOne(() => User, (user) => user.kycVerifications)
  @JoinColumn({ name: 'userId' })
  user: User;
}
\`\`\`

---

### 8. `src/entities/chat-conversation.entity.ts`

\`\`\`typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { ChatMessage } from './chat-message.entity';

export enum ChatStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
}

@Entity('chat_conversations')
export class ChatConversation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  clientId: string;

  @Column('uuid', { nullable: true })
  resiId: string;

  @Column('uuid', { nullable: true })
  supportAdminId: string;

  @Column('varchar', { length: 255 })
  subject: string;

  @Column('enum', { enum: ChatStatus, default: ChatStatus.OPEN })
  status: ChatStatus;

  @CreateDateColumn()
  createdAt: Date;

  @Column('timestamp', { nullable: true })
  closedAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'clientId' })
  client: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'resiId' })
  resi: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'supportAdminId' })
  supportAdmin: User;

  @OneToMany(() => ChatMessage, (msg) => msg.conversation)
  messages: ChatMessage[];
}
\`\`\`

---

### 9. `src/entities/chat-message.entity.ts`

\`\`\`typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { ChatConversation } from './chat-conversation.entity';
import { User } from './user.entity';

@Entity('chat_messages')
export class ChatMessage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  conversationId: string;

  @Column('uuid')
  senderId: string;

  @Column('text')
  content: string;

  @Column('boolean', { default: false })
  isRead: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => ChatConversation, (conv) => conv.messages)
  @JoinColumn({ name: 'conversationId' })
  conversation: ChatConversation;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'senderId' })
  sender: User;
}
\`\`\`

---

## SRC/MODULES/AUTH

### 1. `src/modules/auth/auth.module.ts`

\`\`\`typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { OtpService } from './otp.service';
import { User } from '@entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRATION') || '15m',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, OtpService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
\`\`\`

---

### 2. `src/modules/auth/auth.service.ts`

\`\`\`typescript
import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '@entities/user.entity';
import { OtpService } from './otp.service';
import { RegisterDto } from './dtos/register.dto';
import { VerifyOtpDto } from './dtos/verify-otp.dto';
import { LoginDto } from './dtos/login.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger('AuthService');

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
    private otpService: OtpService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { phone, firstName, lastName, role, password } = registerDto;

    // Check if user exists
    const existingUser = await this.usersRepository.findOne({
      where: { phone },
    });

    if (existingUser) {
      throw new ConflictException('User with this phone already exists');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user
    const user = this.usersRepository.create({
      phone,
      firstName,
      lastName,
      role: role || UserRole.CLIENT,
      passwordHash,
    });

    const savedUser = await this.usersRepository.save(user);

    // Generate and send OTP
    await this.otpService.generateAndSendOtp(phone);

    this.logger.log(\`User registered: \${phone} with role \${role}\`);

    return {
      message: 'User registered. Check your SMS for OTP.',
      userId: savedUser.id,
    };
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto) {
    const { phone, otp } = verifyOtpDto;

    // Verify OTP
    const isValid = await this.otpService.verifyOtp(phone, otp);
    if (!isValid) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    const user = await this.usersRepository.findOne({ where: { phone } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Generate tokens
    const tokens = this.generateTokens(user);

    this.logger.log(\`OTP verified for: \${phone}\`);

    return tokens;
  }

  async login(loginDto: LoginDto) {
    const { phone, password } = loginDto;

    const user = await this.usersRepository.findOne({
      where: { phone },
      select: ['id', 'phone', 'passwordHash', 'role', 'firstName', 'lastName'],
    });

    if (!user) {
      throw new UnauthorizedException('Invalid phone or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid phone or password');
    }

    const tokens = this.generateTokens(user);

    this.logger.log(\`User logged in: \${phone}\`);

    return tokens;
  }

  async refreshToken(userId: string, refreshToken: string) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      select: ['id', 'phone', 'role', 'firstName', 'lastName', 'refreshTokenHash'],
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (!user.refreshTokenHash) {
      throw new UnauthorizedException('No refresh token found');
    }

    const isValid = await bcrypt.compare(refreshToken, user.refreshTokenHash);
    if (!isValid) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const tokens = this.generateTokens(user);

    this.logger.log(\`Token refreshed for: \${user.phone}\`);

    return tokens;
  }

  private generateTokens(user: User) {
    const payload = {
      sub: user.id,
      phone: user.phone,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}
\`\`\`

---

### 3. `src/modules/auth/auth.controller.ts`

\`\`\`typescript
import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dtos/register.dto';
import { VerifyOtpDto } from './dtos/verify-otp.dto';
import { LoginDto } from './dtos/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @HttpCode(201)
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('verify-otp')
  @HttpCode(200)
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.authService.verifyOtp(verifyOtpDto);
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('refresh')
  @HttpCode(200)
  async refresh(@Body() { userId, refreshToken }: { userId: string; refreshToken: string }) {
    return this.authService.refreshToken(userId, refreshToken);
  }
}
\`\`\`

---

### 4. `src/modules/auth/otp.service.ts`

\`\`\`typescript
import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as twilio from 'twilio';

interface OtpStore {
  [phone: string]: {
    code: string;
    expiresAt: number;
    attempts: number;
  };
}

@Injectable()
export class OtpService {
  private readonly logger = new Logger('OtpService');
  private readonly otpStore: OtpStore = {}; // In production, use Redis
  private twilioClient: twilio.Twilio;

  constructor(private configService: ConfigService) {
    const accountSid = this.configService.get<string>('TWILIO_ACCOUNT_SID');
    const authToken = this.configService.get<string>('TWILIO_AUTH_TOKEN');

    if (accountSid && authToken) {
      this.twilioClient = twilio(accountSid, authToken);
    }
  }

  async generateAndSendOtp(phone: string): Promise<void> {
    // Generate 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    this.otpStore[phone] = {
      code,
      expiresAt,
      attempts: 0,
    };

    // Send via Twilio
    if (this.twilioClient) {
      try {
        await this.twilioClient.messages.create({
          body: \`Your Residenz verification code is: \${code}\`,
          from: this.configService.get<string>('TWILIO_PHONE_NUMBER'),
          to: phone,
        });
        this.logger.log(\`OTP sent to: \${phone}\`);
      } catch (error) {
        this.logger.error(\`Failed to send OTP: \${error.message}\`);
      }
    } else {
      // Development mode
      this.logger.log(\`[DEV] OTP for \${phone}: \${code}\`);
    }
  }

  async verifyOtp(phone: string, code: string): Promise<boolean> {
    const otp = this.otpStore[phone];

    if (!otp) {
      throw new BadRequestException('OTP not found. Please request a new one.');
    }

    if (otp.expiresAt < Date.now()) {
      delete this.otpStore[phone];
      throw new BadRequestException('OTP expired');
    }

    if (otp.attempts >= 5) {
      delete this.otpStore[phone];
      throw new BadRequestException('Too many attempts. Request a new OTP.');
    }

    otp.attempts++;

    if (otp.code !== code) {
      return false;
    }

    delete this.otpStore[phone];
    return true;
  }
}
\`\`\`

---

### 5. `src/modules/auth/strategies/jwt.strategy.ts`

\`\`\`typescript
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    const user = await this.usersRepository.findOne({
      where: { id: payload.sub },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      id: user.id,
      phone: user.phone,
      role: user.role,
      kycStatus: user.kycStatus,
    };
  }
}
\`\`\`

---

### 6. `src/modules/auth/dtos/register.dto.ts`

\`\`\`typescript
import { IsString, IsEnum, Matches, MinLength, MaxLength, IsOptional } from 'class-validator';
import { UserRole } from '@entities/user.entity';

export class RegisterDto {
  @IsString()
  @Matches(/^\\+?51\\d{9}$/, {
    message: 'Phone must be a valid Peruvian number (+51XXXXXXXXX)',
  })
  phone: string;

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  firstName: string;

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  lastName: string;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$/, {
    message: 'Password must contain uppercase, lowercase, number, and special character',
  })
  password: string;
}
\`\`\`

---

### 7. `src/modules/auth/dtos/verify-otp.dto.ts`

\`\`\`typescript
import { IsString, Matches, Length } from 'class-validator';

export class VerifyOtpDto {
  @IsString()
  @Matches(/^\\+?51\\d{9}$/)
  phone: string;

  @IsString()
  @Length(6, 6)
  otp: string;
}
\`\`\`

---

### 8. `src/modules/auth/dtos/login.dto.ts`

\`\`\`typescript
import { IsString, Matches, MinLength } from 'class-validator';

export class LoginDto {
  @IsString()
  @Matches(/^\\+?51\\d{9}$/)
  phone: string;

  @IsString()
  @MinLength(8)
  password: string;
}
\`\`\`

---

## SRC/MODULES/USERS

### 1. `src/modules/users/users.module.ts`

\`\`\`typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from '@entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
\`\`\`

---

### 2. `src/modules/users/users.service.ts`

\`\`\`typescript
import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@entities/user.entity';

@Injectable()
export class UsersService {
  private readonly logger = new Logger('UsersService');

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(\`User \${id} not found\`);
    }

    return user;
  }

  async findByPhone(phone: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { phone },
    });
  }

  async getProfile(userId: string) {
    return this.findOne(userId);
  }

  async updateProfile(userId: string, updates: Partial<User>) {
    await this.usersRepository.update(userId, updates);
    return this.findOne(userId);
  }
}
\`\`\`

---

### 3. `src/modules/users/users.controller.ts`

\`\`\`typescript
import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { CurrentUser } from '@common/decorators/current-user.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('profile')
  async getProfile(@CurrentUser('id') userId: string) {
    return this.usersService.getProfile(userId);
  }

  @Patch('profile')
  async updateProfile(
    @CurrentUser('id') userId: string,
    @Body() updates: { firstName?: string; lastName?: string; email?: string },
  ) {
    return this.usersService.updateProfile(userId, updates);
  }
}
\`\`\`

---

## SRC/MODULES/BANKING

Continuaré en la siguiente sección...

¿Quieres que continúe con toda la estructura de BANKING, KYC, BOOKINGS, CHAT, PAYMENTS, NOTIFICATIONS y WORKERS? 

Dado el tamaño total (probablemente 100+ KB), ¿prefieres que:

1. **Continúe en este mismo documento** (será muy largo)
2. **Lo separe en múltiples markdown files** (uno por carpeta)
3. **Lo genere como un ZIP descargable** (en la próxima iteración)
4. **Continuar por partes pequeñas** (módulo por módulo)

¿Cuál opción prefieres? 🚀# 🏗️ RESIDENZ BACKEND SETUP - NestJS + Fastify + TypeORM + BullMQ

## Documento Ejecutable - Copia/Pega Paso a Paso

**Última actualización:** Diciembre 1, 2025  
**Status:** Listo para MVP  
**Tiempo estimado:** 30-45 minutos para copiar/pegar todo

---

## 📋 ÍNDICE DE CARPETAS

1. [ROOT FILES](#root-files)
2. [SRC - MAIN FILES](#src---main-files)
3. [SRC/COMMON](#srccommon)
4. [SRC/ENTITIES](#srcentities)
5. [SRC/MODULES/AUTH](#srcmodulesauth)
6. [SRC/MODULES/USERS](#srcmodulesusers)
7. [SRC/MODULES/BANKING](#srcmodulesbanking)
8. [SRC/MODULES/KYC](#srcmoduleskyc)
9. [SRC/MODULES/BOOKINGS](#srcmodulesbookings)
10. [SRC/MODULES/CHAT](#srcmoduleschat)
11. [SRC/MODULES/PAYMENTS](#srcmodulespayments)
12. [SRC/MODULES/NOTIFICATIONS](#srcmodulesnotifications)
13. [SRC/MODULES/WORKER](#srcmodulesworker)
14. [SRC/INTEGRATIONS](#srcintegrations)
15. [SRC/UTILS](#srcutils)
16. [TEST FILES](#test-files)
17. [MIGRATIONS](#migrations)

---

## ROOT FILES

### 1. `.env.example`

\`\`\`bash
# Database (Supabase PostgreSQL)
DATABASE_URL=postgresql://postgres:password@localhost:5432/residenz_db
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_DATABASE=residenz_db

# PGP Encryption (pgcrypto extension)
PGP_SYM_KEY=your-32-char-hex-key-here

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production
JWT_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d

# Redis
REDIS_URL=redis://localhost:6379
REDIS_HOST=localhost
REDIS_PORT=6379

# Stripe
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_test_xxx

# Prometeo (Account Validation)
PROMETEO_API_KEY=your_prometeo_sandbox_key
PROMETEO_API_URL=https://api.sandbox.prometeo.io
PROMETEO_ENVIRONMENT=sandbox

# MetaMap (KYC)
METAMAP_API_KEY=your_metamap_api_key
METAMAP_API_SECRET=your_metamap_api_secret
METAMAP_ENV=sandbox

# Twilio (SMS/OTP)
TWILIO_ACCOUNT_SID=ACxxx
TWILIO_AUTH_TOKEN=xxx
TWILIO_PHONE_NUMBER=+1234567890

# App Config
NODE_ENV=development
PORT=3000
WEBSOCKET_PORT=3001
API_URL=http://localhost:3000
FRONTEND_URL=http://localhost:5173
CORS_ORIGIN=http://localhost:5173,http://localhost:3000

# Logging
LOG_LEVEL=debug

# Rate Limiting
RATE_LIMIT_GLOBAL=100
RATE_LIMIT_OTP_ATTEMPTS=5
\`\`\`

---

### 2. `docker-compose.yml`

\`\`\`yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: residenz-postgres
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_DB: residenz_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - residenz-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    container_name: residenz-redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    networks:
      - residenz-network
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  api:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: residenz-api
    ports:
      - "3000:3000"
      - "3001:3001"
    environment:
      - DATABASE_URL=postgresql://postgres:password@postgres:5432/residenz_db
      - REDIS_URL=redis://redis:6379
      - NODE_ENV=development
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    volumes:
      - .:/app
      - /app/node_modules
    networks:
      - residenz-network
    command: npm run start:dev

networks:
  residenz-network:
    driver: bridge

volumes:
  postgres_data:
  redis_data:
\`\`\`

---

### 3. `Dockerfile`

\`\`\`dockerfile
# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/dist ./dist

EXPOSE 3000 3001

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \\
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

CMD ["node", "dist/main.js"]
\`\`\`

---

### 4. `package.json`

\`\`\`json
{
  "name": "residenz-api",
  "version": "1.0.0",
  "description": "Residenz neobanco/marketplace backend",
  "author": "Residenz Team",
  "private": true,
  "license": "MIT",
  "scripts": {
    "prebuild": "rimraf dist",
    "build": "nest build",
    "format": "prettier --write \\"src/**/*.ts\\" \\"test/**/*.ts\\"",
    "start": "nest start",
    "start:dev": "nest start --watch",
    "start:debug": "nest start --debug --watch",
    "start:prod": "node dist/main",
    "lint": "eslint \\"{src,apps,libs,test}/**/*.ts\\" --fix",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage",
    "test:debug": "node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand",
    "test:e2e": "jest --config ./test/jest-e2e.json",
    "typeorm": "typeorm",
    "migration:generate": "typeorm migration:generate",
    "migration:create": "typeorm migration:create",
    "migration:run": "typeorm migration:run",
    "migration:revert": "typeorm migration:revert",
    "seed": "ts-node src/seeds/seed.ts"
  },
  "dependencies": {
    "@nestjs/cache-manager": "^2.1.1",
    "@nestjs/common": "^10.3.3",
    "@nestjs/config": "^3.2.0",
    "@nestjs/core": "^10.3.3",
    "@nestjs/event-emitter": "^2.0.4",
    "@nestjs/jwt": "^12.0.1",
    "@nestjs/passport": "^10.0.3",
    "@nestjs/platform-fastify": "^10.3.3",
    "@nestjs/swagger": "^7.1.17",
    "@nestjs/typeorm": "^9.0.1",
    "@nestjs/websockets": "^10.3.3",
    "bcrypt": "^5.1.1",
    "bull": "^4.13.0",
    "cache-manager": "^5.5.0",
    "class-transformer": "^0.5.1",
    "class-validator": "^0.14.1",
    "fastify": "^4.27.0",
    "pg": "^8.12.0",
    "redis": "^4.7.0",
    "stripe": "^14.28.0",
    "twilio": "^4.21.0",
    "typeorm": "^0.3.19"
  },
  "devDependencies": {
    "@nestjs/cli": "^10.3.2",
    "@nestjs/schematics": "^10.0.3",
    "@nestjs/testing": "^10.3.3",
    "@types/bcrypt": "^5.0.2",
    "@types/jest": "^29.5.11",
    "@types/node": "^20.10.6",
    "@typescript-eslint/eslint-plugin": "^6.17.0",
    "@typescript-eslint/parser": "^6.17.0",
    "eslint": "^8.56.0",
    "eslint-config-prettier": "^9.1.0",
    "eslint-plugin-prettier": "^5.1.2",
    "jest": "^29.7.0",
    "prettier": "^3.1.1",
    "rimraf": "^5.0.5",
    "supertest": "^6.3.3",
    "ts-jest": "^29.1.1",
    "ts-loader": "^9.5.1",
    "ts-node": "^10.9.2",
    "tsconfig-paths": "^4.2.0",
    "typescript": "^5.3.3"
  }
}
\`\`\`

---

### 5. `tsconfig.json`

\`\`\`json
{
  "compilerOptions": {
    "module": "commonjs",
    "target": "ES2021",
    "lib": ["ES2021"],
    "declaration": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "allowSyntheticDefaultImports": true,
    "moduleResolution": "node",
    "baseUrl": "./",
    "paths": {
      "@/*": ["src/*"],
      "@modules/*": ["src/modules/*"],
      "@common/*": ["src/common/*"],
      "@entities/*": ["src/entities/*"],
      "@utils/*": ["src/utils/*"]
    }
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist", "test"]
}
\`\`\`

---

## SRC - MAIN FILES

### 1. `src/main.ts`

\`\`\`typescript
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ValidationPipe } from '@nestjs/common';
import helmet from '@fastify/helmet';
import cors from '@fastify/cors';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  // Security
  await app.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
      },
    },
  });

  // CORS
  await app.register(cors, {
    origin: process.env.CORS_ORIGIN?.split(',') || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  });

  // Global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global error filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // Global interceptor for logging
  app.useGlobalInterceptors(new LoggingInterceptor());

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');

  console.log(\`✅ Application listening on http://localhost:\${port}\`);
}

bootstrap().catch((err) => {
  console.error('❌ Failed to start application:', err);
  process.exit(1);
});
\`\`\`

---

### 2. `src/app.module.ts`

\`\`\`typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { BullModule } from '@nestjs/bull';
import { CacheModule } from '@nestjs/cache-manager';
import { getDataSource } from './data-source';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { BankingModule } from './modules/banking/banking.module';
import { KycModule } from './modules/kyc/kyc.module';
import { BookingsModule } from './modules/bookings/bookings.module';
import { ChatModule } from './modules/chat/chat.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { WorkerModule } from './modules/worker/worker.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot(getDataSource().options),
    BullModule.forRoot({
      redis: {
        url: process.env.REDIS_URL || 'redis://localhost:6379',
      },
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: 300000,
    }),
    EventEmitterModule.forRoot(),
    AuthModule,
    UsersModule,
    BankingModule,
    KycModule,
    BookingsModule,
    ChatModule,
    PaymentsModule,
    NotificationsModule,
    WorkerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
\`\`\`

---

### 3. `src/app.controller.ts`

\`\`\`typescript
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  health() {
    return { status: 'ok', timestamp: new Date() };
  }
}
\`\`\`

---

### 4. `src/app.service.ts`

\`\`\`typescript
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Welcome to Residenz API 🏠';
  }
}
\`\`\`

---

### 5. `src/data-source.ts`

\`\`\`typescript
import { DataSource, DataSourceOptions } from 'typeorm';
import * as path from 'path';
import 'dotenv/config';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_DATABASE || 'residenz_db',
  entities: [path.join(__dirname, 'entities', '*.entity.{ts,js}')],
  migrations: [path.join(__dirname, 'migrations', '*.{ts,js}')],
  subscribers: [],
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
};

export const getDataSource = () => {
  return new DataSource(dataSourceOptions);
};

export default getDataSource();
\`\`\`

---

## SRC/COMMON

### 1. `src/common/decorators/roles.decorator.ts`

\`\`\`typescript
import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@entities/user.entity';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
\`\`\`

---

### 2. `src/common/decorators/current-user.decorator.ts`

\`\`\`typescript
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    return data ? user?.[data] : user;
  },
);
\`\`\`

---

### 3. `src/common/guards/jwt-auth.guard.ts`

\`\`\`typescript
import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      throw new UnauthorizedException(info?.message || 'Invalid token');
    }
    return user;
  }
}
\`\`\`

---

### 4. `src/common/guards/roles.guard.ts`

\`\`\`typescript
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { UserRole } from '@entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user) {
      throw new ForbiddenException('User not found');
    }

    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException(
        \`User role \${user.role} is not authorized to access this resource\`,
      );
    }

    return true;
  }
}
\`\`\`

---

### 5. `src/common/filters/http-exception.filter.ts`

\`\`\`typescript
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('HttpExceptionFilter');

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let details: any = null;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      message = (exceptionResponse as any).message || exception.message;
      details = (exceptionResponse as any).error;
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    this.logger.error(\`[\${request.method}] \${request.url} - \${status} - \${message}\`);

    response.status(status).send({
      statusCode: status,
      message,
      error: details,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
\`\`\`

---

### 6. `src/common/interceptors/logging.interceptor.ts`

\`\`\`typescript
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, user } = request;
    const startTime = Date.now();

    return next.handle().pipe(
      tap((data) => {
        const duration = Date.now() - startTime;
        const userId = user?.id || 'anonymous';
        this.logger.log(
          \`[\${method}] \${url} - User: \${userId} - \${duration}ms\`,
        );
      }),
    );
  }
}
\`\`\`

---

## SRC/ENTITIES

### 1. `src/entities/user.entity.ts`

\`\`\`typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { BankAccount } from './bank-account.entity';
import { Account } from './account.entity';
import { Booking } from './booking.entity';
import { KycVerification } from './kyc-verification.entity';

export enum UserRole {
  CLIENT = 'CLIENT',
  RESI = 'RESI',
  ADMIN = 'ADMIN',
}

export enum KycStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 20, unique: true })
  phone: string;

  @Column('varchar', { length: 255, nullable: true })
  email: string;

  @Column('varchar', { length: 100 })
  firstName: string;

  @Column('varchar', { length: 100 })
  lastName: string;

  @Column('enum', { enum: UserRole, default: UserRole.CLIENT })
  role: UserRole;

  @Column('enum', { enum: KycStatus, default: KycStatus.PENDING })
  kycStatus: KycStatus;

  @Column('varchar', { length: 255, select: false })
  passwordHash: string;

  @Column('varchar', { length: 255, nullable: true, select: false })
  refreshTokenHash: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => BankAccount, (ba) => ba.user)
  bankAccounts: BankAccount[];

  @OneToMany(() => Account, (acc) => acc.user)
  accounts: Account[];

  @OneToMany(() => Booking, (booking) => booking.client)
  clientBookings: Booking[];

  @OneToMany(() => Booking, (booking) => booking.resi)
  resiBookings: Booking[];

  @OneToMany(() => KycVerification, (kyc) => kyc.user)
  kycVerifications: KycVerification[];
}
\`\`\`

---

### 2. `src/entities/account.entity.ts`

\`\`\`typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { LedgerEntry } from './ledger-entry.entity';

export enum AccountType {
  WALLET = 'WALLET',
  ESCROW = 'ESCROW',
  RESERVE = 'RESERVE',
}

@Entity('accounts')
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @Column('enum', { enum: AccountType, default: AccountType.WALLET })
  accountType: AccountType;

  @Column('decimal', { precision: 18, scale: 2, default: 0 })
  balance: number;

  @Column('decimal', { precision: 18, scale: 2, default: 0 })
  balanceBlocked: number;

  @Column('varchar', { length: 3, default: 'PEN' })
  currency: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.accounts)
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => LedgerEntry, (entry) => entry.account)
  ledgerEntries: LedgerEntry[];
}
\`\`\`

---

### 3. `src/entities/bank-account.entity.ts`

\`\`\`typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

export enum BankAccountType {
  CORRIENTE = 'CORRIENTE',
  AHORRO = 'AHORRO',
}

@Entity('bank_accounts')
export class BankAccount {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @Column('varchar', { length: 20 })
  bankCode: string;

  @Column('text')
  accountNumber: string;

  @Column('varchar', { length: 255 })
  accountHolderName: string;

  @Column('enum', { enum: BankAccountType, default: BankAccountType.CORRIENTE })
  accountType: BankAccountType;

  @Column('boolean', { default: false })
  isVerified: boolean;

  @Column('varchar', { length: 100, nullable: true })
  prometeoVerificationId: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column('timestamp', { nullable: true })
  verifiedAt: Date;

  @ManyToOne(() => User, (user) => user.bankAccounts)
  @JoinColumn({ name: 'userId' })
  user: User;
}
\`\`\`

---

### 4. `src/entities/transaction.entity.ts`

\`\`\`typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { LedgerEntry } from './ledger-entry.entity';

export enum TransactionType {
  BOOKING_PAYOUT = 'BOOKING_PAYOUT',
  DEPOSIT = 'DEPOSIT',
  WITHDRAWAL = 'WITHDRAWAL',
  REFUND = 'REFUND',
  INTERNAL_TRANSFER = 'INTERNAL_TRANSFER',
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  SETTLED = 'SETTLED',
  FAILED = 'FAILED',
}

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  sourceAccountId: string;

  @Column('uuid')
  destAccountId: string;

  @Column('decimal', { precision: 18, scale: 2 })
  amount: number;

  @Column('enum', { enum: TransactionType })
  type: TransactionType;

  @Column('enum', { enum: TransactionStatus, default: TransactionStatus.PENDING })
  status: TransactionStatus;

  @Column('varchar', { length: 500, nullable: true })
  reference: string;

  @Column('jsonb', { nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @Column('timestamp', { nullable: true })
  settledAt: Date;

  @OneToMany(() => LedgerEntry, (entry) => entry.transaction)
  ledgerEntries: LedgerEntry[];
}
\`\`\`

---

### 5. `src/entities/ledger-entry.entity.ts`

\`\`\`typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Transaction } from './transaction.entity';
import { Account } from './account.entity';

export enum LedgerEntryType {
  DEBIT = 'DEBIT',
  CREDIT = 'CREDIT',
}

@Entity('ledger_entries')
export class LedgerEntry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  transactionId: string;

  @Column('uuid')
  accountId: string;

  @Column('enum', { enum: LedgerEntryType })
  entryType: LedgerEntryType;

  @Column('decimal', { precision: 18, scale: 2 })
  amount: number;

  @Column('varchar', { length: 500, nullable: true })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Transaction, (txn) => txn.ledgerEntries)
  @JoinColumn({ name: 'transactionId' })
  transaction: Transaction;

  @ManyToOne(() => Account, (acc) => acc.ledgerEntries)
  @JoinColumn({ name: 'accountId' })
  account: Account;
}
\`\`\`

---

### 6. `src/entities/booking.entity.ts`

\`\`\`typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum BookingFrequency {
  WEEKLY = 'WEEKLY',
  BIWEEKLY = 'BIWEEKLY',
  MONTHLY = 'MONTHLY',
}

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  clientId: string;

  @Column('uuid', { nullable: true })
  resiId: string;

  @Column('uuid')
  addressId: string;

  @Column('enum', { enum: BookingStatus, default: BookingStatus.PENDING })
  status: BookingStatus;

  @Column('enum', { enum: BookingFrequency, default: BookingFrequency.WEEKLY })
  frequency: BookingFrequency;

  @Column('decimal', { precision: 10, scale: 2 })
  agreedPayout: number;

  @Column('timestamp')
  scheduledAt: Date;

  @Column('timestamp', { nullable: true })
  checkInAt: Date;

  @Column('timestamp', { nullable: true })
  checkOutAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.clientBookings)
  @JoinColumn({ name: 'clientId' })
  client: User;

  @ManyToOne(() => User, (user) => user.resiBookings)
  @JoinColumn({ name: 'resiId' })
  resi: User;
}
\`\`\`

---

### 7. `src/entities/kyc-verification.entity.ts`

\`\`\`typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { KycStatus } from './user.entity';

@Entity('kyc_verifications')
export class KycVerification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @Column('enum', { enum: KycStatus, default: KycStatus.PENDING })
  status: KycStatus;

  @Column('varchar', { length: 100, nullable: true })
  metamapSessionId: string;

  @Column('jsonb', { nullable: true })
  metamapResult: Record<string, any>;

  @Column('text', { nullable: true })
  rejectionReason: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column('timestamp', { nullable: true })
  verifiedAt: Date;

  @ManyToOne(() => User, (user) => user.kycVerifications)
  @JoinColumn({ name: 'userId' })
  user: User;
}
\`\`\`

---

### 8. `src/entities/chat-conversation.entity.ts`

\`\`\`typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { ChatMessage } from './chat-message.entity';

export enum ChatStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
}

@Entity('chat_conversations')
export class ChatConversation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  clientId: string;

  @Column('uuid', { nullable: true })
  resiId: string;

  @Column('uuid', { nullable: true })
  supportAdminId: string;

  @Column('varchar', { length: 255 })
  subject: string;

  @Column('enum', { enum: ChatStatus, default: ChatStatus.OPEN })
  status: ChatStatus;

  @CreateDateColumn()
  createdAt: Date;

  @Column('timestamp', { nullable: true })
  closedAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'clientId' })
  client: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'resiId' })
  resi: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'supportAdminId' })
  supportAdmin: User;

  @OneToMany(() => ChatMessage, (msg) => msg.conversation)
  messages: ChatMessage[];
}
\`\`\`

---

### 9. `src/entities/chat-message.entity.ts`

\`\`\`typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { ChatConversation } from './chat-conversation.entity';
import { User } from './user.entity';

@Entity('chat_messages')
export class ChatMessage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  conversationId: string;

  @Column('uuid')
  senderId: string;

  @Column('text')
  content: string;

  @Column('boolean', { default: false })
  isRead: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => ChatConversation, (conv) => conv.messages)
  @JoinColumn({ name: 'conversationId' })
  conversation: ChatConversation;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'senderId' })
  sender: User;
}
\`\`\`

---

## SRC/MODULES/AUTH

### 1. `src/modules/auth/auth.module.ts`

\`\`\`typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { OtpService } from './otp.service';
import { User } from '@entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRATION') || '15m',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, OtpService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
\`\`\`

---

### 2. `src/modules/auth/auth.service.ts`

\`\`\`typescript
import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '@entities/user.entity';
import { OtpService } from './otp.service';
import { RegisterDto } from './dtos/register.dto';
import { VerifyOtpDto } from './dtos/verify-otp.dto';
import { LoginDto } from './dtos/login.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger('AuthService');

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
    private otpService: OtpService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { phone, firstName, lastName, role, password } = registerDto;

    // Check if user exists
    const existingUser = await this.usersRepository.findOne({
      where: { phone },
    });

    if (existingUser) {
      throw new ConflictException('User with this phone already exists');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user
    const user = this.usersRepository.create({
      phone,
      firstName,
      lastName,
      role: role || UserRole.CLIENT,
      passwordHash,
    });

    const savedUser = await this.usersRepository.save(user);

    // Generate and send OTP
    await this.otpService.generateAndSendOtp(phone);

    this.logger.log(\`User registered: \${phone} with role \${role}\`);

    return {
      message: 'User registered. Check your SMS for OTP.',
      userId: savedUser.id,
    };
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto) {
    const { phone, otp } = verifyOtpDto;

    // Verify OTP
    const isValid = await this.otpService.verifyOtp(phone, otp);
    if (!isValid) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    const user = await this.usersRepository.findOne({ where: { phone } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Generate tokens
    const tokens = this.generateTokens(user);

    this.logger.log(\`OTP verified for: \${phone}\`);

    return tokens;
  }

  async login(loginDto: LoginDto) {
    const { phone, password } = loginDto;

    const user = await this.usersRepository.findOne({
      where: { phone },
      select: ['id', 'phone', 'passwordHash', 'role', 'firstName', 'lastName'],
    });

    if (!user) {
      throw new UnauthorizedException('Invalid phone or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid phone or password');
    }

    const tokens = this.generateTokens(user);

    this.logger.log(\`User logged in: \${phone}\`);

    return tokens;
  }

  async refreshToken(userId: string, refreshToken: string) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      select: ['id', 'phone', 'role', 'firstName', 'lastName', 'refreshTokenHash'],
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (!user.refreshTokenHash) {
      throw new UnauthorizedException('No refresh token found');
    }

    const isValid = await bcrypt.compare(refreshToken, user.refreshTokenHash);
    if (!isValid) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const tokens = this.generateTokens(user);

    this.logger.log(\`Token refreshed for: \${user.phone}\`);

    return tokens;
  }

  private generateTokens(user: User) {
    const payload = {
      sub: user.id,
      phone: user.phone,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}
\`\`\`

---

### 3. `src/modules/auth/auth.controller.ts`

\`\`\`typescript
import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dtos/register.dto';
import { VerifyOtpDto } from './dtos/verify-otp.dto';
import { LoginDto } from './dtos/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @HttpCode(201)
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('verify-otp')
  @HttpCode(200)
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.authService.verifyOtp(verifyOtpDto);
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('refresh')
  @HttpCode(200)
  async refresh(@Body() { userId, refreshToken }: { userId: string; refreshToken: string }) {
    return this.authService.refreshToken(userId, refreshToken);
  }
}
\`\`\`

---

### 4. `src/modules/auth/otp.service.ts`

\`\`\`typescript
import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as twilio from 'twilio';

interface OtpStore {
  [phone: string]: {
    code: string;
    expiresAt: number;
    attempts: number;
  };
}

@Injectable()
export class OtpService {
  private readonly logger = new Logger('OtpService');
  private readonly otpStore: OtpStore = {}; // In production, use Redis
  private twilioClient: twilio.Twilio;

  constructor(private configService: ConfigService) {
    const accountSid = this.configService.get<string>('TWILIO_ACCOUNT_SID');
    const authToken = this.configService.get<string>('TWILIO_AUTH_TOKEN');

    if (accountSid && authToken) {
      this.twilioClient = twilio(accountSid, authToken);
    }
  }

  async generateAndSendOtp(phone: string): Promise<void> {
    // Generate 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    this.otpStore[phone] = {
      code,
      expiresAt,
      attempts: 0,
    };

    // Send via Twilio
    if (this.twilioClient) {
      try {
        await this.twilioClient.messages.create({
          body: \`Your Residenz verification code is: \${code}\`,
          from: this.configService.get<string>('TWILIO_PHONE_NUMBER'),
          to: phone,
        });
        this.logger.log(\`OTP sent to: \${phone}\`);
      } catch (error) {
        this.logger.error(\`Failed to send OTP: \${error.message}\`);
      }
    } else {
      // Development mode
      this.logger.log(\`[DEV] OTP for \${phone}: \${code}\`);
    }
  }

  async verifyOtp(phone: string, code: string): Promise<boolean> {
    const otp = this.otpStore[phone];

    if (!otp) {
      throw new BadRequestException('OTP not found. Please request a new one.');
    }

    if (otp.expiresAt < Date.now()) {
      delete this.otpStore[phone];
      throw new BadRequestException('OTP expired');
    }

    if (otp.attempts >= 5) {
      delete this.otpStore[phone];
      throw new BadRequestException('Too many attempts. Request a new OTP.');
    }

    otp.attempts++;

    if (otp.code !== code) {
      return false;
    }

    delete this.otpStore[phone];
    return true;
  }
}
\`\`\`

---

### 5. `src/modules/auth/strategies/jwt.strategy.ts`

\`\`\`typescript
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    const user = await this.usersRepository.findOne({
      where: { id: payload.sub },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      id: user.id,
      phone: user.phone,
      role: user.role,
      kycStatus: user.kycStatus,
    };
  }
}
\`\`\`

---

### 6. `src/modules/auth/dtos/register.dto.ts`

\`\`\`typescript
import { IsString, IsEnum, Matches, MinLength, MaxLength, IsOptional } from 'class-validator';
import { UserRole } from '@entities/user.entity';

export class RegisterDto {
  @IsString()
  @Matches(/^\\+?51\\d{9}$/, {
    message: 'Phone must be a valid Peruvian number (+51XXXXXXXXX)',
  })
  phone: string;

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  firstName: string;

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  lastName: string;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$/, {
    message: 'Password must contain uppercase, lowercase, number, and special character',
  })
  password: string;
}
\`\`\`

---

### 7. `src/modules/auth/dtos/verify-otp.dto.ts`

\`\`\`typescript
import { IsString, Matches, Length } from 'class-validator';

export class VerifyOtpDto {
  @IsString()
  @Matches(/^\\+?51\\d{9}$/)
  phone: string;

  @IsString()
  @Length(6, 6)
  otp: string;
}
\`\`\`

---

### 8. `src/modules/auth/dtos/login.dto.ts`

\`\`\`typescript
import { IsString, Matches, MinLength } from 'class-validator';

export class LoginDto {
  @IsString()
  @Matches(/^\\+?51\\d{9}$/)
  phone: string;

  @IsString()
  @MinLength(8)
  password: string;
}
\`\`\`

---

## SRC/MODULES/USERS

### 1. `src/modules/users/users.module.ts`

\`\`\`typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from '@entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
\`\`\`

---

### 2. `src/modules/users/users.service.ts`

\`\`\`typescript
import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@entities/user.entity';

@Injectable()
export class UsersService {
  private readonly logger = new Logger('UsersService');

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(\`User \${id} not found\`);
    }

    return user;
  }

  async findByPhone(phone: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { phone },
    });
  }

  async getProfile(userId: string) {
    return this.findOne(userId);
  }

  async updateProfile(userId: string, updates: Partial<User>) {
    await this.usersRepository.update(userId, updates);
    return this.findOne(userId);
  }
}
\`\`\`

---

### 3. `src/modules/users/users.controller.ts`

\`\`\`typescript
import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { CurrentUser } from '@common/decorators/current-user.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('profile')
  async getProfile(@CurrentUser('id') userId: string) {
    return this.usersService.getProfile(userId);
  }

  @Patch('profile')
  async updateProfile(
    @CurrentUser('id') userId: string,
    @Body() updates: { firstName?: string; lastName?: string; email?: string },
  ) {
    return this.usersService.updateProfile(userId, updates);
  }
}
\`\`\`

---

## SRC/MODULES/BANKING

Continuaré en la siguiente sección...

¿Quieres que continúe con toda la estructura de BANKING, KYC, BOOKINGS, CHAT, PAYMENTS, NOTIFICATIONS y WORKERS? 

Dado el tamaño total (probablemente 100+ KB), ¿prefieres que:

1. **Continúe en este mismo documento** (será muy largo)
2. **Lo separe en múltiples markdown files** (uno por carpeta)
3. **Lo genere como un ZIP descargable** (en la próxima iteración)
4. **Continuar por partes pequeñas** (módulo por módulo)

¿Cuál opción prefieres? 🚀