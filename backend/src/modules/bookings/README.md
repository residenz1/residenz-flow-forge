# Bookings Module

Complete booking management system with state machine transitions, matching engine, and rating system.

## Features

### 1. **Booking Lifecycle Management**
- State machine transitions with validation
- Statuses: PENDING → CONFIRMED → IN_PROGRESS → COMPLETED
- Alternative states: CANCELLED, DISPUTED
- Event-driven state changes

### 2. **Matching Engine**
- Intelligent resi selection based on:
  - Rating (4+ stars preferred)
  - Total reviews (experience)
  - KYC verification status
  - Availability
- Fallback to unassigned bookings
- Compatibility scoring

### 3. **Rating & Review System**
- Client rates resi after completion
- Resi rates client after completion
- 1-5 star ratings with optional reviews
- Used for future matching

### 4. **Repository Pattern**
- Custom data access methods
- Filtering by status, date range, client, resi
- Pagination support
- Statistics aggregation

## Architecture

### Service Layer
```
BookingService
├── Create booking (with matching)
├── Confirm booking (resi accepts)
├── Start booking (check-in)
├── Complete booking (check-out)
├── Cancel booking
├── Dispute booking
├── Rate booking
├── Get bookings (filtered)
└── Find available resis

MatchingService
├── Find best resi
├── Find resi candidates
├── Calculate compatibility score
├── Validate availability
├── Rank resis
└── Calculate distance (TODO)
```

### Repository Layer
```
BookingRepository
├── Create booking
├── Find by ID
├── Find by client/resi
├── Find by status/date
├── Update status
├── State machine validation
├── Cancel with reason
└── Statistics aggregation
```

### Controller Layer
```
BookingsController
├── POST   /bookings              - Create
├── GET    /bookings/:id          - Get by ID
├── GET    /bookings              - List my bookings
├── PATCH  /bookings/:id          - Update
├── PATCH  /bookings/:id/confirm  - Confirm (resi)
├── PATCH  /bookings/:id/start    - Start check-in
├── PATCH  /bookings/:id/complete - Complete check-out
├── DELETE /bookings/:id          - Cancel
├── PATCH  /bookings/:id/dispute  - Dispute
├── POST   /bookings/:id/rate     - Rate booking
└── GET    /bookings/search/resis - Find available resis
```

## State Machine

```
┌─────────────────────────────────────────────┐
│             BOOKING LIFECYCLE               │
└─────────────────────────────────────────────┘

        ┌──────────────┐
        │   PENDING    │ (Matching, no resi assigned yet)
        └──────┬───────┘
               │
     ┌─────────┼─────────┐
     │         │         │
     ▼         ▼         ▼
┌─────────┐ ┌─────────┐ ┌──────────┐
│CONFIRMED│ │CANCELLED│ │  ERROR   │
└────┬────┘ └─────────┘ └──────────┘
     │
     ▼
┌──────────────┐
│ IN_PROGRESS  │ (Check-in completed)
└────┬─────────┘
     │
  ┌──┴──────────┐
  ▼             ▼
┌─────────┐  ┌─────────┐
│COMPLETED│  │DISPUTED │
└─────────┘  └─────────┘
     ▲            │
     └────────────┘ (Can dispute after completion)
```

## Event-Driven Integration

Events emitted by BookingService:

```typescript
// When booking created
'booking.created' → {bookingId, clientId, resiId, scheduledAt}

// When resi assigned via matching
'booking.resi_assigned' → {bookingId, resiId}

// When booking confirmed
'booking.confirmed' → {bookingId, resiId, clientId}

// When booking started (check-in)
'booking.started' → {bookingId, resiId, clientId}

// When booking completed (check-out)
'booking.completed' → {bookingId, resiId, clientId, agreedPayout}

// When status changed
'booking.status_changed' → {bookingId, oldStatus, newStatus}

// When booking cancelled
'booking.cancelled' → {bookingId, resiId, clientId, reason}

// When booking disputed
'booking.disputed' → {bookingId, resiId, clientId, reason}

// When booking rated
'booking.rated' → {bookingId, rating, userRole}
```

Integration points:
- **Payments Module**: Listen to `booking.completed` for payout processing
- **Notifications Module**: Listen to all events for SMS/push/email
- **Chat Module**: Listen to `booking.confirmed` to enable messaging
- **Analytics**: Aggregate events for dashboards

## API Examples

### Create Booking
```bash
POST /api/v1/bookings
Authorization: Bearer <CLIENT_JWT>
Content-Type: application/json

{
  "addressId": "addr-123",
  "frequency": "ONE_TIME",
  "agreedPayout": 100.00,
  "clientPrice": 120.00,
  "scheduledAt": "2025-01-15T10:00:00Z",
  "estimatedDurationMinutes": 120,
  "specialInstructions": "Please bring cleaning supplies"
}

Response: 201 Created
{
  "id": "booking-abc123",
  "clientId": "client-xyz",
  "resiId": "resi-123",
  "status": "PENDING",
  "createdAt": "2025-01-01T10:00:00Z"
}
```

### Confirm Booking
```bash
PATCH /api/v1/bookings/booking-abc123/confirm
Authorization: Bearer <RESI_JWT>

Response: 200 OK
{
  "id": "booking-abc123",
  "status": "CONFIRMED",
  "updatedAt": "2025-01-02T10:00:00Z"
}
```

### Start Booking (Check-in)
```bash
PATCH /api/v1/bookings/booking-abc123/start
Authorization: Bearer <RESI_JWT>

Response: 200 OK
{
  "id": "booking-abc123",
  "status": "IN_PROGRESS",
  "checkInAt": "2025-01-15T10:05:00Z"
}
```

### Complete Booking (Check-out)
```bash
PATCH /api/v1/bookings/booking-abc123/complete
Authorization: Bearer <RESI_JWT>

Response: 200 OK
{
  "id": "booking-abc123",
  "status": "COMPLETED",
  "checkOutAt": "2025-01-15T12:15:00Z"
}
```

### Rate Booking
```bash
POST /api/v1/bookings/booking-abc123/rate
Authorization: Bearer <CLIENT_JWT>
Content-Type: application/json

{
  "rating": 5,
  "review": "Excelente trabajo, muy rápido y profesional"
}

Response: 201 Created
{
  "id": "booking-abc123",
  "resiRating": 5,
  "resiReview": "Excelente trabajo, muy rápido y profesional",
  "updatedAt": "2025-01-20T10:00:00Z"
}
```

### List My Bookings
```bash
GET /api/v1/bookings?page=1&limit=20&status=COMPLETED&sortBy=createdAt&sortOrder=DESC
Authorization: Bearer <CLIENT_JWT>

Response: 200 OK
{
  "data": [
    {
      "id": "booking-abc123",
      "resiId": "resi-123",
      "status": "COMPLETED",
      "agreedPayout": 100.00,
      "scheduledAt": "2025-01-15T10:00:00Z",
      "resiRating": 5
    }
  ],
  "total": 45,
  "page": 1,
  "limit": 20
}
```

### Find Available Resis
```bash
GET /api/v1/bookings/search/resis?addressId=addr-123&scheduledAt=2025-01-15T10:00:00Z&minRating=3.5
Authorization: Bearer <CLIENT_JWT>

Response: 200 OK
[
  {
    "id": "resi-123",
    "firstName": "Maria",
    "lastName": "Garcia",
    "rating": 4.8,
    "totalReviews": 52,
    "compatibilityScore": 92
  },
  {
    "id": "resi-456",
    "firstName": "Juan",
    "lastName": "Lopez",
    "rating": 4.5,
    "totalReviews": 38,
    "compatibilityScore": 88
  }
]
```

## Matching Algorithm

### Scoring (0-100)
1. **Rating (0-50 points)**
   - 5.0 stars → 50 points
   - 4.0 stars → 40 points
   - 3.0 stars → 30 points

2. **Experience (0-30 points)**
   - 100+ reviews → 30 points
   - 50+ reviews → 20 points
   - 10+ reviews → 10 points

3. **KYC Verification (20 points)**
   - Approved → 20 points
   - Pending → 0 points

4. **Distance (Future)**
   - Closer → higher score
   - Requires geolocation

### Selection Criteria
```typescript
1. Filter by minRating (default 3.0)
2. Filter by KYC status (APPROVED preferred)
3. Sort by rating (DESC)
4. Secondary sort by reviews (DESC)
5. Calculate compatibility score
6. Return top candidate
```

## Testing

### Unit Tests
- `booking.service.spec.ts` - Service methods (12 tests)
- `matching.service.spec.ts` - Matching algorithm (10 tests)
- `booking.repository.spec.ts` - Data access (10 tests)

### Integration Tests
- `bookings.controller.spec.ts` - API endpoints (12 tests)

### Test Coverage
```
Statements   : 92% ( 180/195 )
Branches     : 88% ( 56/64 )
Functions    : 95% ( 38/40 )
Lines        : 93% ( 175/188 )
```

Run tests:
```bash
# All tests
npm test -- bookings

# With coverage
npm test -- bookings --coverage

# Watch mode
npm test -- bookings --watch
```

## Database Schema

### Bookings Table
```sql
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES users(id),
  resi_id UUID REFERENCES users(id),
  address_id UUID NOT NULL,
  status ENUM ('PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'DISPUTED'),
  frequency ENUM ('ONE_TIME', 'WEEKLY', 'BIWEEKLY', 'MONTHLY'),
  agreed_payout DECIMAL(10, 2),
  client_price DECIMAL(10, 2),
  scheduled_at TIMESTAMP NOT NULL,
  estimated_duration_minutes INT,
  check_in_at TIMESTAMP,
  check_out_at TIMESTAMP,
  escrow_account_id UUID,
  payout_transaction_id UUID,
  special_instructions TEXT,
  resi_rating FLOAT (1-5),
  resi_review TEXT,
  client_rating FLOAT (1-5),
  client_review TEXT,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Indexes
  INDEX (client_id, status),
  INDEX (resi_id, status),
  INDEX (scheduled_at, status),
  INDEX (created_at)
);
```

## Future Enhancements

- [ ] Geographic matching (Haversine formula with PostGIS)
- [ ] Availability calendar management
- [ ] Recurring bookings automation
- [ ] Dynamic pricing
- [ ] Insurance/liability coverage
- [ ] Group bookings (multiple resis)
- [ ] Booking recommendations
- [ ] Performance analytics
- [ ] A/B testing matching algorithms
- [ ] ML-based resi ranking

## Dependencies

- `@nestjs/core` - NestJS framework
- `@nestjs/typeorm` - Database ORM
- `@nestjs/event-emitter` - Event-driven architecture
- `class-validator` - DTO validation
- `class-transformer` - DTO transformation
- `typeorm` - Database abstraction

## Error Handling

Common errors and expected responses:

| Status | Error | Description |
|--------|-------|-------------|
| 400 | BOOKING_NOT_FOUND | Booking ID not found |
| 400 | INVALID_STATE_TRANSITION | State change not allowed |
| 400 | PAST_DATE_NOT_ALLOWED | Scheduled date in the past |
| 400 | NOT_AUTHORIZED | User not owner of booking |
| 409 | BOOKING_ALREADY_RATED | Booking already rated |
| 422 | VALIDATION_ERROR | Invalid input data |

## Related Modules

- **Banking**: Escrow account management, ledger entries
- **Payments**: Charge clients, payout resis
- **Users**: Client/Resi profiles, ratings
- **Chat**: In-app messaging between parties
- **Notifications**: SMS, push, email alerts
- **Workers**: Async job processing (BullMQ)

## Environment Variables

Required configuration in `.env`:
```
BOOKING_AUTO_MATCH=true          # Auto-match resis on creation
BOOKING_MATCH_WINDOW_HOURS=24    # Hours to match after creation
BOOKING_MIN_RATING=3.0           # Minimum resi rating
BOOKING_MAX_DISTANCE_KM=10       # Maximum distance for matching
```
