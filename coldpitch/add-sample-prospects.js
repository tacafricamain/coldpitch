// Script to add sample prospects for testing
import { createClient } from '@supabase/supabase-js';

// Replace with your actual Supabase credentials
const supabase = createClient(
  'your-supabase-url', 
  'your-supabase-anon-key'
);

const sampleProspects = [
  {
    name: 'John Smith',
    email: 'john.smith@example.com',
    company: 'Tech Corp',
    position: 'CEO',
    phone: '+1-555-0101',
    industry: 'Technology',
    status: 'new',
    notes: 'Interested in our services'
  },
  {
    name: 'Sarah Johnson',
    email: 'sarah.j@company.com',
    company: 'Marketing Inc',
    position: 'Marketing Director',
    phone: '+1-555-0102',
    industry: 'Marketing',
    status: 'contacted',
    notes: 'Follow up next week'
  },
  {
    name: 'Michael Brown',
    email: 'mbrown@business.com',
    company: 'Business Solutions',
    position: 'VP Sales',
    phone: '+1-555-0103',
    industry: 'Consulting',
    status: 'qualified',
    notes: 'Ready for proposal'
  },
  {
    name: 'Emily Davis',
    email: 'emily.davis@startup.io',
    company: 'Startup Inc',
    position: 'Founder',
    phone: '+1-555-0104',
    industry: 'Technology',
    status: 'new',
    notes: 'Met at conference'
  },
  {
    name: 'Robert Wilson',
    email: 'rwilson@enterprise.com',
    company: 'Enterprise Corp',
    position: 'CTO',
    phone: '+1-555-0105',
    industry: 'Technology',
    status: 'contacted',
    notes: 'Scheduled demo'
  }
];

async function addSampleProspects() {
  console.log('📝 Adding sample prospects...');
  
  try {
    const { data, error } = await supabase
      .from('prospects')
      .insert(sampleProspects)
      .select();
    
    if (error) {
      console.error('❌ Error adding prospects:', error);
    } else {
      console.log('✅ Successfully added prospects:', data?.length);
      console.log('📊 Sample prospects created');
    }
  } catch (error) {
    console.error('❌ Failed to add prospects:', error);
  }
}

addSampleProspects();