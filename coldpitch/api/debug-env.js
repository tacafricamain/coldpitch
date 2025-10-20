// Debug endpoint to check environment variables in production
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check all environment variables (without exposing sensitive data)
    const envStatus = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'unknown',
      variables: {
        VITE_SUPABASE_URL: {
          exists: !!process.env.VITE_SUPABASE_URL,
          length: process.env.VITE_SUPABASE_URL?.length || 0,
          preview: process.env.VITE_SUPABASE_URL?.substring(0, 30) + '...'
        },
        VITE_SUPABASE_ANON_KEY: {
          exists: !!process.env.VITE_SUPABASE_ANON_KEY,
          length: process.env.VITE_SUPABASE_ANON_KEY?.length || 0
        },
        SUPABASE_SERVICE_ROLE_KEY: {
          exists: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
          length: process.env.SUPABASE_SERVICE_ROLE_KEY?.length || 0
        },
        SENDGRID_API_KEY: {
          exists: !!process.env.SENDGRID_API_KEY,
          length: process.env.SENDGRID_API_KEY?.length || 0
        },
        SENDER_EMAIL: {
          exists: !!process.env.SENDER_EMAIL,
          value: process.env.SENDER_EMAIL // Safe to show email
        }
      }
    };

    console.log('🔍 Environment check requested:', envStatus);

    return res.status(200).json({
      success: true,
      message: 'Environment variables check',
      data: envStatus
    });

  } catch (error) {
    console.error('❌ Error checking environment:', error.message);
    return res.status(500).json({
      error: 'Failed to check environment',
      message: error.message
    });
  }
}