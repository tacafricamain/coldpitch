# GitHub Setup Guide

## Quick Setup (Using GitHub CLI)

### Option 1: GitHub CLI (Recommended)

1. **Install GitHub CLI** (if not already installed):
   ```powershell
   winget install GitHub.cli
   ```

2. **Login to GitHub:**
   ```powershell
   gh auth login
   ```
   - Select: GitHub.com
   - Select: HTTPS
   - Authenticate with your browser

3. **Create Repository & Push:**
   ```powershell
   cd C:\Users\jahs_\Documents\GitHub\lead
   gh repo create coldpitch --public --source=. --push
   ```

   This will:
   - Create a new repo on GitHub named "coldpitch"
   - Set it as public
   - Add it as remote origin
   - Push your code

---

## Option 2: Manual GitHub Setup

### Step 1: Create Repository on GitHub

1. Go to https://github.com/new
2. Repository name: `coldpitch`
3. Description: `ColdPitch - B2B Lead Management & Outreach Platform`
4. Visibility: **Public** (or Private if you prefer)
5. **DON'T** initialize with README, .gitignore, or license
6. Click **Create repository**

### Step 2: Add Remote & Push

```powershell
cd C:\Users\jahs_\Documents\GitHub\lead

# Add GitHub as remote
git remote add origin https://github.com/YOUR_USERNAME/coldpitch.git

# Push code to GitHub
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

---

## Deploy to Vercel

### Step 1: Go to Vercel

1. Visit: https://vercel.com
2. Click **Sign Up** or **Login**
3. Choose **Continue with GitHub**

### Step 2: Import Project

1. Click **Add New...** → **Project**
2. Import your repository: `coldpitch`
3. Click **Import**

### Step 3: Configure Build Settings

- **Framework Preset**: Vite
- **Root Directory**: `coldpitch`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### Step 4: Add Environment Variables

Click **Environment Variables** and add:

```
SENDGRID_API_KEY=your_sendgrid_api_key_here
SENDER_EMAIL=hi@spex.com.ng
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

> ⚠️ **Get your actual keys from:**
> - SendGrid: https://app.sendgrid.com/settings/api_keys
> - Supabase: https://supabase.com/dashboard → Project Settings → API

### Step 5: Deploy

1. Click **Deploy**
2. Wait 2-3 minutes for build
3. Your app will be live at: `https://coldpitch.vercel.app` (or similar)

---

## Post-Deployment Checklist

### ✅ Test Your Live App

1. Visit your Vercel URL
2. Login: `contact.jahswill@gmail.com` / password
3. Test features:
   - [ ] Create a staff member (test email function)
   - [ ] Create a prospect
   - [ ] Edit staff duty days
   - [ ] View dashboard

### ✅ Check Email Function

1. Create a staff member
2. Check if email is sent
3. If not, check Vercel logs:
   - Dashboard → Deployments → Click deployment → Functions tab
   - Look for errors in `/api/send-credentials`

### ✅ Verify Database

1. Go to Supabase dashboard
2. Check if duty_days column exists:
   ```sql
   SELECT column_name FROM information_schema.columns 
   WHERE table_name='staff' AND column_name='duty_days';
   ```
3. If missing, run:
   ```sql
   ALTER TABLE staff ADD COLUMN IF NOT EXISTS duty_days TEXT[] DEFAULT '{}';
   ```

---

## Custom Domain (Optional)

### Add Your Own Domain

1. Go to Vercel → Project Settings → Domains
2. Add domain (e.g., `app.coldpitch.com`)
3. Update DNS records as shown
4. Wait for SSL certificate (automatic)

---

## Continuous Deployment

Every time you push to GitHub, Vercel will automatically:
- ✅ Pull latest code
- ✅ Build the app
- ✅ Deploy to production
- ✅ No manual steps needed!

### To Update Your App:

```powershell
# Make changes to your code
git add .
git commit -m "Description of changes"
git push origin main
```

Vercel will deploy automatically! 🎉

---

## Troubleshooting

### Error: "Permission denied"

**Fix:**
```powershell
gh auth refresh -h github.com -s repo,workflow
```

### Error: "Repository already exists"

**Fix:**
```powershell
# Just add the existing repo
git remote add origin https://github.com/YOUR_USERNAME/coldpitch.git
git push -u origin main
```

### Error: "Failed to push some refs"

**Fix:**
```powershell
# Pull first, then push
git pull origin main --allow-unrelated-histories
git push origin main
```

---

## Next Steps

1. ✅ Push code to GitHub
2. ✅ Deploy to Vercel
3. ✅ Add environment variables
4. ✅ Test live app
5. 🔄 Add custom domain (optional)
6. 🔄 Set up monitoring
7. 🔄 Share with team!

---

## Quick Reference

### Useful Commands

```powershell
# Check git status
git status

# See commit history
git log --oneline

# Create new branch
git checkout -b feature-name

# Push changes
git add .
git commit -m "Your message"
git push

# View remote URL
git remote -v
```

### Useful Links

- **Your GitHub Repo**: https://github.com/YOUR_USERNAME/coldpitch
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Supabase Dashboard**: https://supabase.com/dashboard
- **SendGrid Dashboard**: https://app.sendgrid.com

---

**🚀 You're all set! Your app is ready to go live!**
