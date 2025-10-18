-- Create staff table
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

-- Create activity_logs table
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

-- Add user_id to prospects table to track who added each lead
ALTER TABLE prospects 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES staff(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS added_by TEXT;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_timestamp ON activity_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_prospects_user_id ON prospects(user_id);
CREATE INDEX IF NOT EXISTS idx_staff_email ON staff(email);

-- Enable Row Level Security
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Create policies (allow all for now, you can restrict later)
CREATE POLICY "Enable read access for all users" ON staff FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON staff FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON staff FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON staff FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON activity_logs FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON activity_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON activity_logs FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON activity_logs FOR DELETE USING (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for staff table
DROP TRIGGER IF EXISTS update_staff_updated_at ON staff;
CREATE TRIGGER update_staff_updated_at
    BEFORE UPDATE ON staff
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample staff members
INSERT INTO staff (name, email, role, avatar_seed, total_leads_added, login_times) VALUES
('Admin User', 'hello@spex.com.ng', 'Admin', 'admin', 0, ARRAY[NOW() - INTERVAL '2 hours']::TIMESTAMPTZ[]),
('John Doe', 'john@spex.com.ng', 'Sales Manager', 'john', 0, ARRAY[NOW() - INTERVAL '1 hour', NOW() - INTERVAL '3 hours']::TIMESTAMPTZ[]),
('Sarah Smith', 'sarah@spex.com.ng', 'Sales Rep', 'sarah', 0, ARRAY[NOW() - INTERVAL '30 minutes']::TIMESTAMPTZ[]),
('Mike Johnson', 'mike@spex.com.ng', 'Sales Rep', 'mike', 0, ARRAY[NOW() - INTERVAL '45 minutes', NOW() - INTERVAL '4 hours']::TIMESTAMPTZ[])
ON CONFLICT (email) DO NOTHING;
