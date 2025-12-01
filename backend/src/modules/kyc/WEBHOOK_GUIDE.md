# KYC Module - Webhook Guide

## Overview

El módulo KYC recibe webhooks de MetaMap cuando la verificación de identidad se completa. Este documento explica cómo configurar y usar webhooks.

## Webhook Endpoint

```
POST /kyc/webhook
```

**Access**: Público (sin autenticación)
**Security**: HMAC-SHA256 signature validation

## Setup

### 1. Configurar Secret en .env

```env
METAMAP_WEBHOOK_SECRET=whsec_live_xxxxx
```

Obtener en MetaMap Dashboard → Settings → Webhooks

### 2. Registrar Endpoint en MetaMap

1. Login a [MetaMap Dashboard](https://dashboard.metamap.com)
2. Ir a Settings → Webhooks
3. Agregar URL:
   ```
   https://your-domain.com/kyc/webhook
   ```
4. Copiar el secret
5. Guardar en .env

### 3. Test Webhook (Development)

Usar ngrok o similar para exponer localhost:

```bash
ngrok http 3000
# Forwarding: https://abc123.ngrok.io -> localhost:3000

# Registrar en MetaMap:
# https://abc123.ngrok.io/kyc/webhook
```

## Webhook Payload

MetaMap enviará el siguiente payload:

```json
{
  "sessionId": "metamap_session_123",
  "result": "APPROVED",
  "metadata": {
    "livenessScore": 0.98,
    "identityScore": 0.95,
    "documentType": "NATIONAL_ID",
    "country": "AR",
    "documentOcr": {
      "name": "John Doe",
      "documentNumber": "12345678",
      "expiryDate": "2025-12-31",
      "issuingCountry": "AR"
    },
    "livenessData": {
      "faceSimilarity": 0.99,
      "livenessScore": 0.98,
      "passedLiveness": true
    }
  }
}
```

### Webhook Headers

```
POST /kyc/webhook HTTP/1.1
Host: your-domain.com
x-metamap-signature: sha256=abc123def456...
Content-Type: application/json
User-Agent: MetaMap-Webhook/1.0
```

## Signature Validation

El servidor valida automáticamente el webhook:

```typescript
// Internal validation in MetamapService.validateWebhook()
import * as crypto from 'crypto';

const signature = headers['x-metamap-signature'];
const payload = JSON.stringify(body);
const secret = process.env.METAMAP_WEBHOOK_SECRET;

const expected = crypto
  .createHmac('sha256', secret)
  .update(payload)
  .digest('hex');

if (signature !== `sha256=${expected}`) {
  throw new Error('Invalid webhook signature');
}
```

## Processing

Una vez recibido y validado el webhook:

1. **Validate Signature** ✓
2. **Find KYC Session** por sessionId
3. **Update Status**:
   - APPROVED → identityVerified = true
   - REJECTED → status = REJECTED, save reason
   - INCOMPLETE → status = PENDING (usuario no completó)
4. **Emit Event**: `kyc.verification_completed`
5. **Return 200 OK**

## Flow Completo

```
1. Usuario crea sesión
   └─ POST /kyc/sessions → sessionId

2. Usuario completa verificación en MetaMap
   └─ MetaMap frontend → captura de documento + liveness

3. MetaMap verifica y envía webhook
   └─ POST /kyc/webhook → signature validation → update DB

4. Sistema emite evento
   └─ EventEmitter2: kyc.verification_completed

5. Listeners responden
   └─ Enviar email, actualizar UI, etc.
```

## Webhook Results

### APPROVED
```json
{
  "sessionId": "metamap_session_123",
  "result": "APPROVED",
  "metadata": {
    "livenessScore": 0.98,
    "identityScore": 0.95
  }
}
```

**Actions:**
- ✅ Set status = "APPROVED"
- ✅ Set identityVerified = true
- ✅ Save documentOcr metadata
- ✅ Emit `kyc.verification_completed`

### REJECTED
```json
{
  "sessionId": "metamap_session_123",
  "result": "REJECTED",
  "metadata": {
    "reason": "Liveness check failed",
    "livenessScore": 0.45,
    "identityScore": 0.30
  }
}
```

**Actions:**
- ❌ Set status = "REJECTED"
- ❌ Save rejectionReason
- ❌ Emit `kyc.rejected`
- ℹ️ User can retry

### INCOMPLETE
```json
{
  "sessionId": "metamap_session_123",
  "result": "INCOMPLETE",
  "metadata": {
    "reason": "User did not complete verification"
  }
}
```

**Actions:**
- ⏳ Keep status = "PENDING"
- ⏳ Set expiresAt if not set
- ℹ️ Requires retry

## Error Handling

Si ocurre error al procesar webhook:

```typescript
// 1. Retry automático
// MetaMap reintentará hasta 3 veces

// 2. Fallback
// Webhook se guardará en DB para revisión manual

// 3. Alert
// Se enviará alerta a admins si falla persistentemente
```

## Monitoring

### Check Webhook Status

```bash
# Ver últimos webhooks en logs
tail -f logs/webhooks.log

# Ver webhooks en DB
SELECT * FROM kyc_webhooks ORDER BY created_at DESC LIMIT 20;
```

### Webhook Metrics

```typescript
// GET /kyc/webhook-stats (admin)
{
  "total_received": 1234,
  "total_processed": 1230,
  "total_failed": 4,
  "last_received": "2024-01-01T10:30:00Z",
  "average_processing_time": "0.125s"
}
```

## Testing

### Test en Development

```bash
# 1. Start app
npm run start:dev

# 2. Expose con ngrok
ngrok http 3000

# 3. Register en MetaMap test dashboard

# 4. Trigger test webhook desde MetaMap dashboard
# Settings → Webhooks → Send Test
```

### Simular Webhook Localmente

```bash
curl -X POST http://localhost:3000/kyc/webhook \
  -H "x-metamap-signature: sha256=..." \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "test-session",
    "result": "APPROVED",
    "metadata": {}
  }'
```

## Common Issues

### Issue: "Invalid webhook signature"

**Cause**: Secret no coincide
**Solution**: 
1. Copiar secret exacto de MetaMap dashboard
2. Actualizar .env
3. Reiniciar app

### Issue: "Session not found"

**Cause**: Webhook recibido antes de que se guarde en DB
**Solution**: 
1. Revisar logs del servidor
2. MetaMap reintentará automáticamente
3. Check si sessionId es correcto

### Issue: Webhook no se recibe

**Cause**: Endpoint no está público
**Solution**:
1. Usar ngrok en dev
2. Verificar firewall en producción
3. Confirmar URL en MetaMap dashboard

## Security Best Practices

✅ **DO:**
- ✓ Always validate signature
- ✓ Use environment variable para secret
- ✓ Log all webhooks (sin datos sensibles)
- ✓ Return 200 quickly, process async
- ✓ Retry failed webhooks

❌ **DON'T:**
- ✗ Hardcode webhook secret
- ✗ Skip signature validation
- ✗ Log sensitive data (documentOcr)
- ✗ Block webhook while processing
- ✗ Trust payload without validation

## Webhook Retry Logic

MetaMap reintentará webhooks con backoff:

```
Attempt 1: Inmediato
Attempt 2: +30 segundos
Attempt 3: +5 minutos
Attempt 4: +30 minutos
Attempt 5: +2 horas

Total: 5 intentos en ~2.5 horas
```

## Integration Points

### Event Listeners

```typescript
// Listen for webhook completions
@On('kyc.verification_completed')
async handleKycCompleted(payload: {
  userId: string;
  kycVerificationId: string;
  result: 'APPROVED' | 'REJECTED';
  metadata: any;
}) {
  // Enviar email, actualizar perfil, etc.
}
```

### Notificaciones

```typescript
// Cuando se completa verificación:
// 1. Email: "Your identity has been verified"
// 2. SMS: "KYC approved, ready to pay"
// 3. Push: "Verification complete"
```

### Updates a Otros Módulos

```typescript
// Cuando status = APPROVED:
// 1. Users: Actualizar is_kyc_verified
// 2. Payments: Enable payment methods
// 3. Bookings: Allow booking creation
```

## Webhook Headers Reference

| Header | Purpose |
|--------|---------|
| `x-metamap-signature` | HMAC-SHA256 signature |
| `x-metamap-timestamp` | Unix timestamp |
| `x-metamap-delivery-id` | Webhook delivery ID |
| `Content-Type` | application/json |
| `User-Agent` | MetaMap-Webhook/1.0 |

## Database Schema

```sql
-- KycWebhook table (for logging)
CREATE TABLE kyc_webhooks (
  id UUID PRIMARY KEY,
  kyc_verification_id UUID REFERENCES kyc_verifications(id),
  session_id VARCHAR(255),
  result VARCHAR(50),
  metadata JSONB,
  signature VARCHAR(255),
  status VARCHAR(50) DEFAULT 'PROCESSED',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Index para búsquedas rápidas
CREATE INDEX idx_kyc_webhooks_session_id ON kyc_webhooks(session_id);
CREATE INDEX idx_kyc_webhooks_created_at ON kyc_webhooks(created_at);
```

## Support

Para issues con webhooks:

1. Revisar logs: `logs/webhooks.log`
2. Verificar .env: `METAMAP_WEBHOOK_SECRET`
3. Test endpoint: `curl POST /kyc/webhook`
4. Contactar MetaMap support
5. Revisar [API_REFERENCE.md](./API_REFERENCE.md)

## Related Documentation

- [Quick Start](./QUICK_START.md)
- [API Reference](./API_REFERENCE.md)
- [README](./README.md)
- [MetaMap Docs](https://docs.metamap.com)
