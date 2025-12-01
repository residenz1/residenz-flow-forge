# Migración de Stripe a MercadoPago - Guía de Implementación

## 📋 Estado Actual

✅ **Completado:**
- MercadoPagoService implementado con soporte Yape/Plin
- GatewayService actualizado (MercadoPago como PRIMARY, Stripe como FALLBACK)
- WebhookController con patrón Fetch-Back para MercadoPago
- PaymentsModule actualizado con MercadoPagoService registrado

⏳ **Pendiente:**
- Configuración de variables de entorno
- Endpoints de API para generar QR
- Listeners de eventos para actualizar base de datos
- Tests unitarios e integración
- Documentación de Swagger/OpenAPI

## 🔧 Configuración Necesaria

### 1. Variables de Entorno (.env)

```env
# MercadoPago
MERCADOPAGO_ACCESS_TOKEN=APP_USR-xxxxxxxxxxxxxxxx
NODE_ENV=production  # o 'sandbox' para testing

# API Base URL (para webhooks)
API_URL=https://api.residenz.pe
```

### 2. Obtener Credenciales de MercadoPago Perú

1. Ir a: https://www.mercadopago.com.pe/business/create-account
2. Crear cuenta de negocio
3. Ir a Settings → API credentials
4. Copiar **Access Token de Producción** o **Sandbox**
5. Guardar en .env como `MERCADOPAGO_ACCESS_TOKEN`

## 🚀 Endpoints a Implementar

### 1. POST `/payments/create-qr` - Generar QR de Pago

**Request:**
```json
{
  "amount": 50.00,
  "currency": "PEN",
  "bookingId": "booking_123",
  "clientEmail": "cliente@example.com",
  "description": "Pago de reserva en Residenz"
}
```

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "paymentId": "1234567890",
    "status": "pending",
    "amount": 50.00,
    "currency": "PEN",
    "expiration": "2025-12-01T21:00:00.000-04:00",
    "action": {
      "type": "scan_qr",
      "instructions": "Escanea este código con tu app de Yape o Plin",
      "qrRaw": "00020101021243540019...",
      "qrImageBase64": "data:image/png;base64,iVBORw0KGgoAAAANSU...",
      "ticketUrl": "https://www.mercadopago.com.pe/payments/1234567890/ticket"
    }
  }
}
```

### 2. GET `/payments/:paymentId/status` - Consultar Estado

**Response:**
```json
{
  "success": true,
  "data": {
    "paymentId": "1234567890",
    "status": "approved",
    "amount": 50.00,
    "currency": "PEN",
    "externalReference": "booking_123",
    "paymentMethod": "yape"
  }
}
```

### 3. POST `/payments/:paymentId/refund` - Reembolsar Pago

**Request:**
```json
{
  "amount": 25.00  // Opcional - si no se especifica, reembolsa total
}
```

## 🎯 Flujo de Pago Completo

### Cliente (Frontend)

1. **Usuario inicia compra de booking**
   ```
   Button: "Pagar ahora"
   ```

2. **Frontend solicita QR a tu backend**
   ```javascript
   const response = await fetch('/payments/create-qr', {
     method: 'POST',
     body: JSON.stringify({
       amount: 50,
       bookingId: 'booking_123',
       clientEmail: 'cliente@example.com'
     })
   });
   const { data } = await response.json();
   ```

3. **Muestra el QR**
   ```html
   <img src={data.action.qrImageBase64} alt="QR de Pago" />
   <p>Escanea con Yape o Plin</p>
   ```

4. **Polling cada 3 segundos para verificar pago**
   ```javascript
   const pollPaymentStatus = async (paymentId) => {
     const response = await fetch(`/payments/${paymentId}/status`);
     const { data } = await response.json();
     
     if (data.status === 'approved') {
       // Pago exitoso - redirigir a confirmación
       window.location.href = `/bookings/${bookingId}/confirmed`;
     } else if (data.status === 'rejected') {
       // Pago rechazado
       showError('Pago rechazado. Intenta de nuevo');
     }
   };
   
   setInterval(() => pollPaymentStatus(paymentId), 3000);
   ```

### Backend (Tu API)

1. **Cliente solicita QR**
   - GatewayService.charge() llama a MercadoPagoService.createQRPayment()
   - MercadoPagoService realiza llamada a API de MP
   - Retorna QR en base64

2. **Usuario escanea y paga con Yape/Plin**
   - Usuario confirma pago en su app
   - MP procesa la transacción

3. **MercadoPago envía webhook**
   ```
   POST /webhooks/mercadopago?topic=payment&id=1234567890
   ```

4. **Tu backend recibe webhook (Fetch-Back)**
   - Verifica firma (headers X-Signature, X-Request-Id)
   - Consulta a MP: `GET /v1/payments/1234567890`
   - Obtiene estado real: `"approved"`
   - Emite evento: `mercadopago.payment.approved`

5. **Listeners procesan evento**
   ```typescript
   @OnEvent('mercadopago.payment.approved')
   async handlePaymentApproved(payload: any) {
     // 1. Acreditar saldo al cliente
     // 2. Confirmar booking
     // 3. Emitir evento de booking confirmado
     // 4. Enviar notificación al usuario
   }
   ```

## 📊 Mapeo de Métodos de Pago

| Parámetro | Valor | Tipo de Pago | Soporte |
|-----------|-------|-------------|---------|
| `payment_method_id` | `yape` | QR escaneable | ✅ Yape + Plin |
| `payment_method_id` | `plin` | QR escaneable | ✅ Yape + Plin |
| `payment_method_id` | `card` | Tarjeta de crédito/débito | ⏳ Fallback |

## ⚠️ Consideraciones Importantes

### 1. UX para Usuarios en Móvil

Los usuarios que están en tu app dentro del navegador del móvil NO pueden escanear su propia pantalla.

**Solución implementada:**
- `qrRaw`: String del QR para que puedan descargarlo como imagen
- Botón "Descargar QR" para guardar en galería
- Botón "Compartir QR" para enviar por WhatsApp/email
- Instrucciones claras: "Guarda esta imagen en tu galería y abre Yape/Plin para escanearla"

### 2. Expiración de QR

- Los QR generados expiran en **15 minutos** (configurable en MercadoPagoService)
- Si el usuario no paga a tiempo, debe generar un nuevo QR
- Implementar botón "Reintentar" que genere nuevo QR

### 3. Validación de KYC antes de Payouts

Cuando un Resi recibe dinero (payout), debe tener KYC `APPROVED`.

**En GatewayService.payout():**
```typescript
if (resi.kycStatus !== 'APPROVED') {
  throw new Error('Resi must complete KYC first');
}
```

### 4. Idempotencia

Si MercadoPago reenvía el mismo webhook 2 veces (fallos de red, etc.):
- IdempotencyGuard verifica si ya fue procesado
- Si duplicado, responde 200 OK sin procesar de nuevo
- Tabla: `idempotency_keys` con `(event_id, provider, status)`

## 🔄 Flujo Alternativo: Usuario cancela pago

1. Usuario abre Yape/Plin pero **NO** confirma en 15 minutos
2. QR expira
3. MP envía webhook: `status: "cancelled"`
4. Tu backend recibe evento `mercadopago.payment.cancelled`
5. Liberar recursos (booking vuelve a "available")
6. Notificar al usuario: "Tu reserva expiró, intenta de nuevo"

## 🧪 Testing en Sandbox

MercadoPago proporciona tarjetas de prueba:

**Tarjeta aprobada:**
```
4111 1111 1111 1111
MM/AA: 11/25
CVC: 123
```

**Tarjeta rechazada:**
```
5555 5555 5555 4444
MM/AA: 11/25
CVC: 123
```

Para QR en sandbox, usa: `https://api.sandbox.mercadopago.com`

## 📚 Referencias

- MercadoPago Docs: https://developers.mercadopago.com.ar/es/docs
- Yape Developer: https://www.yape.com.pe/negocio
- Plin: https://www.plin.pe

## ✅ Checklist Implementación

- [ ] Configurar .env con `MERCADOPAGO_ACCESS_TOKEN`
- [ ] Crear endpoint `POST /payments/create-qr`
- [ ] Crear endpoint `GET /payments/:paymentId/status`
- [ ] Crear endpoint `POST /payments/:paymentId/refund`
- [ ] Implementar listeners para eventos mercadopago.*
- [ ] Crear tests unitarios para MercadoPagoService
- [ ] Crear tests E2E para flujo completo de pago
- [ ] Actualizar Swagger/OpenAPI docs
- [ ] Configurar webhooks en panel de MercadoPago
- [ ] Testing en sandbox (tarjetas de prueba)
- [ ] Migración a producción

## 🚀 Siguiente Paso Recomendado

**Crear el endpoint `POST /payments/create-qr` que:**

1. Recibe `amount`, `bookingId`, `clientEmail`
2. Valida que el booking exista y sea válido
3. Llama a `GatewayService.charge()`
4. Retorna JSON con QR en base64
5. Guarda en DB: `Payment` entity con estado `PENDING`

```typescript
// payments/controllers/payments.controller.ts
@Post('create-qr')
async createQRPayment(@Body() dto: CreateQRPaymentDto) {
  return await this.gatewayService.charge(
    dto.amount,
    'PEN',
    'yape',
    { bookingId: dto.bookingId, clientEmail: dto.clientEmail }
  );
}
```
