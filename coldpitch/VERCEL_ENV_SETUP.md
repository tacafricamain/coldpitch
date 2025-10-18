# ✅ Vercel Deployment Fixed!

## Issue Resolved

The `vercel.json` file was trying to reference Vercel secrets that don't exist. I've removed that section.

**Status**: ✅ Pushed to GitHub - Vercel will auto-redeploy

---

## Add Environment Variables in Vercel Dashboard

### Step 1: Go to Environment Variables

In your Vercel project:

1. Click **Settings** tab (top navigation)
2. Click **Environment Variables** (left sidebar)

### Step 2: Add Each Variable

Add these **4 environment variables** one by one:

#### Variable 1: SENDGRID_API_KEY
- **Key**: `SENDGRID_API_KEY`
- **Value**: Your actual SendGrid API key (get from https://app.sendgrid.com/settings/api_keys)
- **Environment**: ✅ Production, ✅ Preview, ✅ Development (check all)
- Click **Save**

#### Variable 2: SENDER_EMAIL
- **Key**: `SENDER_EMAIL`
- **Value**: `hi@spex.com.ng`
- **Environment**: ✅ Production, ✅ Preview, ✅ Development
- Click **Save**

#### Variable 3: VITE_SUPABASE_URL
- **Key**: `VITE_SUPABASE_URL`
- **Value**: `https://irbtqnzpzlloaqldlkbm.supabase.co`
- **Environment**: ✅ Production, ✅ Preview, ✅ Development
- Click **Save**

#### Variable 4: VITE_SUPABASE_ANON_KEY
- **Key**: `VITE_SUPABASE_ANON_KEY`
- **Value**: Your Supabase anon key (get from https://supabase.com/dashboard)
- **Environment**: ✅ Production, ✅ Preview, ✅ Development
- Click **Save**

---

## Get Your Actual API Keys

### SendGrid API Key

1. Go to: https://app.sendgrid.com/settings/api_keys
2. Click **Create API Key**
3. Name: `ColdPitch Production`
4. Permissions: **Full Access**
5. Click **Create & View**
6. **Copy the key** (shown only once!) - it looks like `SG.xxxxxxxxxxxxx`

### Supabase Anon Key

1. Go to: https://supabase.com/dashboard
2. Click on your project: **irbtqnzpzlloaqldlkbm**
3. Click **Settings** (gear icon) → **API**
4. Under **Project API keys**, copy the **anon public** key
5. It's a long JWT token starting with `eyJ...`

---

## Step 3: Redeploy

After adding all environment variables:

1. Go to **Deployments** tab
2. Find the latest deployment
3. Click the **...** (three dots) menu
4. Click **Redeploy**
5. Click **Redeploy** again to confirm

Or just wait - Vercel should auto-deploy since we pushed the fix!

---

## Visual Guide

```
Vercel Dashboard
├── Settings
│   └── Environment Variables
│       ├── Add Variable (1/4): SENDGRID_API_KEY = your_key
│       ├── Add Variable (2/4): SENDER_EMAIL = hi@spex.com.ng
│       ├── Add Variable (3/4): VITE_SUPABASE_URL = https://irbtqnzpzlloaqldlkbm.supabase.co
│       └── Add Variable (4/4): VITE_SUPABASE_ANON_KEY = your_key
└── Deployments
    └── [Latest] → ... → Redeploy
```

---

## After Deployment Success

### Test Your Live App

1. Visit your Vercel URL (e.g., `https://coldpitch-xyz.vercel.app`)
2. Try logging in
3. Test features

### Add duty_days Column (If Not Done)

In Supabase SQL Editor:

```sql
ALTER TABLE staff 
ADD COLUMN IF NOT EXISTS duty_days TEXT[] DEFAULT '{}';
```

---

## Troubleshooting

### Build Still Fails?

Check build logs:
- Vercel Dashboard → Deployments → Click on deployment → View Function Logs

### "Module not found" Error?

Make sure:
- **Root Directory** is set to `coldpitch` (not blank)
- **Build Command** is `npm run build`
- **Output Directory** is `dist`

### Environment Variables Not Working?

- Make sure all 3 environments are checked (Production, Preview, Development)
- Redeploy after adding variables
- Variables are case-sensitive!

---

## Summary

✅ Fixed `vercel.json` (removed secret references)
✅ Pushed fix to GitHub
⏳ Add 4 environment variables in Vercel dashboard
⏳ Redeploy
🎉 Your app goes live!

---

**Next**: Add those environment variables and watch your app deploy! 🚀
