# KYC Module - API Reference

## Endpoints Summary

| Method | Path | Auth | Role | Purpose |
|--------|------|------|------|---------|
| POST | `/kyc/sessions` | ✓ | RESI, CLIENT | Crear sesión |
| GET | `/kyc/status` | ✓ | All | Ver estado |
| POST | `/kyc/webhook` | ✗ | - | Webhook MetaMap |
| POST | `/kyc/bank-account` | ✓ | RESI, CLIENT | Validar banco |
| PATCH | `/kyc/retry` | ✓ | RESI, CLIENT | Reintentar |
| PATCH | `/kyc/:id/approve` | ✓ | ADMIN | Aprobar |
| PATCH | `/kyc/:id/reject` | ✓ | ADMIN | Rechazar |
| GET | `/kyc/list` | ✓ | ADMIN | Listar |
| GET | `/kyc/stats` | ✓ | ADMIN | Estadísticas |

## Detailed Endpoints

### 1. Create KYC Session

```http
POST /kyc/sessions
Authorization: Bearer {token}
Content-Type: application/json

{
  "documentType": "NATIONAL_ID" | "PASSPORT" | "DRIVER_LICENSE",
  "captureMethod": "SELFIE" | "LIVENESS_VIDEO"
}
```

**Response: 201 Created**
```json
{
  "kycVerificationId": "123e4567-e89b-12d3-a456-426614174000",
  "clientToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "sessionId": "metamap_session_123",
  "expiresAt": "2024-01-02T10:30:00Z"
}
```

**Errors:**
- 400: Invalid documentType
- 401: Unauthorized
- 409: Existing active session

---

### 2. Get KYC Status

```http
GET /kyc/status
Authorization: Bearer {token}
```

**Query Parameters:**
- `userId` (optional, admin only) - Get status for another user

**Response: 200 OK**
```json
{
  "kycVerificationId": "123e4567-e89b-12d3-a456-426614174000",
  "status": "PENDING" | "IN_PROGRESS" | "APPROVED" | "REJECTED" | "EXPIRED",
  "identityVerified": boolean,
  "bankVerified": boolean,
  "documentType": "NATIONAL_ID",
  "createdAt": "2024-01-01T10:30:00Z",
  "expiresAt": "2024-01-02T10:30:00Z",
  "approvedAt": "2024-01-01T11:00:00Z",
  "rejectionReason": null
}
```

**Errors:**
- 401: Unauthorized
- 404: No KYC record

---

### 3. Webhook Handler

```http
POST /kyc/webhook
x-metamap-signature: sha256={signature}
Content-Type: application/json

{
  "sessionId": "metamap_session_123",
  "result": "APPROVED" | "REJECTED" | "INCOMPLETE",
  "metadata": {
    "livenessScore": 0.98,
    "identityScore": 0.95,
    "documentType": "NATIONAL_ID",
    "documentOcr": {
      "name": "John Doe",
      "documentNumber": "12345678",
      "expiryDate": "2025-12-31"
    }
  }
}
```

**Response: 200 OK**
```json
{
  "success": true
}
```

**Errors:**
- 400: Invalid payload
- 401: Invalid signature
- 404: Session not found

---

### 4. Validate Bank Account

```http
POST /kyc/bank-account
Authorization: Bearer {token}
Content-Type: application/json

{
  "accountNumber": "1234567890",
  "bankCode": "BBVA" | "SANTANDER" | ...,
  "ownerName": "John Doe"
}
```

**Response: 201 Created**
```json
{
  "verified": true,
  "accountId": "prometeo_acc_123",
  "bankName": "BBVA Argentina",
  "ownerMatch": true,
  "accountType": "CHECKING",
  "validatedAt": "2024-01-01T11:00:00Z"
}
```

**Errors:**
- 400: Invalid account details
- 401: Unauthorized
- 404: No active KYC session
- 422: Bank account validation failed

---

### 5. Retry KYC Verification

```http
PATCH /kyc/retry
Authorization: Bearer {token}
Content-Type: application/json

{
  "kycVerificationId": "123e4567-e89b-12d3-a456-426614174000",
  "reason": "Document quality improved"
}
```

**Response: 200 OK**
```json
{
  "kycVerificationId": "123e4567-e89b-12d3-a456-426614174000",
  "clientToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "sessionId": "metamap_session_456",
  "retryAttempt": 2
}
```

**Errors:**
- 400: Cannot retry (not rejected)
- 401: Unauthorized
- 404: KYC record not found
- 429: Maximum retry attempts exceeded

---

### 6. Approve KYC (Admin)

```http
PATCH /kyc/:id/approve
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "notes": "Document verified manually"
}
```

**Response: 200 OK**
```json
{
  "success": true,
  "message": "KYC approved"
}
```

**Errors:**
- 401: Unauthorized
- 403: Not admin
- 404: KYC record not found
- 409: Already approved

---

### 7. Reject KYC (Admin)

```http
PATCH /kyc/:id/reject
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "reason": "Invalid document - expired"
}
```

**Response: 200 OK**
```json
{
  "success": true,
  "message": "KYC rejected"
}
```

**Errors:**
- 401: Unauthorized
- 403: Not admin
- 404: KYC record not found
- 409: Already rejected

---

### 8. List KYC Verifications (Admin)

```http
GET /kyc/list
Authorization: Bearer {admin_token}
```

**Query Parameters:**
- `status` (optional) - PENDING | APPROVED | REJECTED
- `page` (optional, default: 1) - Page number
- `limit` (optional, default: 20) - Items per page
- `userId` (optional) - Filter by user

**Response: 200 OK**
```json
{
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "userId": "user-123",
      "status": "APPROVED",
      "identityVerified": true,
      "bankVerified": true,
      "createdAt": "2024-01-01T10:30:00Z",
      "approvedAt": "2024-01-01T11:00:00Z"
    }
  ],
  "total": 45,
  "page": 1,
  "limit": 20,
  "pages": 3
}
```

**Errors:**
- 401: Unauthorized
- 403: Not admin

---

### 9. Get KYC Statistics (Admin)

```http
GET /kyc/stats
Authorization: Bearer {admin_token}
```

**Response: 200 OK**
```json
{
  "total": 100,
  "approved": 85,
  "rejected": 10,
  "pending": 5,
  "approvalRate": 0.85,
  "averageProcessingTime": "00:15:30",
  "averageRetries": 1.2,
  "topRejectionReason": "Invalid document"
}
```

**Errors:**
- 401: Unauthorized
- 403: Not admin

---

## Data Types

### KycStatus
```typescript
type KycStatus = "PENDING" | "IN_PROGRESS" | "APPROVED" | "REJECTED" | "EXPIRED"
```

### DocumentType
```typescript
type DocumentType = "NATIONAL_ID" | "PASSPORT" | "DRIVER_LICENSE"
```

### CaptureMethod
```typescript
type CaptureMethod = "SELFIE" | "LIVENESS_VIDEO"
```

### MetamapResult
```typescript
type MetamapResult = "APPROVED" | "REJECTED" | "INCOMPLETE"
```

---

## Common Response Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 422 | Unprocessable Entity |
| 429 | Too Many Requests |
| 500 | Internal Server Error |

---

## Error Response Format

```json
{
  "statusCode": 400,
  "message": "Descriptive error message",
  "error": "ERROR_CODE",
  "timestamp": "2024-01-01T10:30:00Z"
}
```

---

## Rate Limiting

- **Per User**: 10 requests/minute
- **Per Endpoint**: 100 requests/minute
- **Webhook**: Unlimited

---

## Authentication

Use JWT bearer token in Authorization header:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Webhook Security

All webhooks must validate signature:

```typescript
import * as crypto from 'crypto';

const signature = request.headers['x-metamap-signature'];
const payload = JSON.stringify(request.body);
const secret = process.env.METAMAP_WEBHOOK_SECRET;

const expected = crypto
  .createHmac('sha256', secret)
  .update(payload)
  .digest('hex');

if (signature !== expected) {
  throw new Error('Invalid signature');
}
```

---

## Environment Variables

```env
METAMAP_API_KEY=sk_live_xxxxx
METAMAP_API_URL=https://api.metamap.com
METAMAP_WEBHOOK_SECRET=whsec_xxxxx

PROMETEO_API_KEY=sk_live_yyyyy
PROMETEO_API_URL=https://api.prometeo.com

# Optional
KYC_SESSION_EXPIRY=24h
KYC_MAX_RETRIES=3
```

---

## Examples

### Postman Collection

```json
{
  "info": {
    "name": "KYC Module API",
    "version": "1.0"
  },
  "item": [
    {
      "name": "Create Session",
      "request": {
        "method": "POST",
        "url": "{{base_url}}/kyc/sessions",
        "header": [
          {"key": "Authorization", "value": "Bearer {{token}}"}
        ],
        "body": {
          "documentType": "NATIONAL_ID",
          "captureMethod": "SELFIE"
        }
      }
    }
  ]
}
```

---

## Related Documentation

- [Quick Start](./QUICK_START.md)
- [Webhook Guide](./WEBHOOK_GUIDE.md)
- [README](./README.md)
