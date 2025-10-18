# Supabase Database Setup Guide

## 1. Create Supabase Project
1. Go to https://supabase.com
2. Click "Start your project"
3. Create a new project (choose a region close to you)
4. Wait for the project to be provisioned (~2 minutes)

## 2. Get API Credentials
1. Go to Project Settings > API
2. Copy the following:
   - Project URL (looks like: https://xxxxx.supabase.co)
   - anon public key (starts with eyJ...)

## 3. Create .env.local file
Create `coldpitch/.env.local` with:
```
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

## 4. Create Database Tables
Go to SQL Editor in Supabase dashboard and run this SQL:

```sql
-- Create prospects table
CREATE TABLE prospects (
  id TEXT PRIMARY KEY DEFAULT ('P' || upper(substr(md5(random()::text), 1, 8))),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  whatsapp TEXT,
  company TEXT,
  role TEXT,
  website TEXT,
  country TEXT,
  state TEXT,
  niche TEXT,
  has_socials BOOLEAN DEFAULT false,
  social_links JSONB DEFAULT '{}',
  mode_of_reachout TEXT DEFAULT 'Email',
  status TEXT DEFAULT 'New',
  tags TEXT[] DEFAULT '{}',
  source TEXT,
  generated_pitch TEXT,
  website_analysis JSONB,
  avatar_seed TEXT,
  date_added DATE DEFAULT CURRENT_DATE,
  last_activity DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index for faster queries
CREATE INDEX idx_prospects_status ON prospects(status);
CREATE INDEX idx_prospects_date_added ON prospects(date_added DESC);
CREATE INDEX idx_prospects_email ON prospects(email);

-- Enable Row Level Security (RLS)
ALTER TABLE prospects ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations for authenticated users
-- For development, we'll allow all operations for now
CREATE POLICY "Enable all operations for all users" ON prospects
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_prospects_updated_at BEFORE UPDATE ON prospects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## 5. Install Supabase Client
Run in your terminal:
```bash
cd coldpitch
npm install @supabase/supabase-js
```

## 6. Seed Sample Data (Optional)
```sql
INSERT INTO prospects (name, email, phone, company, role, country, state, niche, has_socials, social_links, mode_of_reachout, status, tags, source, avatar_seed)
VALUES 
  ('Brooklyn Simmons', 'brooklyn.simmons@example.com', '+1 (555) 123-4567', 'Tech Corp', 'Marketing Director', 'Nigeria', 'Lagos', 'Technology', true, '{"linkedin": "https://linkedin.com/in/brooklyn-simmons"}', 'Email', 'Contacted', ARRAY['hot-lead', 'enterprise'], 'LinkedIn', 'brooklyn-simmons'),
  ('Anthony Johnson', 'anthony.j@example.com', '+1 (555) 234-5678', 'StartupXYZ', 'CEO', 'Nigeria', 'Abuja', 'SaaS', false, '{}', 'Email', 'New', ARRAY['startup', 'saas'], 'Cold Email', 'anthony-johnson'),
  ('Sarah Miller', 'sarah.miller@example.com', '+1 (555) 345-6789', 'Enterprise Solutions', 'VP of Sales', 'Nigeria', 'Rivers', 'Enterprise Software', true, '{"linkedin": "https://linkedin.com/in/sarah-miller", "twitter": "https://twitter.com/sarahmiller"}', 'LinkedIn', 'Qualified', ARRAY['enterprise', 'decision-maker'], 'Referral', 'sarah-miller');
```

## 7. Verify Setup
1. Go to Table Editor in Supabase
2. You should see the `prospects` table
3. If you ran the seed data, you should see 3 sample prospects

## 8. Test Connection
After setting up .env.local and installing the package, restart your dev server:
```bash
npm run dev
```

The app will automatically connect to Supabase!
