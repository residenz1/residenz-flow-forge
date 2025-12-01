# 🏗️ Residenz Backend

**NestJS + Fastify + PostgreSQL (Supabase) + Redis + BullMQ**

Backend para Residenz - Plataforma de servicios de limpieza con marketplace y gestión de pagos.

## 📋 Requisitos Previos

- Node.js 20+
- Docker & Docker Compose
- PostgreSQL 15+
- Redis 7+

## 🚀 Inicio Rápido

### 1. Setup

```bash
cd backend
npm install
cp .env.example .env
```

### 2. Ejecutar con Docker

```bash
npm run docker:up
npm run start:dev
```

Esto inicia:
- ✅ PostgreSQL en puerto 5432
- ✅ Redis en puerto 6379
- ✅ NestJS API en puerto 3000

### 3. Crear Base de Datos

```bash
# Migrations automáticas
npm run migration:run

# Ver estado
npm run typeorm migration:show
```

## 📁 Estructura del Proyecto

```
backend/
├── src/
│   ├── config/                    # Configuración (JWT, DB, Redis)
│   ├── common/
│   │   ├── guards/               # JWT, Roles Guards
│   │   ├── decorators/           # @Roles, @CurrentUser
│   │   ├── filters/              # Exception Filters
│   │   ├── interceptors/         # Logging, Transform
│   │   └── pipes/                # Validation
│   ├── database/
│   │   ├── entities/             # TypeORM Entities (9 total)
│   │   └── migrations/           # SQL Migrations
│   ├── modules/
│   │   ├── auth/                 # Authentication (OTP, JWT, Refresh)
│   │   ├── users/                # User Profiles
│   │   ├── banking/              # Accounts, Transactions, Ledger
│   │   ├── bookings/             # Booking Lifecycle, Matching
│   │   ├── payments/             # Stripe Integration
│   │   ├── kyc/                  # MetaMap + Prometeo
│   │   ├── chat/                 # WebSocket Chat
│   │   ├── notifications/        # SMS, Push, Email
│   │   └── workers/              # BullMQ Job Processors
│   ├── lib/                       # Utilities, Helpers
│   ├── app.module.ts             # Root Module
│   ├── app.controller.ts         # Health, Version endpoints
│   ├── app.service.ts            # App Services
│   └── main.ts                   # Bootstrap
├── test/                          # Tests
├── docker-compose.yml
├── Dockerfile
├── .env.example
├── package.json
├── tsconfig.json
├── jest.config.js
└── README.md
```

## 🔧 Comandos Útiles

### Desarrollo

```bash
# Iniciar en watch mode
npm run start:dev

# Lint y format
npm run lint
npm run format

# Tests
npm run test                    # Unit tests
npm run test:watch             # Watch mode
npm run test:cov              # Coverage report
npm run test:e2e              # E2E tests
```

### Base de Datos

```bash
# Generar migration
npm run migration:generate -- src/database/migrations/CreateUsersTable

# Ejecutar migrations
npm run migration:run

# Revertir última migration
npm run migration:revert
```

### Docker

```bash
# Iniciar servicios
npm run docker:up

# Ver logs
npm run docker:logs

# Parar servicios
npm run docker:down

# Rebuild
docker-compose up -d --build
```

### Production

```bash
# Build
npm run build

# Start
npm start

# Test coverage
npm run test:cov
```

## 🏛️ Arquitectura

### Patrones Implementados

- **Dependency Injection** - NestJS built-in
- **Repository Pattern** - Data access abstraction
- **Event-Driven** - EventEmitter2 para desacoplamiento
- **Double-Entry Ledger** - Contabilidad compliant
- **State Machine** - Booking lifecycle
- **CQRS Light** - Separación commands/queries

### Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| API | NestJS 10 + Fastify 4 |
| ORM | TypeORM 0.3 |
| DB | PostgreSQL 15 (Supabase) |
| Cache | Redis 7 |
| Jobs | BullMQ 4 |
| Auth | JWT + Passport |
| Validation | class-validator + Zod |
| Testing | Jest + Supertest |

## 🔒 Seguridad

- ✅ HTTPS/TLS en producción
- ✅ CORS configurado restrictivamente
- ✅ Helmet para headers seguros
- ✅ JWT con refresh tokens
- ✅ Rate limiting por endpoint
- ✅ Input validation con class-validator
- ✅ OTP para 2FA
- ✅ Secrets en variables de entorno
- ✅ SQL injection prevention (TypeORM)
- ✅ XSS protection (Helmet CSP)

## 📊 Entidades

### Core Entities (9)

1. **User** - Clientes, residentes, admins
2. **Account** - Wallets (wallet, escrow, reserve)
3. **BankAccount** - Cuentas bancarias para payouts
4. **Transaction** - Transacciones financieras
5. **LedgerEntry** - Double-entry accounting
6. **Booking** - Reservas de servicios
7. **KycVerification** - Verificaciones de identidad
8. **ChatConversation** - Conversaciones entre usuarios
9. **ChatMessage** - Mensajes de chat

### Relaciones

```
User
├── Accounts (Wallet, Escrow, Reserve)
├── BankAccounts (Payouts)
├── Bookings (as Client)
├── Bookings (as Resi)
├── KycVerifications
└── ChatConversations

Transaction
├── SourceAccount
├── DestinationAccount
├── Booking
└── LedgerEntries (DEBIT + CREDIT)

Booking
├── Client (User)
├── Resi (User)
└── Transactions
```

## 🔄 Flujos Principales

### 1. Crear Booking

```
Cliente crea booking
  ↓
Validar KYC cliente
  ↓
Encontrar mejor Resi (matching engine)
  ↓
Crear booking (status=PENDING)
  ↓
Notificar a Resi (WebSocket)
  ↓
Enqueue en payment-queue (Redis)
```

### 2. Pago & Payout

```
Booking completado
  ↓
Crear charge con Stripe (escrow)
  ↓
Crear ledger entries (DEBIT/CREDIT)
  ↓
Worker procesa payout
  ↓
Transferir a Resi (Stripe Connect)
  ↓
Notificar (SMS + WebSocket)
```

### 3. KYC Verification

```
Resi inicia KYC
  ↓
MetaMap: OCR + Liveness
  ↓
Prometeo: Validar cuenta bancaria
  ↓
Actualizar user.kycStatus
  ↓
Crear wallet y cuentas
  ↓
Notificar aprobación
```

## 📈 Escalabilidad

### MVP (0-1K users/día)
- Single NestJS instance
- PostgreSQL managed (Supabase)
- Redis single node
- ~$50-80/mes

### Growth (1K-10K users/día)
- 2-3 NestJS instances + Load Balancer
- PostgreSQL + Read Replicas
- Redis Cluster
- ~$300-400/mes

### Scale (10K-100K+ users/día)
- Auto-scaling groups (5-10 instances)
- Aurora PostgreSQL
- Kafka para events
- Multi-region deployment
- ~$2000-3000+/mes

## 📚 Documentación

- [ARQUITECTURA_BACKEND_RESIDENZ.md](../ARQUITECTURA_BACKEND_RESIDENZ.md) - Diseño arquitectónico
- [backend_residenz.md](../backend_residenz.md) - Especificación técnica
- [agentetool.md](../agentetool.md) - Prompts para desarrollo

## 🧪 Testing

### Coverage Targets

```
- Funciones core: 100%
- Módulos: 80%
- Infraestructura: 0%
```

### Ejecutar Tests

```bash
npm run test                    # Unit
npm run test:watch             # Watch mode
npm run test:cov              # Coverage
npm run test:e2e              # E2E
```

## 🚨 Troubleshooting

### Error: `ECONNREFUSED` en PostgreSQL

```bash
# Asegurar que Docker está corriendo
docker-compose ps

# Rebuild
docker-compose up -d --build

# Logs
docker-compose logs postgres
```

### Error: `ECONNREFUSED` en Redis

```bash
# Verificar Redis
docker-compose exec redis redis-cli ping

# Si no responde
docker-compose down
docker-compose up -d
```

### Migrations no se aplican

```bash
# Ver estado
npm run typeorm migration:show

# Sincronizar schema
npm run typeorm schema:sync

# Revertir y aplicar nuevamente
npm run migration:revert
npm run migration:run
```

## 📞 Soporte

- Documentación: Ver `/doc`
- Issues: GitHub Issues
- Slack: #residenz-backend

## 📄 Licencia

MIT
