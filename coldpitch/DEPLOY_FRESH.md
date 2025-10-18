# 🚀 Fresh Deployment Guide - ColdPitch

## ✅ Current Status

**GitHub Repository**: `tacafricamain/coldpitch`
**Branch**: `main`
**Latest Commit**: TypeScript errors fixed ✅
**Status**: Ready to deploy!

---

## 🎯 Deploy to Vercel Now

### Step 1: Go to Vercel

1. Open: https://vercel.com
2. Click **Sign In** or **Sign Up**
3. Choose **Continue with GitHub**

### Step 2: Import Repository

1. Click **Add New...** → **Project**
2. You'll see your GitHub repositories
3. Find: **`tacafricamain/coldpitch`**
4. Click **Import**

### Step 3: Configure Project

**Framework Preset**: Vite (should auto-detect)

**Root Directory**: 
- Click **Edit** next to Root Directory
- Enter: `coldpitch`
- This tells Vercel your app is in the `coldpitch` folder, not the root

**Build & Development Settings**:
- Build Command: `npm run build` (auto-detected)
- Output Directory: `dist` (auto-detected)
- Install Command: `npm install` (auto-detected)

### Step 4: Add Environment Variables

Click **Environment Variables** tab and add these **4 variables**:

#### 1. SENDGRID_API_KEY
- **Key**: `SENDGRID_API_KEY`
- **Value**: Get from https://app.sendgrid.com/settings/api_keys
  - Click **Create API Key**
  - Name: `ColdPitch Production`
  - Permissions: **Full Access**
  - Copy the key (starts with `SG.`)
- **Environments**: ✅ Production, ✅ Preview, ✅ Development

#### 2. SENDER_EMAIL
- **Key**: `SENDER_EMAIL`
- **Value**: `hi@spex.com.ng`
- **Environments**: ✅ Production, ✅ Preview, ✅ Development

#### 3. VITE_SUPABASE_URL
- **Key**: `VITE_SUPABASE_URL`
- **Value**: `https://irbtqnzpzlloaqldlkbm.supabase.co`
- **Environments**: ✅ Production, ✅ Preview, ✅ Development

#### 4. VITE_SUPABASE_ANON_KEY
- **Key**: `VITE_SUPABASE_ANON_KEY`
- **Value**: Get from https://supabase.com/dashboard
  - Click your project: `irbtqnzpzlloaqldlkbm`
  - Go to **Settings** → **API**
  - Copy **anon public** key (long JWT token starting with `eyJ...`)
- **Environments**: ✅ Production, ✅ Preview, ✅ Development

### Step 5: Deploy!

1. Click **Deploy** button
2. Wait 2-3 minutes for build
3. ✅ Your app will be live!

---

## 🗄️ Database Setup (Critical!)

After deployment succeeds, you **MUST** run this SQL in Supabase:

### Add duty_days Column

1. Go to: https://supabase.com/dashboard
2. Select project: `irbtqnzpzlloaqldlkbm`
3. Click **SQL Editor** (left sidebar)
4. Click **New query**
5. Paste this SQL:

```sql
-- Add duty_days column to staff table
ALTER TABLE staff 
ADD COLUMN IF NOT EXISTS duty_days TEXT[] DEFAULT '{}';

-- Verify it was added
SELECT column_name, data_type, column_default
FROM information_schema.columns 
WHERE table_name = 'staff' 
AND column_name = 'duty_days';
```

6. Click **Run** (or press Ctrl+Enter)
7. You should see output confirming the column exists

**Without this column, the Staff feature will error!**

---

## 🧪 Test Your Live App

Once deployed:

1. Visit your Vercel URL (e.g., `https://coldpitch-xyz.vercel.app`)
2. **Login** with: `contact.jahswill@gmail.com` (your configured email)
3. **Test Features**:
   - ✅ Dashboard loads
   - ✅ View prospects
   - ✅ Create a staff member (test email sending)
   - ✅ Add/edit duty days for staff
   - ✅ Create an invoice
   - ✅ Check settings

### If Email Sending Fails

Check Vercel logs:
1. Go to Vercel Dashboard → **Deployments**
2. Click on latest deployment
3. Click **Functions** tab
4. Look for `/api/send-credentials` errors

Common issues:
- SendGrid API key invalid
- Sender email `hi@spex.com.ng` not verified in SendGrid
- Missing `SENDGRID_API_KEY` environment variable

---

## 🔄 Auto-Deployment

From now on, every push to GitHub will auto-deploy:

```powershell
# Make changes
git add .
git commit -m "Your update message"
git push origin main
```

Vercel automatically:
1. Detects the push
2. Builds your app
3. Deploys to production
4. No manual steps needed! 🎉

---

## 📊 Monitor Your App

### Vercel Dashboard
- **Deployments**: See all deployments and their status
- **Analytics**: View traffic and performance
- **Logs**: Debug issues
- **Settings**: Manage env vars and domain

### Supabase Dashboard
- **Database**: View and edit data
- **SQL Editor**: Run queries
- **Auth**: Manage authentication (future)
- **API**: Monitor API usage

---

## 🌐 Custom Domain (Optional)

Want to use your own domain?

1. Vercel Dashboard → **Settings** → **Domains**
2. Add domain (e.g., `app.coldpitch.com`)
3. Update DNS records as shown
4. Vercel provisions SSL automatically
5. Done! Your app is at your custom domain

---

## 🐛 Troubleshooting

### Build Fails
**Check**: Root directory is set to `coldpitch`
**Fix**: Vercel Settings → General → Root Directory → `coldpitch`

### "Module not found" Error
**Check**: Build command and output directory
**Fix**: 
- Build Command: `npm run build`
- Output Directory: `dist`

### App Loads But Features Don't Work
**Check**: Environment variables
**Fix**: Vercel Settings → Environment Variables → Verify all 4 variables exist

### Staff Feature Errors
**Check**: `duty_days` column in database
**Fix**: Run the SQL migration in Supabase (see Database Setup above)

### Email Not Sending
**Check**: 
- SendGrid API key is correct
- `hi@spex.com.ng` is verified in SendGrid
- Check Vercel function logs

**Fix**: 
1. Verify sender in SendGrid: https://app.sendgrid.com/settings/sender_auth
2. Regenerate API key if needed
3. Update environment variable in Vercel
4. Redeploy

---

## 📝 Quick Checklist

Before declaring success, verify:

- [ ] Repository: `tacafricamain/coldpitch` ✅
- [ ] Vercel project created
- [ ] Root directory set to `coldpitch`
- [ ] All 4 environment variables added
- [ ] Deployment succeeded (green ✓)
- [ ] Database migration run (duty_days column)
- [ ] App loads at Vercel URL
- [ ] Login works
- [ ] Dashboard shows data
- [ ] Can create prospect
- [ ] Can create staff (check email)
- [ ] Staff duty days work
- [ ] Settings page loads

---

## 🎉 Success Metrics

Your deployment is successful when:

1. ✅ Build completes without errors
2. ✅ App loads at Vercel URL
3. ✅ Login works
4. ✅ All pages load
5. ✅ Database operations work
6. ✅ Email sending works (staff credentials)
7. ✅ No console errors

---

## 🚀 You're Live!

**GitHub**: https://github.com/tacafricamain/coldpitch
**Vercel**: https://vercel.com/dashboard (your project)
**Supabase**: https://supabase.com/dashboard

**Next Steps**:
- Share your Vercel URL with your team
- Test all features thoroughly
- Set up custom domain (optional)
- Monitor performance and logs
- Add more features!

---

**🎊 Congratulations! Your ColdPitch app is live!**
