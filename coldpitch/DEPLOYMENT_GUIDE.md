# Deployment Guide: ColdPitch to Vercel

## Overview

This guide covers deploying your ColdPitch app to Vercel with the email backend as serverless functions.

## What's Changed

### ✅ Serverless Function Created
- **File**: `api/send-credentials.js`
- **Purpose**: Replaces the Express server (`email-backend/server.js`)
- **Benefit**: Automatically scales, no server to maintain

### ✅ Frontend Updated
- **File**: `src/services/staffService.ts`
- **Change**: Uses `/api/send-credentials` in production
- **Local Dev**: Still uses `http://localhost:3001` (keep email-backend running locally)

### ✅ Vercel Config Created
- **File**: `vercel.json`
- **Purpose**: Configures API routes and environment variables

## Deployment Steps

### Step 1: Prepare Your Repository

1. **Commit all changes:**
   ```powershell
   cd c:\Users\jahs_\Documents\GitHub\lead\coldpitch
   git add .
   git commit -m "Add Vercel serverless function for email backend"
   git push origin main
   ```

### Step 2: Connect to Vercel

1. Go to https://vercel.com
2. Sign in with GitHub
3. Click **Add New Project**
4. Import your repository: `lead/coldpitch`

### Step 3: Configure Project Settings

#### Framework Preset
- Select: **Vite**

#### Root Directory
- Set to: `coldpitch` (if repo root is `lead`)
- Or leave blank if `coldpitch` is the root

#### Build Settings
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

### Step 4: Add Environment Variables

In Vercel project settings, add these:

**Required:**
```
SENDGRID_API_KEY=your_sendgrid_api_key_here
SENDER_EMAIL=hi@spex.com.ng
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

> ⚠️ **Security Note**: Never commit real API keys to Git! Get your actual keys from:
> - SendGrid API key: https://app.sendgrid.com/settings/api_keys
> - Supabase credentials: https://supabase.com/dashboard → Project Settings → API

**How to add:**
1. Go to Project Settings → Environment Variables
2. Add each variable with:
   - **Name**: Variable name (e.g., `SENDGRID_API_KEY`)
   - **Value**: The value
   - **Environment**: Production, Preview, Development (select all)
3. Click **Save**

### Step 5: Deploy

1. Click **Deploy**
2. Wait 2-3 minutes for build
3. Get your URL: `https://your-project.vercel.app`

### Step 6: Test Email Function

Once deployed, test the email endpoint:

```powershell
curl -X POST https://your-project.vercel.app/api/send-credentials `
  -H "Content-Type: application/json" `
  -d '{"to":"test@example.com","name":"Test User","password":"TestPass123","loginUrl":"https://your-project.vercel.app/login"}'
```

Expected response:
```json
{"success":true,"message":"Email sent to test@example.com"}
```

## Local Development

### Keep Using Express Server Locally

For local development, continue using the Express backend:

1. **Terminal 1 (Backend):**
   ```powershell
   cd email-backend
   npm start
   ```

2. **Terminal 2 (Frontend):**
   ```powershell
   npm run dev
   ```

The code automatically detects environment:
- **Local**: Uses `http://localhost:3001/api/send-credentials`
- **Production**: Uses `/api/send-credentials` (serverless)

## Architecture

### Before (Express Server)
```
❌ Won't work on Vercel
Frontend → http://localhost:3001 → Express Server → SendGrid
```

### After (Serverless)
```
✅ Works on Vercel
Frontend → /api/send-credentials → Vercel Serverless Function → SendGrid
```

## File Structure

```
coldpitch/
├── api/                           # Serverless functions (auto-detected by Vercel)
│   └── send-credentials.js        # Email sending function
├── email-backend/                 # Local development only (not deployed)
│   ├── server.js
│   └── package.json
├── src/
│   └── services/
│       └── staffService.ts        # Updated to use serverless in production
├── vercel.json                    # Vercel configuration
└── package.json
```

## Troubleshooting

### Error: "Email service not configured"

**Cause:** Missing `SENDGRID_API_KEY` environment variable.

**Fix:**
1. Go to Vercel dashboard → Project Settings → Environment Variables
2. Add `SENDGRID_API_KEY` with your SendGrid API key
3. Redeploy (Vercel → Deployments → Click "..." → Redeploy)

### Error: "405 Method Not Allowed"

**Cause:** Using GET instead of POST.

**Fix:** Ensure you're sending POST requests to `/api/send-credentials`.

### Error: "401 Unauthorized" from SendGrid

**Cause:** Invalid SendGrid API key or sender not verified.

**Fix:**
1. Verify API key is correct in environment variables
2. Ensure `hi@spex.com.ng` is verified in SendGrid dashboard
3. Check SendGrid dashboard for domain verification

### Emails not sending

**Cause:** Could be multiple issues.

**Fix:**
1. Check Vercel function logs (Dashboard → Deployments → Click deployment → Functions tab)
2. Check SendGrid Activity dashboard
3. Verify sender email is verified
4. Check spam folder

### Build fails on Vercel

**Cause:** Missing dependencies or build errors.

**Fix:**
1. Check build logs in Vercel dashboard
2. Ensure all dependencies are in `package.json`
3. Run `npm run build` locally to catch errors first

## Cost Considerations

### Vercel Free Tier Includes:
- ✅ Unlimited serverless function invocations
- ✅ 100 GB bandwidth per month
- ✅ Automatic HTTPS
- ✅ Global CDN
- ⚠️ 10-second function timeout (plenty for emails)

### SendGrid Free Tier:
- ✅ 100 emails per day
- ✅ Enough for staff onboarding
- 💰 Upgrade if you need more

## Environment Variable Management

### Add New Variables After Deployment

```powershell
# Install Vercel CLI (optional)
npm i -g vercel

# Add environment variable
vercel env add VARIABLE_NAME production
```

Or use the Vercel dashboard (easier).

## Custom Domain (Optional)

### Add Your Own Domain

1. Go to Project Settings → Domains
2. Add your domain (e.g., `app.coldpitch.com`)
3. Update DNS records as instructed
4. Vercel automatically provisions SSL

### Update SendGrid

If you change domains, update `loginUrl` in the email template.

## Monitoring

### Check Function Performance

1. Vercel Dashboard → Analytics
2. See function execution time, success rate
3. Monitor bandwidth usage

### Check Email Delivery

1. SendGrid Dashboard → Activity
2. See delivered, bounced, opened emails

## Rollback

If something breaks:

1. Go to Vercel → Deployments
2. Find last working deployment
3. Click "..." → "Promote to Production"

## Next Steps

After deploying:

1. ✅ Test staff creation and email sending
2. ✅ Run the duty_days migration in Supabase (if not done)
3. ✅ Test all features in production
4. ✅ Add your team members
5. ✅ Set up custom domain (optional)

---

## Quick Deploy Checklist

- [ ] Commit and push changes to GitHub
- [ ] Create Vercel account
- [ ] Import project to Vercel
- [ ] Add environment variables:
  - [ ] SENDGRID_API_KEY
  - [ ] SENDER_EMAIL
  - [ ] VITE_SUPABASE_URL
  - [ ] VITE_SUPABASE_ANON_KEY
- [ ] Deploy
- [ ] Test email function
- [ ] Verify staff creation works
- [ ] Done! 🎉

---

## Support

**Vercel Issues:** https://vercel.com/support
**SendGrid Issues:** https://support.sendgrid.com

**Local Testing:**
Keep running the Express server locally - it works great for development!
