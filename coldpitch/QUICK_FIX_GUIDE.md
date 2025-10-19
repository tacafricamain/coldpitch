# 🚀 Quick Start - Fix Email in 5 Minutes

## What We Fixed
✅ **500 Error** - Added `api/package.json` so Vercel can install SendGrid
✅ **Better Errors** - Console now shows helpful debugging info
✅ **Deployed** - Changes are live on Vercel

## What You Need To Do (5 min)

### 1️⃣ Get SendGrid API Key (2 min)
```
https://app.sendgrid.com/settings/api_keys
→ Create API Key
→ Name: "ColdPitch Production"
→ Permissions: Full Access
→ Copy key (starts with SG.)
```

### 2️⃣ Verify Sender Email (2 min)
```
https://app.sendgrid.com/settings/sender_auth
→ Verify a Single Sender
→ Email: hi@spex.com.ng
→ Check inbox → Click verification link
→ Wait for "Verified" status
```

### 3️⃣ Add to Vercel (1 min)
```
https://vercel.com/tacafrica016gmailcoms-projects/spexcoldpitch/settings/environment-variables

Add these 2 variables:

SENDGRID_API_KEY = SG.xxxxxxxx... (your key)
SENDER_EMAIL = hi@spex.com.ng

✅ Check all 3 environments (Production, Preview, Development)
```

### 4️⃣ Redeploy
```powershell
vercel --prod
```

### 5️⃣ Test
```
1. Create staff member
2. Check console: "✅ Email successfully sent to..."
3. Check inbox: Credentials email received
4. Login with credentials: Success!
```

## That's It! 🎉

No more 500 errors. Emails will work perfectly.

## Quick Test Command
```powershell
$body = @{
    to = "your-email@gmail.com"
    name = "Test"
    password = "Test123"
    loginUrl = "https://spexcoldpitch.vercel.app/login"
} | ConvertTo-Json

Invoke-RestMethod -Method Post `
  -Uri "https://spexcoldpitch.vercel.app/api/send-credentials" `
  -ContentType "application/json" `
  -Body $body
```

Expected: `{ success: true, message: "Email sent to your-email@gmail.com" }`

---

**Files Changed:**
- ✅ `api/package.json` (NEW - fixes 500 error)
- ✅ `src/services/staffService.ts` (better error handling)

**Time:** 5 minutes
**Difficulty:** Easy
**Result:** Working emails! 📧✨
