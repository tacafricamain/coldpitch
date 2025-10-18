-- COMPLETE DATABASE MIGRATION FOR STAFF AND SETTINGS
-- Run this in your Supabase SQL Editor

-- =====================================================
-- 1. CREATE STAFF TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS staff (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL DEFAULT 'Staff',
    avatar_seed TEXT,
    login_times TIMESTAMPTZ[] DEFAULT ARRAY[]::TIMESTAMPTZ[],
    total_leads_added INTEGER DEFAULT 0,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 2. CREATE ACTIVITY LOGS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES staff(id) ON DELETE CASCADE,
    user_name TEXT NOT NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT,
    details JSONB DEFAULT '{}'::JSONB,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 3. CREATE SETTINGS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES staff(id) ON DELETE CASCADE,
    profile JSONB DEFAULT '{}'::JSONB,
    notifications JSONB DEFAULT '{
        "email_notifications": true,
        "browser_notifications": true,
        "new_reply_alert": true,
        "daily_summary": false,
        "weekly_report": false
    }'::JSONB,
    api_keys JSONB DEFAULT '{}'::JSONB,
    team_settings JSONB DEFAULT '{
        "auto_assign_leads": false
    }'::JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

-- =====================================================
-- 4. ALTER PROSPECTS TABLE (ADD USER TRACKING)
-- =====================================================
ALTER TABLE prospects 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES staff(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS added_by TEXT;

-- =====================================================
-- 5. CREATE INDEXES FOR PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_timestamp ON activity_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_prospects_user_id ON prospects(user_id);
CREATE INDEX IF NOT EXISTS idx_staff_email ON staff(email);
CREATE INDEX IF NOT EXISTS idx_settings_user_id ON settings(user_id);

-- =====================================================
-- 6. ENABLE ROW LEVEL SECURITY
-- =====================================================
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 7. CREATE RLS POLICIES (OPEN FOR NOW - RESTRICT LATER)
-- =====================================================
-- Staff table policies
CREATE POLICY "Enable read access for all users" ON staff FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON staff FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON staff FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON staff FOR DELETE USING (true);

-- Activity logs policies
CREATE POLICY "Enable read access for all users" ON activity_logs FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON activity_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON activity_logs FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON activity_logs FOR DELETE USING (true);

-- Settings table policies
CREATE POLICY "Enable read access for all users" ON settings FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON settings FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON settings FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON settings FOR DELETE USING (true);

-- =====================================================
-- 8. CREATE TRIGGER FUNCTION FOR UPDATED_AT
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 9. CREATE TRIGGERS
-- =====================================================
DROP TRIGGER IF EXISTS update_staff_updated_at ON staff;
CREATE TRIGGER update_staff_updated_at
    BEFORE UPDATE ON staff
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_settings_updated_at ON settings;
CREATE TRIGGER update_settings_updated_at
    BEFORE UPDATE ON settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 10. INSERT SAMPLE STAFF MEMBERS
-- =====================================================
INSERT INTO staff (name, email, role, avatar_seed, total_leads_added, login_times) VALUES
('Admin User', 'hello@spex.com.ng', 'Admin', 'admin', 0, ARRAY[NOW() - INTERVAL '2 hours']::TIMESTAMPTZ[]),
('John Doe', 'john@spex.com.ng', 'Sales Manager', 'john', 0, ARRAY[NOW() - INTERVAL '1 hour', NOW() - INTERVAL '3 hours']::TIMESTAMPTZ[]),
('Sarah Smith', 'sarah@spex.com.ng', 'Sales Rep', 'sarah', 0, ARRAY[NOW() - INTERVAL '30 minutes']::TIMESTAMPTZ[]),
('Mike Johnson', 'mike@spex.com.ng', 'Sales Rep', 'mike', 0, ARRAY[NOW() - INTERVAL '45 minutes', NOW() - INTERVAL '4 hours']::TIMESTAMPTZ[])
ON CONFLICT (email) DO NOTHING;

-- =====================================================
-- 11. INSERT SAMPLE ACTIVITY LOGS
-- =====================================================
DO $$
DECLARE
    admin_id UUID;
    john_id UUID;
    sarah_id UUID;
BEGIN
    -- Get staff IDs
    SELECT id INTO admin_id FROM staff WHERE email = 'hello@spex.com.ng' LIMIT 1;
    SELECT id INTO john_id FROM staff WHERE email = 'john@spex.com.ng' LIMIT 1;
    SELECT id INTO sarah_id FROM staff WHERE email = 'sarah@spex.com.ng' LIMIT 1;

    -- Insert activity logs if staff exists
    IF admin_id IS NOT NULL THEN
        INSERT INTO activity_logs (user_id, user_name, action, entity_type, entity_id, details, timestamp) VALUES
        (admin_id, 'Admin User', 'created prospect', 'prospect', gen_random_uuid()::text, '{"name": "Acme Corp", "status": "New"}'::JSONB, NOW() - INTERVAL '1 hour'),
        (admin_id, 'Admin User', 'updated campaign', 'campaign', gen_random_uuid()::text, '{"campaign": "Q1 Outreach", "status": "Active"}'::JSONB, NOW() - INTERVAL '2 hours');
    END IF;

    IF john_id IS NOT NULL THEN
        INSERT INTO activity_logs (user_id, user_name, action, entity_type, entity_id, details, timestamp) VALUES
        (john_id, 'John Doe', 'added prospect', 'prospect', gen_random_uuid()::text, '{"name": "TechStart Inc"}'::JSONB, NOW() - INTERVAL '30 minutes'),
        (john_id, 'John Doe', 'sent email', 'campaign', gen_random_uuid()::text, '{"recipients": 25}'::JSONB, NOW() - INTERVAL '3 hours');
    END IF;

    IF sarah_id IS NOT NULL THEN
        INSERT INTO activity_logs (user_id, user_name, action, entity_type, entity_id, details, timestamp) VALUES
        (sarah_id, 'Sarah Smith', 'created template', 'template', gen_random_uuid()::text, '{"name": "Cold Intro Email"}'::JSONB, NOW() - INTERVAL '45 minutes'),
        (sarah_id, 'Sarah Smith', 'updated prospect', 'prospect', gen_random_uuid()::text, '{"status": "Qualified"}'::JSONB, NOW() - INTERVAL '1 hour');
    END IF;
END $$;

-- =====================================================
-- 12. VERIFICATION QUERIES (OPTIONAL - COMMENT OUT IF NOT NEEDED)
-- =====================================================
-- SELECT 'Staff count:' as info, COUNT(*) as count FROM staff;
-- SELECT 'Activity logs count:' as info, COUNT(*) as count FROM activity_logs;
-- SELECT 'Settings count:' as info, COUNT(*) as count FROM settings;

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================
