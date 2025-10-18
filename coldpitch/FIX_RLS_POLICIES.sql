
DROP POLICY IF EXISTS "Enable read access for all users" ON staff;
DROP POLICY IF EXISTS "Enable insert access for all users" ON staff;
DROP POLICY IF EXISTS "Enable update access for all users" ON staff;
DROP POLICY IF EXISTS "Enable delete access for all users" ON staff;

DROP POLICY IF EXISTS "Enable read access for all users" ON activity_logs;
DROP POLICY IF EXISTS "Enable insert access for all users" ON activity_logs;
DROP POLICY IF EXISTS "Enable update access for all users" ON activity_logs;
DROP POLICY IF EXISTS "Enable delete access for all users" ON activity_logs;

DROP POLICY IF EXISTS "Enable read access for all users" ON settings;
DROP POLICY IF EXISTS "Enable insert access for all users" ON settings;
DROP POLICY IF EXISTS "Enable update access for all users" ON settings;
DROP POLICY IF EXISTS "Enable delete access for all users" ON settings;

-- Create new policies
-- Staff table policies
CREATE POLICY "Allow all for staff" ON staff FOR ALL USING (true) WITH CHECK (true);

-- Activity logs policies
CREATE POLICY "Allow all for activity_logs" ON activity_logs FOR ALL USING (true) WITH CHECK (true);

-- Settings table policies
CREATE POLICY "Allow all for settings" ON settings FOR ALL USING (true) WITH CHECK (true);