# KYC Module Documentation

## Overview

El módulo KYC (Know Your Customer) proporciona un sistema completo de verificación de identidad y validación bancaria. Utiliza MetaMap para verificación de identidad con liveness detection y Prometeo para validación de cuentas bancarias.

## Quick Navigation

- [README.md](./README.md) - Guía completa del módulo
- [QUICK_START.md](./QUICK_START.md) - Guía rápida (5 minutos)
- [API_REFERENCE.md](./API_REFERENCE.md) - Referencia de endpoints
- [WEBHOOK_GUIDE.md](./WEBHOOK_GUIDE.md) - Guía de webhooks

## Key Features

✅ **Verificación de Identidad**
- MetaMap API integration
- Liveness detection
- Document OCR
- Selfie capture

✅ **Validación Bancaria**
- Prometeo integration
- Account validation
- Owner verification
- Bank code mapping

✅ **State Machine**
- PENDING → IN_PROGRESS → APPROVED/REJECTED
- Retry capabilities
- Expiration handling
- Admin overrides

✅ **Event-Driven**
- kyc.session_created
- kyc.verification_completed
- kyc.approved / kyc.rejected
- kyc.retry_started

## Project Structure

```
kyc/
├── controllers/
│   ├── kyc.controller.ts           # HTTP endpoints
│   └── kyc.controller.spec.ts      # 12 tests
├── services/
│   ├── kyc.service.ts              # Business logic
│   └── kyc.service.spec.ts         # 11 unit tests
├── repositories/
│   ├── kyc-verification.repository.ts
│   └── kyc-verification.repository.spec.ts
├── integrations/
│   ├── metamap.service.ts
│   ├── metamap.service.spec.ts
│   ├── prometeo.service.ts
│   └── prometeo.service.spec.ts
├── entities/
│   └── kyc-verification.entity.ts
├── dtos/
│   └── index.ts                    # 9 validated DTOs
├── kyc.module.ts                   # Module setup
├── kyc.e2e.spec.ts                # 15+ E2E tests
└── documentation/
    ├── INDEX.md (this file)
    ├── README.md
    ├── QUICK_START.md
    ├── API_REFERENCE.md
    └── WEBHOOK_GUIDE.md
```

## Endpoints Summary

### Public
- `POST /kyc/webhook` - Webhook MetaMap (sin autenticación)

### User (RESI, CLIENT)
- `POST /kyc/sessions` - Crear sesión de verificación
- `GET /kyc/status` - Obtener estado actual
- `POST /kyc/bank-account` - Validar cuenta bancaria
- `PATCH /kyc/retry` - Reintentar verificación

### Admin Only
- `PATCH /kyc/:id/approve` - Aprobar KYC
- `PATCH /kyc/:id/reject` - Rechazar KYC
- `GET /kyc/list` - Listar verificaciones
- `GET /kyc/stats` - Ver estadísticas

## Integration Points

### MetaMap API
```typescript
// Crear sesión de verificación
const session = await metamapService.createSession({
  documentType: 'NATIONAL_ID',
  captureMethod: 'SELFIE'
});

// Obtener resultado
const result = await metamapService.getSessionResult(sessionId);
```

### Prometeo API
```typescript
// Validar cuenta bancaria
const validation = await prometeoService.validateBankAccount({
  accountNumber: '1234567890',
  bankCode: 'BBVA',
  ownerName: 'John Doe'
});
```

## Events

El módulo emite los siguientes eventos:

| Event | When | Payload |
|-------|------|---------|
| `kyc.session_created` | Nueva sesión iniciada | {userId, kycId, sessionId} |
| `kyc.verification_completed` | Webhook recibido | {userId, kycId, result, metadata} |
| `kyc.approved` | Aprobado (auto o admin) | {userId, kycId, approvedAt, adminId?} |
| `kyc.rejected` | Rechazado | {userId, kycId, reason} |
| `kyc.retry_started` | Reinicio de verificación | {userId, kycId, newSessionId} |

## Database

### KycVerification Entity

```typescript
{
  id: UUID
  userId: UUID (FK users)
  sessionId: string (MetaMap)
  status: 'PENDING' | 'IN_PROGRESS' | 'APPROVED' | 'REJECTED' | 'EXPIRED'
  identityVerified: boolean
  bankVerified: boolean
  identityData: JSON
  bankData: JSON
  metadata: JSON
  retryAttempts: number
  expiresAt: timestamp
  approvedAt?: timestamp
  rejectedAt?: timestamp
  approvedBy?: string (admin user id)
  rejectionReason?: string
  createdAt: timestamp
  updatedAt: timestamp
}
```

## Configuration

Variables de entorno requeridas:

```env
# MetaMap
METAMAP_API_KEY=your_key
METAMAP_API_URL=https://api.metamap.com
METAMAP_WEBHOOK_SECRET=your_webhook_secret

# Prometeo
PROMETEO_API_KEY=your_key
PROMETEO_API_URL=https://api.prometeo.com
```

## Testing

Total: **45+ tests** (88-95% coverage)

- Unit tests: 35+ tests
- E2E tests: 10+ tests
- Coverage breakdown:
  - KycService: 11 tests
  - MetamapService: 6 tests
  - PrometeoService: 8 tests
  - Repository: 10 tests
  - Controller: 12 tests
  - E2E: 15+ scenarios

## Getting Started

1. **[QUICK_START.md](./QUICK_START.md)** - Primeros pasos
2. **[API_REFERENCE.md](./API_REFERENCE.md)** - Documentación de endpoints
3. **[README.md](./README.md)** - Guía detallada
4. **[WEBHOOK_GUIDE.md](./WEBHOOK_GUIDE.md)** - Webhook setup

## Related Modules

- **Auth Module** - Proporciona autenticación
- **Users Module** - Gestión de usuarios
- **Payments Module** - Sistema de pagos
- **Banking Module** - Información bancaria

## Support

Para preguntas o problemas:
1. Revisar la documentación
2. Consultar los tests
3. Revisar ejemplos en QUICK_START.md
