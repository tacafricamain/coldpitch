-- Create clients and invoices tables
-- Run this in Supabase SQL Editor

-- ============ CLIENTS TABLE ============
CREATE TABLE IF NOT EXISTS clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    company VARCHAR(255),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100) DEFAULT 'Nigeria',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for clients
CREATE INDEX IF NOT EXISTS idx_clients_name ON clients(name);
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);
CREATE INDEX IF NOT EXISTS idx_clients_company ON clients(company);

-- ============ INVOICES TABLE ============
CREATE TABLE IF NOT EXISTS invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE RESTRICT,
    client_name VARCHAR(255) NOT NULL,
    client_email VARCHAR(255) NOT NULL,
    client_company VARCHAR(255),
    client_address TEXT,
    
    -- Line items stored as JSONB
    items JSONB NOT NULL DEFAULT '[]',
    
    -- Financial fields (in Naira)
    subtotal DECIMAL(15, 2) NOT NULL DEFAULT 0,
    tax_rate DECIMAL(5, 2) DEFAULT 0,
    tax_amount DECIMAL(15, 2) DEFAULT 0,
    discount DECIMAL(15, 2) DEFAULT 0,
    total DECIMAL(15, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'NGN' CHECK (currency = 'NGN'),
    
    -- Status tracking
    status VARCHAR(50) NOT NULL CHECK (status IN ('Draft', 'Sent', 'Paid', 'Overdue', 'Cancelled')),
    payment_status VARCHAR(50) NOT NULL CHECK (payment_status IN ('Unpaid', 'Partial', 'Paid')),
    
    -- Payment tracking
    amount_paid DECIMAL(15, 2) DEFAULT 0,
    balance_due DECIMAL(15, 2) NOT NULL,
    
    -- Dates
    issue_date TIMESTAMPTZ NOT NULL,
    due_date TIMESTAMPTZ NOT NULL,
    paid_date TIMESTAMPTZ,
    
    -- Payment details
    payment_method VARCHAR(100),
    
    -- Additional info
    notes TEXT,
    terms TEXT,
    
    -- Creator tracking
    created_by UUID NOT NULL REFERENCES staff(id),
    created_by_name VARCHAR(255) NOT NULL,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for invoices
CREATE INDEX IF NOT EXISTS idx_invoices_invoice_number ON invoices(invoice_number);
CREATE INDEX IF NOT EXISTS idx_invoices_client_id ON invoices(client_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_payment_status ON invoices(payment_status);
CREATE INDEX IF NOT EXISTS idx_invoices_created_by ON invoices(created_by);
CREATE INDEX IF NOT EXISTS idx_invoices_issue_date ON invoices(issue_date DESC);
CREATE INDEX IF NOT EXISTS idx_invoices_due_date ON invoices(due_date);

-- ============ PERMISSIONS ============

-- Disable RLS for now
ALTER TABLE clients DISABLE ROW LEVEL SECURITY;
ALTER TABLE invoices DISABLE ROW LEVEL SECURITY;

-- Grant permissions to anon and authenticated roles
GRANT ALL ON clients TO anon;
GRANT ALL ON clients TO authenticated;
GRANT ALL ON invoices TO anon;
GRANT ALL ON invoices TO authenticated;

-- ============ FUNCTIONS ============

-- Function to automatically update invoice status to Overdue
CREATE OR REPLACE FUNCTION update_overdue_invoices()
RETURNS void AS $$
BEGIN
    UPDATE invoices
    SET status = 'Overdue'
    WHERE due_date < NOW()
    AND payment_status != 'Paid'
    AND status NOT IN ('Paid', 'Cancelled', 'Overdue');
END;
$$ LANGUAGE plpgsql;

-- ============ SAMPLE DATA ============

-- Insert sample clients (optional - comment out if not needed)
INSERT INTO clients (name, email, phone, company, address, city, state, country)
VALUES 
    ('Acme Corporation', 'contact@acme.com', '+234 803 123 4567', 'Acme Corp', '123 Business Street', 'Lagos', 'Lagos State', 'Nigeria'),
    ('Tech Solutions Ltd', 'info@techsolutions.com', '+234 805 987 6543', 'Tech Solutions', '456 Innovation Drive', 'Abuja', 'FCT', 'Nigeria'),
    ('Global Ventures', 'hello@globalventures.com', '+234 807 111 2222', 'Global Ventures Inc', '789 Enterprise Avenue', 'Port Harcourt', 'Rivers State', 'Nigeria')
ON CONFLICT DO NOTHING;

-- ============ VERIFICATION ============

-- Verify tables were created
SELECT 
    table_name,
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public' 
AND table_name IN ('clients', 'invoices')
ORDER BY table_name;

-- Show clients table structure
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'clients'
ORDER BY ordinal_position;

-- Show invoices table structure  
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'invoices'
ORDER BY ordinal_position;

-- Show sample clients
SELECT id, name, company, email FROM clients LIMIT 5;
