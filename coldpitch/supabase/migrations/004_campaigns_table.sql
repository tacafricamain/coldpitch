-- Create campaigns table
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL CHECK (status IN ('Draft', 'Active', 'Paused', 'Completed')),
    type VARCHAR(50) NOT NULL CHECK (type IN ('Email', 'LinkedIn', 'Multi-Channel')),
    subject TEXT,
    body TEXT NOT NULL,
    prospect_ids UUID[] DEFAULT '{}',
    created_by UUID NOT NULL REFERENCES staff(id),
    created_by_name VARCHAR(255) NOT NULL,
    scheduled_date TIMESTAMPTZ,
    sent_at TIMESTAMPTZ,
    sent INTEGER DEFAULT 0,
    opened INTEGER DEFAULT 0,
    replied INTEGER DEFAULT 0,
    converted INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);
CREATE INDEX IF NOT EXISTS idx_campaigns_created_by ON campaigns(created_by);
CREATE INDEX IF NOT EXISTS idx_campaigns_created_at ON campaigns(created_at DESC);

-- Disable RLS for now (or add policies if needed)
ALTER TABLE campaigns DISABLE ROW LEVEL SECURITY;

-- Grant permissions to anon and authenticated roles
GRANT ALL ON campaigns TO anon;
GRANT ALL ON campaigns TO authenticated;

-- Add comment
COMMENT ON TABLE campaigns IS 'Stores email and outreach campaigns';

-- Verify table creation
SELECT 
    column_name, 
    data_type, 
    is_nullable 
FROM information_schema.columns 
WHERE table_name = 'campaigns'
ORDER BY ordinal_position;
