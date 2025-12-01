-- ============================================
-- RESIDENZ v4.0 - DATABASE SCHEMA
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- ============================================
-- ENUMS
-- ============================================

CREATE TYPE user_role AS ENUM ('CLIENT', 'RESI', 'LANDLORD', 'ADMIN');
CREATE TYPE kyc_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'MANUAL_REVIEW');
CREATE TYPE doc_type AS ENUM ('DNI', 'PASSPORT', 'CE', 'RUC');
CREATE TYPE partnership_status AS ENUM ('PROSPECT', 'ACTIVE', 'PAUSED', 'TERMINATED');
CREATE TYPE cleaning_frequency AS ENUM ('DAILY', 'WEEKLY', 'BIWEEKLY', 'MONTHLY');
CREATE TYPE plan_type AS ENUM ('RESIDENTIAL', 'COMMON_AREA');
CREATE TYPE subscription_type AS ENUM ('RESIDENTIAL', 'COMMON_AREA');
CREATE TYPE subscription_status AS ENUM ('ACTIVE', 'PAUSED', 'CANCELED', 'PAST_DUE');
CREATE TYPE booking_type AS ENUM ('RESIDENTIAL', 'COMMON_AREA', 'DEEP_CLEAN');
CREATE TYPE booking_status AS ENUM ('SCHEDULED', 'ASSIGNED', 'EN_ROUTE', 'IN_PROGRESS', 'COMPLETED', 'CANCELED', 'NO_SHOW');
CREATE TYPE flag_type AS ENUM ('DEEP_CLEAN_KITCHEN', 'PET_MESS', 'CLUTTER', 'REPAIR_NEEDED', 'COMMON_AREA_ISSUE');
CREATE TYPE score_type AS ENUM ('RESI_PERFORMANCE', 'CLIENT_RELIABILITY', 'LANDLORD_PARTNERSHIP');
CREATE TYPE transaction_type AS ENUM ('DEPOSIT', 'WITHDRAWAL', 'PAYOUT', 'LOAN_DISBURSEMENT', 'LOAN_REPAYMENT', 'FEE', 'LANDLORD_COMMISSION');
CREATE TYPE transaction_status AS ENUM ('PENDING', 'COMPLETED', 'FAILED');
CREATE TYPE invoice_status AS ENUM ('DRAFT', 'SENT', 'PAID', 'OVERDUE');
CREATE TYPE loan_status AS ENUM ('ACTIVE', 'PAID', 'DEFAULT');
CREATE TYPE upsell_status AS ENUM ('SENT', 'VIEWED', 'CONVERTED', 'EXPIRED');
CREATE TYPE referral_status AS ENUM ('PENDING', 'CONVERTED', 'PAID_OUT');
CREATE TYPE incident_category AS ENUM ('QUALITY', 'DAMAGE', 'NO_SHOW', 'ACCESS_ISSUE', 'OTHER');
CREATE TYPE incident_priority AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');
CREATE TYPE incident_status AS ENUM ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED');
CREATE TYPE waitlist_status AS ENUM ('WAITING', 'CONTACTED', 'CONVERTED', 'EXPIRED');
CREATE TYPE account_type AS ENUM ('PERSONAL', 'BUSINESS');

-- ============================================
-- MODULE: IDENTITY & ACCESS (IAM)
-- ============================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone_number VARCHAR(20) UNIQUE,
    password_hash VARCHAR(255),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role user_role NOT NULL DEFAULT 'CLIENT',
    kyc_status kyc_status DEFAULT 'PENDING',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE user_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    doc_type doc_type NOT NULL,
    doc_number VARCHAR(50),
    front_image_url TEXT,
    back_image_url TEXT,
    selfie_url TEXT,
    verification_metadata JSONB,
    verified_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ============================================
-- MODULE: PROPERTY MANAGEMENT (B2B2C)
-- ============================================

CREATE TABLE buildings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    landlord_id UUID NOT NULL REFERENCES users(id),
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100),
    district VARCHAR(100),
    location GEOGRAPHY(POINT, 4326),
    total_units INTEGER DEFAULT 0,
    has_common_areas BOOLEAN DEFAULT false,
    partnership_status partnership_status DEFAULT 'PROSPECT',
    partnership_start_date DATE,
    access_instructions JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE common_areas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    building_id UUID NOT NULL REFERENCES buildings(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    estimated_sqm INTEGER,
    cleaning_frequency cleaning_frequency,
    agreed_price_per_service DECIMAL(10, 2),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE units (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    building_id UUID NOT NULL REFERENCES buildings(id) ON DELETE CASCADE,
    unit_number VARCHAR(50) NOT NULL,
    bedrooms INTEGER,
    bathrooms INTEGER,
    sqm INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(building_id, unit_number)
);

CREATE TABLE addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    unit_id UUID REFERENCES units(id),
    street_address TEXT NOT NULL,
    city VARCHAR(100),
    district VARCHAR(100),
    location GEOGRAPHY(POINT, 4326),
    instructions TEXT,
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ============================================
-- MODULE: CORE BUSINESS (Subscriptions & Booking)
-- ============================================

CREATE TABLE plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    base_price DECIMAL(10, 2) NOT NULL,
    visits_per_month INTEGER NOT NULL,
    size_bedrooms INTEGER,
    plan_type plan_type NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES users(id),
    address_id UUID REFERENCES addresses(id),
    common_area_id UUID REFERENCES common_areas(id),
    plan_id UUID NOT NULL REFERENCES plans(id),
    subscription_type subscription_type NOT NULL,
    status subscription_status DEFAULT 'ACTIVE',
    frequency cleaning_frequency NOT NULL,
    start_date DATE NOT NULL,
    next_billing_date DATE,
    preferred_resi_id UUID REFERENCES users(id),
    discount_percentage DECIMAL(5, 2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subscription_id UUID NOT NULL REFERENCES subscriptions(id),
    client_id UUID NOT NULL REFERENCES users(id),
    resi_id UUID REFERENCES users(id),
    address_id UUID REFERENCES addresses(id),
    common_area_id UUID REFERENCES common_areas(id),
    booking_type booking_type NOT NULL,
    status booking_status DEFAULT 'SCHEDULED',
    scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
    check_in_at TIMESTAMP WITH TIME ZONE,
    check_out_at TIMESTAMP WITH TIME ZONE,
    agreed_payout_amount DECIMAL(10, 2),
    check_in_selfie_url TEXT,
    check_in_location GEOGRAPHY(POINT, 4326),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE booking_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    is_completed BOOLEAN DEFAULT false,
    is_critical BOOLEAN DEFAULT false,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ============================================
-- MODULE: TRUST & QUALITY (Trust Engine)
-- ============================================

CREATE TABLE service_flags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES bookings(id),
    resi_id UUID NOT NULL REFERENCES users(id),
    flag_type flag_type NOT NULL,
    notes TEXT,
    processed_for_upsell BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE ratings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES bookings(id),
    rater_id UUID NOT NULL REFERENCES users(id),
    rated_id UUID NOT NULL REFERENCES users(id),
    stars INTEGER NOT NULL CHECK (stars >= 1 AND stars <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    score_type score_type NOT NULL,
    current_score DECIMAL(5, 2) DEFAULT 0,
    factors_breakdown JSONB,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(user_id, score_type)
);

CREATE TABLE score_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    score_id UUID NOT NULL REFERENCES scores(id),
    old_score DECIMAL(5, 2),
    new_score DECIMAL(5, 2),
    change_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ============================================
-- MODULE: FINTECH (Financial Engine)
-- ============================================

CREATE TABLE wallets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    balance_available DECIMAL(12, 2) DEFAULT 0,
    balance_blocked DECIMAL(12, 2) DEFAULT 0,
    currency VARCHAR(3) DEFAULT 'PEN',
    last_transaction_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE bank_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    bank_name VARCHAR(100) NOT NULL,
    account_number_encrypted TEXT NOT NULL,
    account_holder_name VARCHAR(255) NOT NULL,
    account_type account_type DEFAULT 'PERSONAL',
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet_id UUID NOT NULL REFERENCES wallets(id),
    type transaction_type NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    status transaction_status DEFAULT 'PENDING',
    reference_id VARCHAR(255),
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    landlord_id UUID NOT NULL REFERENCES users(id),
    building_id UUID NOT NULL REFERENCES buildings(id),
    subtotal DECIMAL(12, 2) NOT NULL,
    discount DECIMAL(12, 2) DEFAULT 0,
    total DECIMAL(12, 2) NOT NULL,
    status invoice_status DEFAULT 'DRAFT',
    billing_period_start DATE NOT NULL,
    billing_period_end DATE NOT NULL,
    due_date DATE NOT NULL,
    pdf_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE invoice_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    booking_id UUID REFERENCES bookings(id),
    description TEXT NOT NULL,
    quantity INTEGER DEFAULT 1,
    unit_price DECIMAL(10, 2) NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE loans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    resi_id UUID NOT NULL REFERENCES users(id),
    principal_amount DECIMAL(12, 2) NOT NULL,
    interest_rate DECIMAL(5, 2) NOT NULL,
    term_months INTEGER NOT NULL,
    monthly_installment DECIMAL(10, 2) NOT NULL,
    remaining_balance DECIMAL(12, 2) NOT NULL,
    status loan_status DEFAULT 'ACTIVE',
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ============================================
-- MODULE: GROWTH (Upsell & Referrals)
-- ============================================

CREATE TABLE upsell_offers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES users(id),
    trigger_flag_id UUID REFERENCES service_flags(id),
    offer_name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    discount_percentage DECIMAL(5, 2) DEFAULT 0,
    status upsell_status DEFAULT 'SENT',
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE referral_codes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL REFERENCES users(id),
    code VARCHAR(50) UNIQUE NOT NULL,
    discount_for_referred DECIMAL(5, 2) NOT NULL,
    commission_for_owner DECIMAL(5, 2) NOT NULL,
    times_used INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE referrals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    referral_code_id UUID NOT NULL REFERENCES referral_codes(id),
    referred_user_id UUID NOT NULL REFERENCES users(id),
    referred_subscription_id UUID REFERENCES subscriptions(id),
    status referral_status DEFAULT 'PENDING',
    commission_earned DECIMAL(10, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ============================================
-- MODULE: SUPPORT & OPS
-- ============================================

CREATE TABLE incidents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES bookings(id),
    reporter_id UUID NOT NULL REFERENCES users(id),
    building_id UUID REFERENCES buildings(id),
    category incident_category NOT NULL,
    priority incident_priority DEFAULT 'MEDIUM',
    status incident_status DEFAULT 'OPEN',
    description TEXT NOT NULL,
    resolution_notes TEXT,
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE waitlist (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    building_id UUID REFERENCES buildings(id),
    desired_address TEXT,
    desired_start DATE,
    status waitlist_status DEFAULT 'WAITING',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_kyc_status ON users(kyc_status);

CREATE INDEX idx_buildings_landlord ON buildings(landlord_id);
CREATE INDEX idx_buildings_status ON buildings(partnership_status);
CREATE INDEX idx_buildings_location ON buildings USING GIST(location);

CREATE INDEX idx_addresses_user ON addresses(user_id);
CREATE INDEX idx_addresses_location ON addresses USING GIST(location);

CREATE INDEX idx_subscriptions_client ON subscriptions(client_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);

CREATE INDEX idx_bookings_subscription ON bookings(subscription_id);
CREATE INDEX idx_bookings_client ON bookings(client_id);
CREATE INDEX idx_bookings_resi ON bookings(resi_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_scheduled ON bookings(scheduled_at);

CREATE INDEX idx_transactions_wallet ON transactions(wallet_id);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_status ON transactions(status);

CREATE INDEX idx_ratings_booking ON ratings(booking_id);
CREATE INDEX idx_ratings_rated ON ratings(rated_id);

CREATE INDEX idx_incidents_booking ON incidents(booking_id);
CREATE INDEX idx_incidents_status ON incidents(status);

-- ============================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_buildings_updated_at BEFORE UPDATE ON buildings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();