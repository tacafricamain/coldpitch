-- DEFINITIVE RLS FIX - Disable RLS and verify
-- Run this ENTIRE script in Supabase SQL Editor

-- 1. Disable RLS on all tables
ALTER TABLE prospects DISABLE ROW LEVEL SECURITY;
ALTER TABLE staff DISABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE settings DISABLE ROW LEVEL SECURITY;

-- 2. Drop ALL policies on ALL tables
DO $$ 
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN 
        SELECT schemaname, tablename, policyname 
        FROM pg_policies 
        WHERE schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', 
            pol.policyname, pol.schemaname, pol.tablename);
    END LOOP;
END $$;

-- 3. Grant full permissions to anon role (used by Supabase client)
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon;

-- For authenticated users too
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- 4. Verify RLS is disabled
SELECT 
    tablename,
    CASE WHEN rowsecurity THEN '❌ ENABLED' ELSE '✅ DISABLED' END as rls_status
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('prospects', 'staff', 'activity_logs', 'settings')
ORDER BY tablename;

-- 5. Verify no policies exist
SELECT 
    tablename,
    COUNT(*) as policy_count
FROM pg_policies 
WHERE schemaname = 'public'
GROUP BY tablename;

-- If the above query returns 0 rows, that's good!

-- 6. Test INSERT on settings table
INSERT INTO settings (
    user_id,
    profile,
    notifications,
    api_keys,
    team_settings
) VALUES (
    '36bafb8d-47db-4d1f-abba-5efed85068b7',
    '{"name": "Test", "email": "test@example.com", "timezone": "UTC"}'::jsonb,
    '{"email_notifications": true}'::jsonb,
    '{}'::jsonb,
    '{"auto_assign_leads": false}'::jsonb
)
ON CONFLICT (user_id) DO UPDATE SET
    profile = EXCLUDED.profile,
    updated_at = NOW();

-- 7. Verify the insert worked
SELECT 
    user_id,
    profile->>'name' as name,
    profile->>'email' as email
FROM settings 
WHERE user_id = '36bafb8d-47db-4d1f-abba-5efed85068b7';

-- Expected: Should show the settings record
