# KYC Module - Quick Start (5 minutos)

## Setup Rápido

### 1. Configuración de variables de entorno

```env
# .env
METAMAP_API_KEY=sk_live_xxxxx
METAMAP_API_URL=https://api.metamap.com
METAMAP_WEBHOOK_SECRET=whsec_xxxxx

PROMETEO_API_KEY=sk_live_yyyyy
PROMETEO_API_URL=https://api.prometeo.com
```

### 2. Inicializar módulo

El módulo ya está registrado en `app.module.ts`:

```typescript
import { KycModule } from './modules/kyc/kyc.module';

@Module({
  imports: [KycModule, ...otherModules],
})
export class AppModule {}
```

## Casos de Uso Comunes

### 1. Crear Sesión de KYC

```typescript
// POST /kyc/sessions
{
  "documentType": "NATIONAL_ID",
  "captureMethod": "SELFIE"
}

// Response
{
  "kycVerificationId": "kyc-123",
  "clientToken": "eyJhbGc...",
  "sessionId": "session-123",
  "expiresAt": "2024-01-01T12:00:00Z"
}
```

### 2. Verificar Estado

```typescript
// GET /kyc/status
// Response
{
  "status": "PENDING",
  "identityVerified": false,
  "bankVerified": false,
  "createdAt": "2024-01-01T10:00:00Z",
  "expiresAt": "2024-01-02T10:00:00Z"
}
```

### 3. Validar Cuenta Bancaria

```typescript
// POST /kyc/bank-account
{
  "accountNumber": "1234567890",
  "bankCode": "BBVA",
  "ownerName": "John Doe"
}

// Response
{
  "verified": true,
  "accountId": "acc-123",
  "bankName": "BBVA Argentina",
  "ownerMatch": true
}
```

### 4. Webhook MetaMap

```typescript
// POST /kyc/webhook (Public endpoint)
// Headers: x-metamap-signature: sha256=...
{
  "sessionId": "session-123",
  "result": "APPROVED",
  "metadata": {
    "documentType": "NATIONAL_ID",
    "country": "AR",
    "livenessScore": 0.98,
    "identityScore": 0.95
  }
}

// Auto-updates KYC status to APPROVED
```

### 5. Reintentar Verificación

```typescript
// PATCH /kyc/retry
{
  "kycVerificationId": "kyc-123",
  "reason": "Document quality improved"
}

// Response
{
  "clientToken": "eyJhbGc...",
  "sessionId": "session-456"
}
```

### 6. Admin: Aprobar KYC

```typescript
// PATCH /kyc/:id/approve (Admin only)
{
  "notes": "Document verified manually"
}

// Response
{
  "success": true,
  "message": "KYC approved"
}
```

### 7. Admin: Ver Estadísticas

```typescript
// GET /kyc/stats (Admin only)
{
  "total": 100,
  "approved": 85,
  "rejected": 10,
  "pending": 5,
  "approvalRate": 0.85
}
```

## Flujo Completo (Happy Path)

```
1. Cliente crea sesión
   POST /kyc/sessions → recibe clientToken

2. Cliente completa verificación en MetaMap
   MetaMap frontend → usuario captura selfie + documento

3. MetaMap envía webhook
   POST /kyc/webhook → status = APPROVED

4. Cliente valida cuenta bancaria
   POST /kyc/bank-account → bankVerified = true

5. KYC completado
   GET /kyc/status → status = APPROVED, ready for payments
```

## Estados y Transiciones

```
PENDING (inicial)
  ↓
IN_PROGRESS (usuario completando)
  ↓
APPROVED (exitoso) o REJECTED (rechazado)
  ↓
EXPIRED (después de 24h si no completado)

REJECTED → puede reintentar
APPROVED → terminal, no requiere reinicio
```

## Códigos de Banco Soportados

```
BBVA, SANTANDER, GALICIA, ICBC, BANCO_PROVINCIA,
BANCO_NACION, BANCO_CIUDAD, BROU, BANCO_CORRIENTES,
Y más...
```

Usar `getBankCode()` para mapeo automático.

## Manejo de Errores

```typescript
// Error: Session expired
{
  "statusCode": 400,
  "message": "Session expired",
  "error": "KYC_SESSION_EXPIRED"
}

// Error: Bank account invalid
{
  "statusCode": 400,
  "message": "Bank account validation failed",
  "verified": false,
  "error": "INVALID_ACCOUNT"
}

// Error: Too many retries
{
  "statusCode": 429,
  "message": "Maximum retry attempts exceeded",
  "error": "MAX_RETRIES_EXCEEDED"
}
```

## Testing

```bash
# Run KYC tests
npm test kyc.service.spec
npm test kyc.controller.spec
npm test kyc.e2e.spec

# Run all tests
npm test -- kyc
```

## Troubleshooting

| Problema | Solución |
|----------|----------|
| Token expirado | Crear nueva sesión con POST /kyc/sessions |
| Webhook no llega | Verificar METAMAP_WEBHOOK_SECRET en .env |
| Validación bancaria falla | Verificar PROMETEO_API_KEY y bankCode correcto |
| Status no se actualiza | Revisar logs de webhook, verificar firma |

## Documentación Adicional

- [README.md](./README.md) - Documentación completa
- [API_REFERENCE.md](./API_REFERENCE.md) - Referencia de endpoints
- [WEBHOOK_GUIDE.md](./WEBHOOK_GUIDE.md) - Configuración de webhooks
- [INDEX.md](./INDEX.md) - Estructura del proyecto

## Ejemplos cURL

```bash
# Crear sesión
curl -X POST http://localhost:3000/kyc/sessions \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "documentType": "NATIONAL_ID",
    "captureMethod": "SELFIE"
  }'

# Verificar estado
curl -X GET http://localhost:3000/kyc/status \
  -H "Authorization: Bearer YOUR_TOKEN"

# Validar banco
curl -X POST http://localhost:3000/kyc/bank-account \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "accountNumber": "1234567890",
    "bankCode": "BBVA",
    "ownerName": "John Doe"
  }'
```

## Siguientes Pasos

1. Implementar frontend con MetaMap SDK
2. Configurar webhook en MetaMap dashboard
3. Registrar PROMETEO_API_KEY
4. Probar flujo completo
5. Ir a [README.md](./README.md) para detalles avanzados
