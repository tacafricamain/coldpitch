// Production Environment Diagnostics
// Add this to check if environment variables are properly set in production

export const runProductionDiagnostics = () => {
  console.log('🔍 PRODUCTION DIAGNOSTICS');
  console.log('========================');
  
  // Environment info
  console.log('📍 Environment Info:');
  console.log('   - Mode:', import.meta.env.MODE);
  console.log('   - Prod:', import.meta.env.PROD);
  console.log('   - Dev:', import.meta.env.DEV);
  
  // Supabase Configuration
  console.log('\n📊 Supabase Configuration:');
  console.log('   - URL exists:', !!import.meta.env.VITE_SUPABASE_URL);
  console.log('   - URL value:', import.meta.env.VITE_SUPABASE_URL?.substring(0, 30) + '...');
  console.log('   - Anon Key exists:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);
  console.log('   - Anon Key length:', import.meta.env.VITE_SUPABASE_ANON_KEY?.length || 0);
  
  // Window location
  console.log('\n🌐 Location Info:');
  console.log('   - Origin:', window.location.origin);
  console.log('   - Hostname:', window.location.hostname);
  console.log('   - Protocol:', window.location.protocol);
  
  // API endpoints
  console.log('\n🔗 API Endpoints:');
  console.log('   - Send Credentials:', `${window.location.origin}/api/send-credentials`);
  console.log('   - Delete Auth User:', `${window.location.origin}/api/delete-auth-user`);
  
  console.log('========================\n');
};

// Auto-run in production
if (import.meta.env.PROD) {
  console.log('🚨 PRODUCTION MODE DETECTED - Running diagnostics...');
  runProductionDiagnostics();
}