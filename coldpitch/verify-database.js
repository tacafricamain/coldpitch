// Database verification script
import { createClient } from '@supabase/supabase-js';

// You'll need to replace these with your actual values
const SUPABASE_URL = 'your-supabase-url';
const SUPABASE_ANON_KEY = 'your-supabase-anon-key';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function verifyDatabase() {
  console.log('🔍 Checking database contents...\n');
  
  try {
    // Check prospects table
    const { data: prospects, error: prospectsError } = await supabase
      .from('prospects')
      .select('*')
      .order('created_at', { ascending: false });
    
    console.log('📊 PROSPECTS TABLE:');
    console.log('   Error:', prospectsError);
    console.log('   Total Count:', prospects?.length || 0);
    
    if (prospects && prospects.length > 0) {
      console.log('   Records:');
      prospects.forEach((prospect, index) => {
        console.log(`   ${index + 1}. ${prospect.name} - ${prospect.email} (Created: ${prospect.created_at})`);
      });
    } else {
      console.log('   No prospects found in database');
    }
    
    console.log('\n' + '='.repeat(50) + '\n');
    
    // Check if table exists and structure
    const { data: tableInfo, error: tableError } = await supabase
      .from('prospects')
      .select('*')
      .limit(1);
    
    console.log('📋 TABLE STRUCTURE CHECK:');
    console.log('   Table accessible:', !tableError);
    if (tableError) {
      console.log('   Error:', tableError.message);
    }
    
  } catch (error) {
    console.error('❌ Database verification failed:', error);
  }
}

verifyDatabase();