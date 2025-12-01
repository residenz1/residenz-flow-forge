# Estrategia de Integración Prometeo para Residenz

## 📋 Análisis de Opciones

### 1. **Validación de Cuentas Bancarias** ✅ RECOMENDADO

**Por qué elegir esta opción:**

- **Alineación con KYC**: Complementa perfectamente el flujo MetaMap
  - MetaMap valida identidad del usuario
  - Prometeo valida que posea la cuenta bancaria
  
- **Caso de uso crítico**: Verificar que el usuario es el titular real de la cuenta
  - Previene fraude (validar propietario real)
  - Reduce riesgo operacional
  
- **Flujo actual en la app**:
  ```
  1. Usuario crea booking (Booking Module)
  2. KYC: MetaMap valida identidad
  3. KYC: Prometeo valida cuenta bancaria ← AQUÍ
  4. Banking: Crear wallets/escrow
  5. Payments: Procesar transacción
  ```

- **Integración ya en código**: Tu módulo KYC ya tiene estructura para:
  - `ValidateBankAccountDto` con campos: bankName, accountNumber, routingNumber, accountHolderName
  - `PrometeoService` con método `validateBankAccount()`
  - Flujo de validación: `kyc.service.validateBankAccount()`

**Endpoints Prometeo requeridos:**
```typescript
// GET /v1/banks - Listar bancos disponibles
// POST /v1/accounts/validate - Validar cuenta
// Response: { isValid, ownerMatch, accountType, bankCode }
```

---

### 2. Gestión de Tesorería ❌ NO APLICA AHORA

**Por qué no elegir:**
- Tu plataforma NO es tesorería empresarial
- Residenz maneja transacciones de usuarios finales, no grandes volúmenes corporativos
- Complejidad innecesaria para MVP

---

### 3. Acceso a Información Bancaria ❌ FUTURO

**Posible para fases posteriores:**
- Obtener movimientos bancarios del usuario
- Verificar saldos disponibles
- Validar fuentes de fondos (KYC avanzado)
- **Implementar en Phase 3** (después de validación básica funcionando)

---

### 4. Pagos Cuenta a Cuenta ❌ STRIPE PRIMERO

**Por qué no ahora:**
- Ya tienes Stripe integrado (Payments Module)
- Prometeo P2P agrega complejidad sin beneficio claro
- Stripe es más seguro para MVP internacional
- **Considerar cuando:** Necesites transferencias locales entre usuarios (Residenz a Residenz)

---

## 🎯 Implementación Recomendada

### Fase Actual: Validación de Cuentas

```typescript
// Flow: Booking → KYC Validation → Bank Validation → Payment

// 1. Usuario hace booking (residente busca residencia)
POST /bookings
{
  propertyId: "prop-123",
  checkInDate: "2025-12-15"
}

// 2. Sistema inicia KYC con MetaMap
POST /kyc/create-session
{
  userId: "user-123"
}
// → Usuario completa verificación facial/documento

// 3. Sistema valida cuenta bancaria con Prometeo
POST /kyc/validate-bank-account
{
  bankName: "BBVA Argentina",
  accountNumber: "1234567890",
  routingNumber: "123456",
  accountHolderName: "Juan Pérez"
}
// → Prometeo: ¿Es realmente Juan el dueño de esa cuenta?

// 4. Si válido: crear transacción de escrow
POST /payments/charge
{
  amount: 5000,
  currency: "ARS",
  accountId: "validated-account-123"
}
```

### Flujo de Estados KYC en BD

```sql
-- kyc_verifications
- PENDING → Usuario aún no verifica identidad
- APPROVED → MetaMap OK + Prometeo OK
- REJECTED → Fallo en cualquier validación
- EXPIRED → Sesión expirada, necesita reintentar
```

---

## 💰 Beneficios por Opción

| Opción | Residenz Benefit | Riesgo | Timeline |
|--------|------------------|--------|----------|
| **Validación de Cuentas** | Previene fraude, cumple regulación AML | Bajo | MVP ✅ |
| Gestión Tesorería | N/A | Alto | Fuera alcance |
| Acceso Info Bancaria | Riesgo crediticio | Muy alto | Phase 3+ |
| Pagos P2P | Competencia Stripe | Alto | Post-MVP |

---

## 🔄 Integración con Módulos Existentes

### Banking Module
```typescript
// Cuando KYC válido, crear accounts:
async function setupUserFinances(userId, kycVerification) {
  // Crear wallet
  const wallet = await bankingService.createAccount({
    userId,
    type: 'WALLET',
    bankVerified: true, // ← De Prometeo
  });
  
  // Crear escrow (para bookings)
  const escrow = await bankingService.createAccount({
    userId,
    type: 'ESCROW',
    linkedBankAccount: kycVerification.bankCode,
  });
  
  return { wallet, escrow };
}
```

### Payments Module
```typescript
// Al procesar pago:
async function processPayment(bookingId, amount) {
  const booking = await bookingService.findById(bookingId);
  const kyc = await kycService.getStatus(booking.userId);
  
  // Verificar que cuenta bancaria fue validada
  if (!kyc.bankVerified) {
    throw new Error('Bank account not validated');
  }
  
  // Procesar con Stripe
  const charge = await stripe.charges.create({
    amount,
    currency: booking.currency,
    source: kyc.bankVerificationToken, // ← De Prometeo
  });
}
```

---

## 📊 Configuración Prometeo en Code

Ya tienes en `prometeo.service.ts`:

```typescript
// ✅ VALIDAR CUENTA
async validateBankAccount(dto: ValidateBankAccountDto) {
  // POST /v1/accounts/validate
  // Validar: bankName, accountNumber, routingNumber, accountHolderName
  // Retorna: { isValid, ownerMatch, accountType, bankCode }
}

// ✅ OBTENER INFO BANCO
async getBankInfo(bankName: string) {
  // GET /v1/banks?search={bankName}
  // Retorna: código, nombre, tipos de cuenta soportados
}

// ❌ NO IMPLEMENTAR AHORA:
// - getUserAccounts() → Fase 3
// - createAccountLinkToken() → Fase 3
// - exchangeLinkToken() → Fase 3
```

---

## 🎓 Recomendación Final

✅ **SELECCIONA: "Validación de Cuentas Bancarias"**

**Razones:**
1. Encaja perfectamente con tu arquitectura KYC actual
2. Código ya estructurado, solo falta conectar con Prometeo API
3. Reduce fraude y cumple regulación
4. Es el bloqueador actual para Payments Module
5. MVP-ready: no necesitas las otras opciones ahora

**Próximos pasos:**
1. Obtener credenciales Prometeo (API key, sandbox)
2. Completar implementación `PrometeoService`
3. Ejecutar tests de validación de cuentas
4. Integrar con Payments Module
5. Testing E2E: Booking → KYC → Bank Validation → Payment

