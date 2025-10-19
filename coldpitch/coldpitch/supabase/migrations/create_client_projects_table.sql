-- Create client_projects table for tracking client projects and renewals

CREATE TABLE IF NOT EXISTS client_projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id TEXT NOT NULL,
  client_name TEXT NOT NULL,
  project_name TEXT NOT NULL,
  project_type TEXT NOT NULL CHECK (project_type IN ('Website', 'Mobile App', 'Software', 'Hosting', 'Domain', 'Other')),
  description TEXT,
  amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
  renewal_type TEXT CHECK (renewal_type IN ('Domain', 'Hosting', 'Maintenance', 'License', 'None') OR renewal_type IS NULL),
  renewal_date TIMESTAMP WITH TIME ZONE,
  next_renewal_date TIMESTAMP WITH TIME ZONE,
  renewal_amount DECIMAL(12, 2) DEFAULT 0,
  renewal_status TEXT NOT NULL DEFAULT 'N/A' CHECK (renewal_status IN ('Pending', 'Paid', 'Overdue', 'Cancelled', 'N/A')),
  payment_status TEXT NOT NULL DEFAULT 'Unpaid' CHECK (payment_status IN ('Unpaid', 'Paid', 'Partial')),
  amount_paid DECIMAL(12, 2) DEFAULT 0,
  last_payment_date TIMESTAMP WITH TIME ZONE,
  auto_renew BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_client_projects_client_id ON client_projects(client_id);
CREATE INDEX IF NOT EXISTS idx_client_projects_renewal_status ON client_projects(renewal_status);
CREATE INDEX IF NOT EXISTS idx_client_projects_next_renewal_date ON client_projects(next_renewal_date);
CREATE INDEX IF NOT EXISTS idx_client_projects_created_at ON client_projects(created_at DESC);

-- Enable Row Level Security
ALTER TABLE client_projects ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to view all projects
CREATE POLICY "Allow authenticated users to view client projects"
  ON client_projects
  FOR SELECT
  TO authenticated
  USING (true);

-- Create policy to allow authenticated users to insert projects
CREATE POLICY "Allow authenticated users to insert client projects"
  ON client_projects
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create policy to allow authenticated users to update projects
CREATE POLICY "Allow authenticated users to update client projects"
  ON client_projects
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create policy to allow authenticated users to delete projects
CREATE POLICY "Allow authenticated users to delete client projects"
  ON client_projects
  FOR DELETE
  TO authenticated
  USING (true);

-- Add comment to table
COMMENT ON TABLE client_projects IS 'Stores client project information including renewal tracking for domains, hosting, and maintenance';

-- Add comments to important columns
COMMENT ON COLUMN client_projects.renewal_type IS 'Type of renewal: Domain, Hosting, Maintenance, License, or None';
COMMENT ON COLUMN client_projects.renewal_status IS 'Current renewal status: Pending, Paid, Overdue, Cancelled, or N/A';
COMMENT ON COLUMN client_projects.next_renewal_date IS 'Date when next renewal is due';
COMMENT ON COLUMN client_projects.auto_renew IS 'Whether automatic renewal is enabled';
