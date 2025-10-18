# ✅ Fixed: Main Branch Now on GitHub!

## Current Situation

✅ Your code is on GitHub
✅ Both `main` and `initial-deployment` branches exist
✅ They both have the same code

## Quick Fix: Change Default Branch on GitHub

### Step 1: Change Default Branch to `main`

1. Go to: https://github.com/tacafricamain/coldpitch/settings/branches

2. Under **"Default branch"**, you'll see `initial-deployment`

3. Click the **pencil icon** ✏️ or **switch icon** next to it

4. Select **`main`** from the dropdown

5. Click **"Update"** or **"I understand, update the default branch"**

### Step 2: Delete Old Branch (Optional)

Once `main` is the default:

1. Go to: https://github.com/tacafricamain/coldpitch/branches

2. Find `initial-deployment` branch

3. Click the **trash icon** 🗑️ to delete it

---

## Alternative: Skip All This and Deploy Now!

You don't actually need to fix this - you can **deploy directly from either branch**!

### Deploy to Vercel Right Now

1. **Go to Vercel**: https://vercel.com

2. **Click**: Add New... → Project

3. **Import Repository**: 
   - Search for: `tacafricamain/coldpitch`
   - Click **Import**

4. **Configure Project**:
   - **Framework Preset**: Vite
   - **Root Directory**: `coldpitch`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

5. **Add Environment Variables**:
   Click "Environment Variables" tab and add:
   
   | Name | Value |
   |------|-------|
   | `SENDGRID_API_KEY` | Your actual SendGrid API key |
   | `SENDER_EMAIL` | `hi@spex.com.ng` |
   | `VITE_SUPABASE_URL` | `https://irbtqnzpzlloaqldlkbm.supabase.co` |
   | `VITE_SUPABASE_ANON_KEY` | Your Supabase anon key |

6. **Deploy**: Click **Deploy** button

7. **Wait ~2 minutes** for build to complete

8. **Your app is live!** 🎉

---

## Get Your Real API Keys

### SendGrid API Key

1. Go to: https://app.sendgrid.com/settings/api_keys
2. Click **Create API Key**
3. Name: `ColdPitch Production`
4. Permissions: **Full Access**
5. Copy the key (shown only once!)

### Supabase Keys

1. Go to: https://supabase.com/dashboard
2. Select your project
3. Go to: **Settings** → **API**
4. Copy:
   - **Project URL** (for `VITE_SUPABASE_URL`)
   - **anon public** key (for `VITE_SUPABASE_ANON_KEY`)

---

## After Deployment

### Important: Add duty_days Column to Database

Your app expects a `duty_days` column in the `staff` table. Add it:

1. Go to Supabase dashboard → **SQL Editor**
2. Run this:

```sql
ALTER TABLE staff 
ADD COLUMN IF NOT EXISTS duty_days TEXT[] DEFAULT '{}';
```

3. Click **Run**

### Test Your Live App

1. Visit your Vercel URL (e.g., `https://coldpitch-xyz.vercel.app`)
2. Login with your credentials
3. Test features:
   - Create a staff member (check email sending)
   - Add a prospect
   - Update staff duty days
   - View dashboard

---

## Vercel Auto-Deployment

From now on, every push to your repository will automatically deploy:

```powershell
# Make changes to your code
git add .
git commit -m "Your changes"
git push origin main
```

Vercel detects the push and deploys automatically! 🚀

---

## Summary

**Current Status**:
- ✅ Code on GitHub: `main` and `initial-deployment` branches
- ✅ Ready to deploy to Vercel
- ⏳ Optional: Set `main` as default branch
- ⏳ Next: Deploy to Vercel

**Recommended Action**:
👉 **Just deploy now!** You don't need to fix the branch issue first.

---

## Quick Links

- **GitHub Repository**: https://github.com/tacafricamain/coldpitch
- **Change Default Branch**: https://github.com/tacafricamain/coldpitch/settings/branches
- **Deploy on Vercel**: https://vercel.com/new
- **Supabase Dashboard**: https://supabase.com/dashboard
- **SendGrid Dashboard**: https://app.sendgrid.com

---

**🚀 Ready to deploy? Go to Vercel now!**
