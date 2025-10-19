# Email API 500 Error - Debugging Guide

## 🔴 Current Issue

```
Failed to load resource: the server responded with a status of 500 ()
⚠️ Email backend not running. Start email-backend server: Unexpected token 'A', "A server e"... is not valid JSON
```

## Root Cause

The Vercel serverless function `/api/send-credentials` is returning a 500 error, and the response is HTML (not JSON). This typically means:

1. **Missing environment variable** - `SENDGRID_API_KEY` is not set
2. **SendGrid API key invalid** - Key is expired or incorrect
3. **Sender email not verified** - SendGrid rejects unverified senders
4. **Module not installed** - `@sendgrid/mail` package missing

## 🔍 How to Debug

### Step 1: Check Vercel Logs

1. Go to: https://vercel.com/tacafrica016gmailcoms-projects/spexcoldpitch/logs

2. Look for recent errors when you tried to create a staff member

3. You'll see the actual error message from the serverless function

### Step 2: Verify Environment Variables

1. Go to: https://vercel.com/tacafrica016gmailcoms-projects/spexcoldpitch/settings/environment-variables

2. Check these variables exist:
   ```
   SENDGRID_API_KEY = SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   SENDER_EMAIL = hi@spex.com.ng
   ```

3. If missing, add them:

   **SENDGRID_API_KEY:**
   - Get from: https://app.sendgrid.com/settings/api_keys
   - Click "Create API Key"
   - Name: "ColdPitch Production"
   - Permissions: "Full Access"
   - Copy the key (starts with "SG.")
   - Add to Vercel

   **SENDER_EMAIL:**
   - Use a verified sender email
   - Must be verified in SendGrid dashboard
   - Default: `hi@spex.com.ng`

4. **IMPORTANT:** After adding variables, redeploy:
   ```powershell
   vercel --prod
   ```

### Step 3: Verify SendGrid Sender

1. Go to: https://app.sendgrid.com/settings/sender_auth

2. Click "Verify a Single Sender"

3. Add your sender email (e.g., `hi@spex.com.ng`)

4. Check the inbox for that email

5. Click the verification link

6. Status should show "Verified" ✅

### Step 4: Test the API Directly

You can test the serverless function directly:

```bash
# In PowerShell
$body = @{
    to = "your-email@gmail.com"
    name = "Test User"
    password = "TestPass123"
    loginUrl = "https://spexcoldpitch.vercel.app/login"
} | ConvertTo-Json

Invoke-RestMethod -Method Post `
  -Uri "https://spexcoldpitch.vercel.app/api/send-credentials" `
  -ContentType "application/json" `
  -Body $body
```

Expected response:
```json
{
  "success": true,
  "message": "Email sent to your-email@gmail.com"
}
```

If you get 500 error, check Vercel logs for details.

## ✅ Quick Fix Checklist

- [ ] **Environment Variables Set**
  - [ ] `SENDGRID_API_KEY` is set in Vercel
  - [ ] `SENDER_EMAIL` is set in Vercel
  - [ ] Values are correct (no extra spaces)

- [ ] **SendGrid Account Setup**
  - [ ] SendGrid account is active
  - [ ] API key is not expired
  - [ ] Sender email is verified
  - [ ] Account has email sending credits

- [ ] **Vercel Deployment**
  - [ ] Latest code is deployed
  - [ ] Redeployed after adding env vars
  - [ ] No build errors
  - [ ] Function is showing in Vercel dashboard

- [ ] **Package Dependencies**
  - [ ] `@sendgrid/mail` is in `package.json`
  - [ ] Vercel installed dependencies correctly

## 🚨 Common Mistakes

### Mistake 1: Not Redeploying After Adding Env Vars
```bash
# ❌ Added env vars but didn't redeploy
# ✅ Always redeploy after changing env vars
vercel --prod
```

### Mistake 2: Using Unverified Sender Email
```bash
# ❌ Sender email not verified in SendGrid
# ✅ Verify sender in SendGrid dashboard first
```

### Mistake 3: Wrong Environment Variables Format
```bash
# ❌ Variable names with typos
SENDGRID_APIKEY  # Missing underscore
SENDGRID_API_KEY_  # Extra underscore

# ✅ Correct names
SENDGRID_API_KEY
SENDER_EMAIL
```

### Mistake 4: Expired or Invalid API Key
```bash
# ❌ Old API key from months ago
# ✅ Create fresh API key in SendGrid dashboard
```

## 🔧 Manual Workaround (If Email Still Fails)

If email continues to fail, you can manually share credentials:

1. When you create a staff member, a modal shows the password
2. Copy the password from the modal
3. Manually send via WhatsApp, SMS, or in person
4. Staff can login with: email + that password

The app is designed to work even if emails fail - the password modal is the backup!

## 📊 Expected Behavior

### Success Flow:
```
1. Admin creates staff member
   ↓
2. Staff record saved to database ✅
   ↓
3. Password generated ✅
   ↓
4. API call to /api/send-credentials ✅
   ↓
5. SendGrid sends email ✅
   ↓
6. Staff receives credentials email ✅
   ↓
7. Staff logs in successfully ✅
```

### Current Flow (With 500 Error):
```
1. Admin creates staff member ✅
   ↓
2. Staff record saved to database ✅
   ↓
3. Password generated ✅
   ↓
4. API call to /api/send-credentials ❌ (500 error)
   ↓
5. Password shown in modal ✅ (manual workaround)
```

## 🎯 Next Steps

### Immediate Actions:

1. **Check Vercel Logs:**
   ```
   https://vercel.com/tacafrica016gmailcoms-projects/spexcoldpitch/logs
   ```
   Look for the actual error message

2. **Verify SendGrid API Key:**
   - Check if key exists
   - Check if key is valid
   - Create new key if needed

3. **Add Environment Variables:**
   ```
   SENDGRID_API_KEY=SG.your_actual_key_here
   SENDER_EMAIL=hi@spex.com.ng
   ```

4. **Redeploy:**
   ```powershell
   vercel --prod
   ```

5. **Test Again:**
   - Create a new staff member
   - Check if email is sent
   - Check Vercel logs if it fails

### If Still Failing:

1. Copy the exact error from Vercel logs
2. Share it so we can debug further
3. Use manual password sharing as workaround

## 📞 SendGrid Support Links

- Dashboard: https://app.sendgrid.com/
- API Keys: https://app.sendgrid.com/settings/api_keys
- Sender Authentication: https://app.sendgrid.com/settings/sender_auth
- Activity Feed: https://app.sendgrid.com/email_activity
- Documentation: https://docs.sendgrid.com/

## 💡 Pro Tip

Enable SendGrid email activity tracking:
1. Go to: https://app.sendgrid.com/email_activity
2. See all emails sent (or failed)
3. Check delivery status
4. See bounce/spam reports

This helps you confirm if emails are being sent successfully!
