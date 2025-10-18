// Vercel Serverless Function for sending staff credentials
const sgMail = require('@sendgrid/mail');

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

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { to, name, password, loginUrl } = req.body;

    // Validation
    if (!to || !name || !password || !loginUrl) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['to', 'name', 'password', 'loginUrl']
      });
    }

    // Set SendGrid API Key from environment variable
    const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
    if (!SENDGRID_API_KEY) {
      console.error('❌ SENDGRID_API_KEY not found in environment variables');
      return res.status(500).json({ error: 'Email service not configured' });
    }
    sgMail.setApiKey(SENDGRID_API_KEY);

    // Email content
    const msg = {
      to: to,
      from: process.env.SENDER_EMAIL || 'hi@spex.com.ng', // Must be verified in SendGrid!
      subject: 'Welcome to ColdPitch - Your Login Credentials',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border: 1px solid #ddd; }
            .credentials { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
            .credential-item { margin: 10px 0; }
            .credential-label { font-weight: bold; color: #667eea; }
            .password { background: #fff3cd; padding: 10px; border-radius: 4px; font-family: monospace; font-size: 16px; letter-spacing: 1px; }
            .footer { background: #333; color: white; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 12px; }
            .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to ColdPitch! 🚀</h1>
            </div>
            <div class="content">
              <p>Hello <strong>${name}</strong>,</p>
              <p>Welcome to the ColdPitch team! Your account has been created successfully and you're all set to start using our platform.</p>
              
              <div class="credentials">
                <h3>Your Login Credentials</h3>
                <div class="credential-item">
                  <span class="credential-label">Login URL:</span><br>
                  <a href="${loginUrl}" class="button">Login to ColdPitch</a>
                </div>
                <div class="credential-item">
                  <span class="credential-label">Email Address:</span><br>
                  ${to}
                </div>
                <div class="credential-item">
                  <span class="credential-label">Temporary Password:</span><br>
                  <div class="password">${password}</div>
                </div>
              </div>
              
              <div class="warning">
                <strong>⚠️ Important Security Notice:</strong><br>
                Please change your password immediately after your first login for security reasons.
              </div>
              
              <p>If you have any questions or need assistance, please don't hesitate to contact your administrator.</p>
              
              <p>We're excited to have you on board!</p>
              
              <p>Best regards,<br>
              <strong>The ColdPitch Team</strong></p>
            </div>
            <div class="footer">
              <p>This is an automated message. Please do not reply to this email.</p>
              <p>&copy; ${new Date().getFullYear()} ColdPitch. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
Hello ${name},

Welcome to the ColdPitch team! Your account has been created successfully.

Your Login Details:
• Login URL: ${loginUrl}
• Email: ${to}
• Temporary Password: ${password}

For security reasons, please change your password immediately after your first login.

If you have any questions, please contact your administrator.

Best regards,
The ColdPitch Team
      `
    };

    // Send email
    await sgMail.send(msg);

    console.log(`✅ Email sent successfully to ${to}`);
    return res.status(200).json({ 
      success: true, 
      message: `Email sent to ${to}` 
    });

  } catch (error) {
    console.error('❌ Error sending email:', error.response?.body || error.message);
    return res.status(500).json({ 
      error: 'Failed to send email',
      message: error.message,
      details: error.response?.body?.errors || []
    });
  }
}
