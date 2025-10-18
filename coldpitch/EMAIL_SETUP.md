# Email Integration Setup Guide

## Current Status
✅ Email functionality is built and simulated
✅ Console logs show email content
✅ Password modal displays credentials to admin
⏳ Real email sending is ready to activate (commented out)

## How It Works Now

When you add a new staff member:
1. ✅ A secure 12-character password is automatically generated
2. ✅ The password is displayed in a modal for the admin to copy
3. ✅ Email content is logged to console (simulating email send)
4. ✅ Staff member details are saved to database
5. ✅ Activity is logged

## Enable Real Email Sending (SendGrid)

### Step 1: Get SendGrid API Key
1. Sign up at https://sendgrid.com/ (Free tier: 100 emails/day)
2. Go to Settings > API Keys
3. Create a new API key with "Mail Send" permissions
4. Copy the API key (starts with `SG.`)

### Step 2: Add Environment Variable
Create/edit `.env` file in `coldpitch` folder:
```env
VITE_SENDGRID_API_KEY=SG.your_api_key_here
```

### Step 3: Verify Sender Email
1. In SendGrid dashboard, go to Settings > Sender Authentication
2. Verify `noreply@spex.com.ng` (or use your domain)
3. Alternative: Use Single Sender Verification for testing

### Step 4: Uncomment Email Code
In `src/services/staffService.ts`, uncomment lines 46-62:

```typescript
const apiKey = import.meta.env.VITE_SENDGRID_API_KEY;
if (apiKey) {
  sgMail.setApiKey(apiKey);
  
  await sgMail.send({
    to: email,
    from: 'noreply@spex.com.ng', // Must be verified in SendGrid
    subject: 'Welcome to ColdPitch - Your Login Credentials',
    html: `
      <h1>Welcome to ColdPitch, ${name}!</h1>
      <p>Your account has been created successfully.</p>
      <h3>Your Login Details:</h3>
      <p><strong>Login URL:</strong> ${window.location.origin}/login</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Temporary Password:</strong> <code>${password}</code></p>
      <p><em>Please change your password after your first login.</em></p>
      <br>
      <p>Best regards,<br>The ColdPitch Team</p>
    `
  });
}
```

### Step 5: Restart Dev Server
```bash
npm run dev
```

## Alternative Email Services

### Resend (Recommended - Modern, Simple)
```bash
npm install resend
```

```typescript
import { Resend } from 'resend';

const resend = new Resend(import.meta.env.VITE_RESEND_API_KEY);

await resend.emails.send({
  from: 'ColdPitch <onboarding@spex.com.ng>',
  to: email,
  subject: 'Welcome to ColdPitch - Your Login Credentials',
  html: `...`
});
```

### Mailgun
```bash
npm install mailgun.js form-data
```

### AWS SES (Enterprise)
```bash
npm install @aws-sdk/client-ses
```

## Email Template Customization

The email template can be improved with:
- Company logo
- Better HTML formatting
- Password reset link (instead of showing password)
- Welcome video/tutorial link
- Support contact information

## Testing

1. **Test Mode**: Current setup (console logs only)
2. **SendGrid Test**: Use your own email first
3. **Production**: Update sender email to company domain

## Security Notes

⚠️ **Important:**
- Never commit `.env` file to git (already in .gitignore)
- Use environment variables for API keys
- Consider password reset links instead of sending passwords
- Enable 2FA for email service accounts
- Monitor email sending quotas

## Troubleshooting

### Email not sending
1. Check API key is correct
2. Verify sender email in SendGrid
3. Check console for errors
4. Verify environment variable is loaded

### Email goes to spam
1. Set up SPF, DKIM, DMARC records
2. Use verified domain (not gmail/yahoo)
3. Warm up sender reputation gradually
4. Add unsubscribe link

### Rate limits
- SendGrid Free: 100 emails/day
- SendGrid Essentials: 40,000 emails/month ($15/mo)
- Consider bulk sending in batches

## Password Security Best Practices

Instead of emailing passwords, consider:
1. **Password Reset Link**: Send a time-limited magic link
2. **One-Time Password**: Send OTP for first login
3. **SSO Integration**: Use Google/Microsoft auth
4. **Manual Setup**: Admin shares credentials in person

## Next Steps

1. ✅ Test current system (password modal works)
2. Set up SendGrid account
3. Verify sender email
4. Add API key to .env
5. Uncomment email code
6. Test with your own email
7. Deploy and use with real staff

---

**Current Demo Mode:**
- Console logs simulate email
- Admin sees password in modal
- Staff can be manually given credentials
- Perfect for development/testing
