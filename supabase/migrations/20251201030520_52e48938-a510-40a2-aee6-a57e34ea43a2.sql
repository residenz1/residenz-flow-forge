-- ============================================
-- RESIDENZ v4.0 - ROW LEVEL SECURITY POLICIES
-- ============================================

-- Fix search_path for function
ALTER FUNCTION update_updated_at_column() SET search_path = public;

-- ============================================
-- ENABLE RLS ON ALL TABLES
-- ============================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE buildings ENABLE ROW LEVEL SECURITY;
ALTER TABLE common_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE units ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE score_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE bank_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE loans ENABLE ROW LEVEL SECURITY;
ALTER TABLE upsell_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- ============================================
-- USERS TABLE POLICIES
-- ============================================

-- Users can view their own data
CREATE POLICY "Users can view own data"
    ON users FOR SELECT
    USING (id = auth.uid());

-- Users can update their own data
CREATE POLICY "Users can update own data"
    ON users FOR UPDATE
    USING (id = auth.uid());

-- Admins can view all users
CREATE POLICY "Admins can view all users"
    ON users FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM users WHERE id = auth.uid() AND role = 'ADMIN'
    ));

-- ============================================
-- USER DOCUMENTS POLICIES
-- ============================================

CREATE POLICY "Users can view own documents"
    ON user_documents FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Users can insert own documents"
    ON user_documents FOR INSERT
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can view all documents"
    ON user_documents FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM users WHERE id = auth.uid() AND role = 'ADMIN'
    ));

-- ============================================
-- BUILDINGS POLICIES
-- ============================================

CREATE POLICY "Landlords can view own buildings"
    ON buildings FOR SELECT
    USING (landlord_id = auth.uid());

CREATE POLICY "Landlords can insert own buildings"
    ON buildings FOR INSERT
    WITH CHECK (landlord_id = auth.uid());

CREATE POLICY "Landlords can update own buildings"
    ON buildings FOR UPDATE
    USING (landlord_id = auth.uid());

CREATE POLICY "Admins can manage all buildings"
    ON buildings FOR ALL
    USING (EXISTS (
        SELECT 1 FROM users WHERE id = auth.uid() AND role = 'ADMIN'
    ));

-- ============================================
-- COMMON AREAS POLICIES
-- ============================================

CREATE POLICY "Landlords can view common areas of own buildings"
    ON common_areas FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM buildings WHERE id = common_areas.building_id AND landlord_id = auth.uid()
    ));

CREATE POLICY "Landlords can manage common areas"
    ON common_areas FOR ALL
    USING (EXISTS (
        SELECT 1 FROM buildings WHERE id = common_areas.building_id AND landlord_id = auth.uid()
    ));

-- ============================================
-- UNITS POLICIES
-- ============================================

CREATE POLICY "Landlords can view units of own buildings"
    ON units FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM buildings WHERE id = units.building_id AND landlord_id = auth.uid()
    ));

CREATE POLICY "Landlords can manage units"
    ON units FOR ALL
    USING (EXISTS (
        SELECT 1 FROM buildings WHERE id = units.building_id AND landlord_id = auth.uid()
    ));

-- ============================================
-- ADDRESSES POLICIES
-- ============================================

CREATE POLICY "Users can view own addresses"
    ON addresses FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Users can insert own addresses"
    ON addresses FOR INSERT
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own addresses"
    ON addresses FOR UPDATE
    USING (user_id = auth.uid());

CREATE POLICY "Users can delete own addresses"
    ON addresses FOR DELETE
    USING (user_id = auth.uid());

-- ============================================
-- PLANS POLICIES (Public read, admin write)
-- ============================================

CREATE POLICY "Anyone can view active plans"
    ON plans FOR SELECT
    USING (is_active = true);

CREATE POLICY "Admins can manage plans"
    ON plans FOR ALL
    USING (EXISTS (
        SELECT 1 FROM users WHERE id = auth.uid() AND role = 'ADMIN'
    ));

-- ============================================
-- SUBSCRIPTIONS POLICIES
-- ============================================

CREATE POLICY "Clients can view own subscriptions"
    ON subscriptions FOR SELECT
    USING (client_id = auth.uid());

CREATE POLICY "Clients can create own subscriptions"
    ON subscriptions FOR INSERT
    WITH CHECK (client_id = auth.uid());

CREATE POLICY "Clients can update own subscriptions"
    ON subscriptions FOR UPDATE
    USING (client_id = auth.uid());

CREATE POLICY "Admins can view all subscriptions"
    ON subscriptions FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM users WHERE id = auth.uid() AND role = 'ADMIN'
    ));

-- ============================================
-- BOOKINGS POLICIES
-- ============================================

CREATE POLICY "Clients can view own bookings"
    ON bookings FOR SELECT
    USING (client_id = auth.uid());

CREATE POLICY "Resis can view assigned bookings"
    ON bookings FOR SELECT
    USING (resi_id = auth.uid());

CREATE POLICY "Resis can update assigned bookings"
    ON bookings FOR UPDATE
    USING (resi_id = auth.uid());

CREATE POLICY "System can create bookings"
    ON bookings FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Admins can manage all bookings"
    ON bookings FOR ALL
    USING (EXISTS (
        SELECT 1 FROM users WHERE id = auth.uid() AND role = 'ADMIN'
    ));

-- ============================================
-- BOOKING TASKS POLICIES
-- ============================================

CREATE POLICY "Resis can view tasks of assigned bookings"
    ON booking_tasks FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM bookings WHERE id = booking_tasks.booking_id AND resi_id = auth.uid()
    ));

CREATE POLICY "Resis can update tasks of assigned bookings"
    ON booking_tasks FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM bookings WHERE id = booking_tasks.booking_id AND resi_id = auth.uid()
    ));

-- ============================================
-- SERVICE FLAGS POLICIES
-- ============================================

CREATE POLICY "Resis can create service flags"
    ON service_flags FOR INSERT
    WITH CHECK (resi_id = auth.uid());

CREATE POLICY "Resis can view own service flags"
    ON service_flags FOR SELECT
    USING (resi_id = auth.uid());

CREATE POLICY "Admins can view all service flags"
    ON service_flags FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM users WHERE id = auth.uid() AND role = 'ADMIN'
    ));

-- ============================================
-- RATINGS POLICIES
-- ============================================

CREATE POLICY "Users can view ratings where they are rater or rated"
    ON ratings FOR SELECT
    USING (rater_id = auth.uid() OR rated_id = auth.uid());

CREATE POLICY "Users can create ratings as rater"
    ON ratings FOR INSERT
    WITH CHECK (rater_id = auth.uid());

-- ============================================
-- SCORES POLICIES
-- ============================================

CREATE POLICY "Users can view own scores"
    ON scores FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "System can update scores"
    ON scores FOR ALL
    USING (true);

-- ============================================
-- SCORE HISTORY POLICIES
-- ============================================

CREATE POLICY "Users can view own score history"
    ON score_history FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM scores WHERE id = score_history.score_id AND user_id = auth.uid()
    ));

-- ============================================
-- WALLETS POLICIES
-- ============================================

CREATE POLICY "Users can view own wallet"
    ON wallets FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Users can create own wallet"
    ON wallets FOR INSERT
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "System can update wallets"
    ON wallets FOR UPDATE
    USING (true);

-- ============================================
-- BANK ACCOUNTS POLICIES
-- ============================================

CREATE POLICY "Users can view own bank accounts"
    ON bank_accounts FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Users can create own bank accounts"
    ON bank_accounts FOR INSERT
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own bank accounts"
    ON bank_accounts FOR UPDATE
    USING (user_id = auth.uid());

CREATE POLICY "Users can delete own bank accounts"
    ON bank_accounts FOR DELETE
    USING (user_id = auth.uid());

-- ============================================
-- TRANSACTIONS POLICIES
-- ============================================

CREATE POLICY "Users can view own transactions"
    ON transactions FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM wallets WHERE id = transactions.wallet_id AND user_id = auth.uid()
    ));

CREATE POLICY "System can create transactions"
    ON transactions FOR INSERT
    WITH CHECK (true);

-- ============================================
-- INVOICES POLICIES
-- ============================================

CREATE POLICY "Landlords can view own invoices"
    ON invoices FOR SELECT
    USING (landlord_id = auth.uid());

CREATE POLICY "System can create invoices"
    ON invoices FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Admins can manage all invoices"
    ON invoices FOR ALL
    USING (EXISTS (
        SELECT 1 FROM users WHERE id = auth.uid() AND role = 'ADMIN'
    ));

-- ============================================
-- INVOICE ITEMS POLICIES
-- ============================================

CREATE POLICY "Landlords can view invoice items"
    ON invoice_items FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM invoices WHERE id = invoice_items.invoice_id AND landlord_id = auth.uid()
    ));

-- ============================================
-- LOANS POLICIES
-- ============================================

CREATE POLICY "Resis can view own loans"
    ON loans FOR SELECT
    USING (resi_id = auth.uid());

CREATE POLICY "System can manage loans"
    ON loans FOR ALL
    USING (true);

-- ============================================
-- UPSELL OFFERS POLICIES
-- ============================================

CREATE POLICY "Clients can view own upsell offers"
    ON upsell_offers FOR SELECT
    USING (client_id = auth.uid());

CREATE POLICY "Clients can update own upsell offers"
    ON upsell_offers FOR UPDATE
    USING (client_id = auth.uid());

CREATE POLICY "System can create upsell offers"
    ON upsell_offers FOR INSERT
    WITH CHECK (true);

-- ============================================
-- REFERRAL CODES POLICIES
-- ============================================

CREATE POLICY "Owners can view own referral codes"
    ON referral_codes FOR SELECT
    USING (owner_id = auth.uid());

CREATE POLICY "Anyone can view active codes (for validation)"
    ON referral_codes FOR SELECT
    USING (is_active = true);

CREATE POLICY "Owners can create own referral codes"
    ON referral_codes FOR INSERT
    WITH CHECK (owner_id = auth.uid());

-- ============================================
-- REFERRALS POLICIES
-- ============================================

CREATE POLICY "Users can view own referrals"
    ON referrals FOR SELECT
    USING (referred_user_id = auth.uid() OR EXISTS (
        SELECT 1 FROM referral_codes WHERE id = referrals.referral_code_id AND owner_id = auth.uid()
    ));

CREATE POLICY "System can create referrals"
    ON referrals FOR INSERT
    WITH CHECK (true);

-- ============================================
-- INCIDENTS POLICIES
-- ============================================

CREATE POLICY "Reporters can view own incidents"
    ON incidents FOR SELECT
    USING (reporter_id = auth.uid());

CREATE POLICY "Users can create incidents"
    ON incidents FOR INSERT
    WITH CHECK (reporter_id = auth.uid());

CREATE POLICY "Involved users can view incidents"
    ON incidents FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM bookings WHERE id = incidents.booking_id AND (client_id = auth.uid() OR resi_id = auth.uid())
    ));

CREATE POLICY "Admins can manage all incidents"
    ON incidents FOR ALL
    USING (EXISTS (
        SELECT 1 FROM users WHERE id = auth.uid() AND role = 'ADMIN'
    ));

-- ============================================
-- WAITLIST POLICIES
-- ============================================

CREATE POLICY "Users can view own waitlist entries"
    ON waitlist FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Users can create own waitlist entries"
    ON waitlist FOR INSERT
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own waitlist entries"
    ON waitlist FOR UPDATE
    USING (user_id = auth.uid());

CREATE POLICY "Admins can view all waitlist"
    ON waitlist FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM users WHERE id = auth.uid() AND role = 'ADMIN'
    ));