// Test Supabase Connection
import { supabase } from './src/lib/supabase.ts';

async function testConnection() {
  console.log('Testing Supabase connection...\n');
  
  // Test 1: Check connection
  const { data: testData, error: testError } = await supabase
    .from('staff')
    .select('*')
    .limit(1);
  
  if (testError) {
    console.error('❌ Connection failed:', testError.message);
    return;
  }
  
  console.log('✅ Connected to Supabase!\n');
  
  // Test 2: Check if admin user exists
  console.log('Checking for admin user (hello@spex.com.ng)...');
  const { data: adminUser, error: adminError } = await supabase
    .from('staff')
    .select('id, name, email, role')
    .eq('email', 'hello@spex.com.ng')
    .single();
  
  if (adminError) {
    console.error('❌ Admin user not found:', adminError.message);
    console.log('\nPlease run the migration: supabase/migrations/002_staff_and_activity.sql');
    return;
  }
  
  console.log('✅ Admin user found:');
  console.log('   ID:', adminUser.id);
  console.log('   Name:', adminUser.name);
  console.log('   Email:', adminUser.email);
  console.log('   Role:', adminUser.role);
  
  // Test 3: Check if settings table exists
  console.log('\nChecking settings table...');
  const { data: settingsData, error: settingsError } = await supabase
    .from('settings')
    .select('*')
    .eq('user_id', adminUser.id)
    .single();
  
  if (settingsError && settingsError.code !== 'PGRST116') {
    console.error('❌ Settings table error:', settingsError.message);
  } else if (!settingsData) {
    console.log('⚠️  No settings found for admin user (this is OK, will be created on first visit)');
  } else {
    console.log('✅ Settings found for admin user');
  }
  
  // Test 4: Check prospects table
  console.log('\nChecking prospects table...');
  const { data: prospects, error: prospectsError } = await supabase
    .from('prospects')
    .select('id, name, email')
    .limit(3);
  
  if (prospectsError) {
    console.error('❌ Prospects table error:', prospectsError.message);
  } else {
    console.log(`✅ Prospects table accessible (${prospects?.length || 0} prospects found)`);
  }
  
  // Test 5: Check activity_logs table
  console.log('\nChecking activity_logs table...');
  const { data: activities, error: activitiesError } = await supabase
    .from('activity_logs')
    .select('id, action, user_name')
    .limit(3);
  
  if (activitiesError) {
    console.error('❌ Activity logs table error:', activitiesError.message);
  } else {
    console.log(`✅ Activity logs table accessible (${activities?.length || 0} activities found)`);
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('Test complete!');
}

testConnection();
