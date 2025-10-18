import { supabase } from '../lib/supabase';
import type { Staff, ActivityLog } from '../types';
// SendGrid requires server-side API calls - cannot be used directly from browser
// import sgMail from '@sendgrid/mail';

// Generate a secure random password
const generatePassword = (length: number = 12): string => {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
};

// Email sending function with SendGrid
const sendCredentialsEmail = async (email: string, password: string, name: string): Promise<void> => {
  // Console log for demo (simulating email sent)
  console.log(`
    ========================================
    📧 CREDENTIALS EMAIL SENT
    ========================================
    To: ${email}
    Subject: Welcome to ColdPitch - Your Login Credentials
    
    Hello ${name},
    
    Welcome to the ColdPitch team! Your account has been created successfully.
    
    Your Login Details:
    • Login URL: ${window.location.origin}/login
    • Email: ${email}
    • Temporary Password: ${password}
    
    For security reasons, please change your password immediately after your first login.
    
    If you have any questions, please contact your administrator.
    
    Best regards,
    The ColdPitch Team
    ========================================
  `);
  
  // Send email via serverless function (works locally and on Vercel)
  try {
    // Use relative URL for serverless function (works in both dev and production)
    const apiUrl = import.meta.env.DEV 
      ? 'http://localhost:3001/api/send-credentials'  // Local development
      : '/api/send-credentials';  // Production (Vercel serverless)
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: email,
        name: name,
        password: password,
        loginUrl: `${window.location.origin}/login`
      })
    });

    if (response.ok) {
      const data = await response.json();
      console.log(`✅ Email successfully sent to ${email}`, data);
    } else {
      const error = await response.json();
      console.warn('⚠️ Email sending failed:', error.message || 'Unknown error');
    }
  } catch (error: any) {
    console.warn('⚠️ Email backend not running. Start email-backend server:', error.message);
    console.info('💡 To enable emails: cd email-backend && npm install && npm start');
    // Don't throw - staff is created, just email failed
  }

  // Alternative: For now, use the password modal to share credentials manually
  // This is actually more secure than emailing passwords!
  
  /* BROWSER-SIDE EMAIL WON'T WORK - CORS ISSUE
  // SendGrid integration - Send real email
  try {
    const apiKey = import.meta.env.VITE_SENDGRID_API_KEY;
    if (apiKey) {
      sgMail.setApiKey(apiKey);
      
      await sgMail.send({
        to: email,
        from: 'noreply@spex.com.ng', // Change this to your verified sender email
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
                    <a href="${window.location.origin}/login" class="button">Login to ColdPitch</a>
                  </div>
                  <div class="credential-item">
                    <span class="credential-label">Email Address:</span><br>
                    ${email}
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
• Login URL: ${window.location.origin}/login
• Email: ${email}
• Temporary Password: ${password}

For security reasons, please change your password immediately after your first login.

If you have any questions, please contact your administrator.

Best regards,
The ColdPitch Team
        `
      });
      
      console.log(`✅ Email successfully sent to ${email}`);
    } else {
      console.warn('⚠️ VITE_SENDGRID_API_KEY not found. Email not sent.');
    }
  } catch (error) {
    console.error('❌ Failed to send email:', error);
    throw error; // Re-throw so the calling function knows it failed
  }
  */
};

export const staffService = {
  // Get all staff members
  async getAllStaff(): Promise<Staff[]> {
    const { data, error } = await supabase
      .from('staff')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).map(staff => ({
      ...staff,
      avatarUrl: staff.avatar_seed 
        ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${staff.avatar_seed}`
        : undefined,
    }));
  },

  // Get a single staff member
  async getStaff(id: string): Promise<Staff> {
    const { data, error } = await supabase
      .from('staff')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    return {
      ...data,
      avatarUrl: data.avatar_seed 
        ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.avatar_seed}`
        : undefined,
    };
  },

  // Create a new staff member
  async createStaff(staffData: Partial<Staff>, currentUserId?: string, currentUserName?: string): Promise<{ staff: Staff; password: string }> {
    const avatar_seed = staffData.name?.toLowerCase().replace(/\s+/g, '') || Math.random().toString(36).substring(7);
    const password = generatePassword(12);
    
    const { data, error } = await supabase
      .from('staff')
      .insert([{
        ...staffData,
        avatar_seed,
        login_times: [],
        total_leads_added: 0,
        status: 'active',
      }])
      .select()
      .single();

    if (error) throw error;

    // Log the activity (non-fatal if it fails)
    if (currentUserId && currentUserName) {
      try {
        await staffService.createActivityLog({
          user_id: currentUserId,
          user_name: currentUserName,
          action: 'added new staff member',
          entity_type: 'staff',
          entity_id: data.id,
          details: { 
            name: staffData.name, 
            email: staffData.email, 
            role: staffData.role 
          },
        });
      } catch (logError) {
        console.warn('Failed to log activity (non-fatal):', logError);
      }
    }

    // Send credentials email
    try {
      await sendCredentialsEmail(data.email, password, data.name);
    } catch (emailError) {
      console.error('Failed to send credentials email:', emailError);
      // Don't throw - staff is created, just log the error
    }

    return {
      staff: {
        ...data,
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${avatar_seed}`,
      },
      password,
    };
  },

  // Update a staff member
  async updateStaff(id: string, staffData: Partial<Staff>, currentUserId?: string, currentUserName?: string): Promise<Staff> {
    const { data, error } = await supabase
      .from('staff')
      .update(staffData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Log the activity (non-fatal if it fails)
    if (currentUserId && currentUserName) {
      try {
        await staffService.createActivityLog({
          user_id: currentUserId,
          user_name: currentUserName,
          action: 'updated staff member',
          entity_type: 'staff',
          entity_id: id,
          details: { 
            name: staffData.name, 
            role: staffData.role 
          },
        });
      } catch (logError) {
        console.warn('Failed to log activity (non-fatal):', logError);
      }
    }

    return {
      ...data,
      avatarUrl: data.avatar_seed 
        ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.avatar_seed}`
        : undefined,
    };
  },

  // Delete a staff member
  async deleteStaff(id: string, currentUserId?: string, currentUserName?: string): Promise<void> {
    // Get staff info before deleting for activity log
    const { data: staffToDelete } = await supabase
      .from('staff')
      .select('name, email')
      .eq('id', id)
      .single();

    // Log the activity BEFORE deleting (to avoid foreign key constraint)
    if (currentUserId && currentUserName && staffToDelete) {
      try {
        await staffService.createActivityLog({
          user_id: currentUserId,
          user_name: currentUserName,
          action: 'deleted staff member',
          entity_type: 'staff',
          entity_id: id,
          details: { 
            name: staffToDelete.name, 
            email: staffToDelete.email 
          },
        });
      } catch (logError) {
        console.warn('Failed to log activity (non-fatal):', logError);
      }
    }

    // Now delete the staff member
    const { error } = await supabase
      .from('staff')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Record a login time
  async recordLogin(id: string, userName: string): Promise<void> {
    const { data: staff } = await supabase
      .from('staff')
      .select('login_times')
      .eq('id', id)
      .single();

    const loginTimes = staff?.login_times || [];
    loginTimes.push(new Date().toISOString());

    const { error } = await supabase
      .from('staff')
      .update({ login_times: loginTimes })
      .eq('id', id);

    if (error) throw error;

    // Log the login activity
    await staffService.createActivityLog({
      user_id: id,
      user_name: userName,
      action: 'logged in',
      entity_type: 'staff',
      entity_id: id,
      details: { timestamp: new Date().toISOString() },
    });
  },

  // Record a logout
  async recordLogout(id: string, userName: string): Promise<void> {
    // Log the logout activity
    await staffService.createActivityLog({
      user_id: id,
      user_name: userName,
      action: 'logged out',
      entity_type: 'staff',
      entity_id: id,
      details: { timestamp: new Date().toISOString() },
    });
  },

  // Get activity logs for a staff member
  async getActivityLogs(userId?: string, limit: number = 50): Promise<ActivityLog[]> {
    let query = supabase
      .from('activity_logs')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(limit);

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query;

    if (error) throw error;

    return data || [];
  },

  // Create an activity log
  async createActivityLog(log: Partial<ActivityLog>): Promise<ActivityLog> {
    const { data, error } = await supabase
      .from('activity_logs')
      .insert([log])
      .select()
      .single();

    if (error) throw error;

    return data;
  },

  // Get leads added by a staff member
  async getLeadsAddedByStaff(userId: string): Promise<number> {
    const { count, error } = await supabase
      .from('prospects')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (error) throw error;

    return count || 0;
  },

  // Get staff statistics
  async getStaffStats(userId: string): Promise<{
    totalLeads: number;
    lastLogin: string | null;
    loginCount: number;
    recentActivity: ActivityLog[];
  }> {
    const [staff, leadsCount, recentActivity] = await Promise.all([
      staffService.getStaff(userId),
      staffService.getLeadsAddedByStaff(userId),
      staffService.getActivityLogs(userId, 10),
    ]);

    return {
      totalLeads: leadsCount,
      lastLogin: staff.login_times?.[staff.login_times.length - 1] || null,
      loginCount: staff.login_times?.length || 0,
      recentActivity,
    };
  },
};
