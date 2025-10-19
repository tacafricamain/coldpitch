// Vercel Serverless Function for deleting auth users
// This requires service role key which shouldn't be exposed to the client

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST (we use POST to delete for better body support)
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId } = req.body;

    // Validation
    if (!userId) {
      return res.status(400).json({ 
        error: 'Missing required field: userId'
      });
    }

    // Get Supabase credentials
    const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      console.error('❌ Supabase credentials not found in environment variables');
      return res.status(500).json({ 
        error: 'Server configuration error',
        details: 'Supabase credentials not configured'
      });
    }

    console.log('🗑️ Deleting auth user:', userId);

    // Delete user using Admin API
    const deleteResponse = await fetch(`${SUPABASE_URL}/auth/v1/admin/users/${userId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
        'Content-Type': 'application/json',
      },
    });

    if (!deleteResponse.ok) {
      const errorText = await deleteResponse.text();
      console.error('❌ Failed to delete auth user:', errorText);
      
      return res.status(deleteResponse.status).json({ 
        error: 'Failed to delete auth user',
        details: errorText,
        status: deleteResponse.status
      });
    }

    console.log(`✅ Auth user deleted successfully: ${userId}`);
    
    return res.status(200).json({ 
      success: true, 
      message: `Auth user ${userId} deleted successfully` 
    });

  } catch (error) {
    console.error('❌ Error deleting auth user:', error.message);
    return res.status(500).json({ 
      error: 'Failed to delete auth user',
      message: error.message
    });
  }
}
