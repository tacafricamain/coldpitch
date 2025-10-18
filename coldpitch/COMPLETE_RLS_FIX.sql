-- COMPLETE RLS FIX - Run this entire script in Supabase SQL Editor
-- This will disable RLS on all tables for development

-- 1. Disable RLS on all tables
ALTER TABLE IF EXISTS prospects DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS staff DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS activity_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS settings DISABLE ROW LEVEL SECURITY;

-- 2. Drop all existing policies (if any)
DO $$ 
DECLARE
    r RECORD;
BEGIN
    -- Drop policies on prospects
    FOR r IN SELECT policyname FROM pg_policies WHERE tablename = 'prospects' LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON prospects';
    END LOOP;
    
    -- Drop policies on staff
    FOR r IN SELECT policyname FROM pg_policies WHERE tablename = 'staff' LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON staff';
    END LOOP;
    
    -- Drop policies on activity_logs
    FOR r IN SELECT policyname FROM pg_policies WHERE tablename = 'activity_logs' LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON activity_logs';
    END LOOP;
    
    -- Drop policies on settings
    FOR r IN SELECT policyname FROM pg_policies WHERE tablename = 'settings' LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON settings';
    END LOOP;
END $$;

-- 3. Verify RLS is disabled - should show 'f' for all tables
SELECT 
    tablename,
    rowsecurity as "RLS Enabled"
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('prospects', 'staff', 'activity_logs', 'settings')
ORDER BY tablename;

-- 4. Check for existing policies (should return 0 rows)
SELECT 
    tablename,
    policyname,
    cmd as "Command",
    qual as "USING expression"
FROM pg_policies 
WHERE schemaname = 'public'
AND tablename IN ('prospects', 'staff', 'activity_logs', 'settings');

-- 5. Test queries (should all succeed)
SELECT 'Test 1: Staff query' as test, COUNT(*) as count FROM staff;
SELECT 'Test 2: Settings query' as test, COUNT(*) as count FROM settings;
SELECT 'Test 3: Activity logs query' as test, COUNT(*) as count FROM activity_logs;
SELECT 'Test 4: Prospects query' as test, COUNT(*) as count FROM prospects;

-- If all tests succeed, RLS is properly disabled!
