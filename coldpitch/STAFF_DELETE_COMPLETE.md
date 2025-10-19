# Complete Staff Delete - Auth User + Database Record

## 🎯 What We Fixed

Previously, deleting staff would:
- ✅ Delete staff database record
- ❌ **Fail to delete auth user** (403 Forbidden error)

This meant:
- Staff removed from app UI
- But auth user still exists in Supabase Auth
- Deleted staff could still try to login (would fail at staff lookup)

---

## ✅ New Solution

### Created: `/api/delete-auth-user.js`

A serverless function that uses the **service role key** to delete auth users.

**How it works:**
1. Staff delete triggered in app
2. Delete staff database record ✅
3. Call `/api/delete-auth-user` serverless function
4. Serverless function uses service role key (server-side only)
5. Deletes auth user ✅

---

## 🔑 Required: Service Role Key

The service role key is needed because:
- Anon key (client-side) **cannot** delete auth users (403 Forbidden)
- Service role key (server-side) **can** delete auth users
- Serverless functions run server-side, can use service role key safely

### Step 1: Get Service Role Key

1. Go to: https://supabase.com/dashboard
2. Select your **coldpitch** project
3. Click **Settings** → **API**
4. Find section: **Project API keys**
5. Copy: **`service_role` key** (the secret one)

**⚠️ Important:** This key has full access - never expose to client!

### Step 2: Add to Vercel Environment Variables

1. Go to: https://vercel.com/tacafrica016gmailcoms-projects/spexcoldpitch/settings/environment-variables

2. Click **"Add New"**

3. Add these variables:

   **Variable 1:**
   - Key: `SUPABASE_SERVICE_ROLE_KEY`
   - Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS...` (your actual key)
   - Environment: ✅ Production, ✅ Preview, ✅ Development

   **Variable 2:** (if not already set)
   - Key: `VITE_SUPABASE_URL`
   - Value: `https://your-project-id.supabase.co`
   - Environment: ✅ Production, ✅ Preview, ✅ Development

4. Click **"Save"**

### Step 3: Redeploy

```powershell
cd c:\Users\jahs_\Documents\GitHub\lead\coldpitch
vercel --prod
```

---

## 🧪 Test Complete Delete

After adding service role key and redeploying:

### Step 1: Delete Staff

1. Go to: https://spexcoldpitch.vercel.app
2. Navigate to: Staff page
3. Delete a staff member
4. Open Console (F12)

### Step 2: Check Console Output

**Expected output:**
```
🗑️ Attempting to delete staff: abc-123-def
✅ Staff to delete: { name: "...", email: "..." }
✅ Activity logged
🗑️ Deleting staff record from database...
Delete response: { error: null, data: [{...}] }
✅ Staff record deleted successfully
🗑️ Attempting to delete auth user via API...
✅ Auth user deleted: { success: true, message: "..." }
```

**Before (with 403 error):**
```
❌ DELETE .../auth/v1/admin/users/... 403 (Forbidden)
⚠️ Could not delete auth user (may require admin permissions)
```

**After (with service role key):**
```
✅ Auth user deleted: { success: true, message: "..." }
```

### Step 3: Verify in Supabase

1. Go to: Supabase Dashboard → Authentication → Users
2. Search for deleted staff email
3. User should be **completely gone** ✅

### Step 4: Verify Cannot Login

1. Try to login with deleted staff credentials
2. Should fail with: "Invalid credentials" or "User not found"
3. This confirms auth user was deleted ✅

---

## 📊 What Happens Now

### Complete Delete Flow:

```
1. Admin clicks delete staff
   ↓
2. Staff database record deleted
   ✅ Removed from staff table
   ✅ Activity logged
   ↓
3. Call serverless function /api/delete-auth-user
   ↓
4. Serverless function uses service role key
   ↓
5. Auth user deleted from Supabase Auth
   ✅ User removed from auth.users table
   ✅ Cannot login anymore
   ↓
6. Complete deletion! 🎉
```

### Before vs After:

**Before (Incomplete Delete):**
- ❌ Staff record deleted
- ❌ Auth user still exists (403 error)
- ❌ User entry in Authentication → Users
- ⚠️ Confusing state

**After (Complete Delete):**
- ✅ Staff record deleted
- ✅ Auth user deleted
- ✅ No user entry in Authentication → Users
- ✅ Clean deletion

---

## 🔒 Security Notes

### Why Service Role Key is Safe Here:

1. **Never exposed to client** - Only in Vercel environment variables
2. **Only used server-side** - In serverless function
3. **Controlled access** - Only callable by your app
4. **No direct exposure** - Client code never sees the key

### Best Practices:

✅ **DO:**
- Keep service role key in Vercel environment variables
- Use serverless functions for admin operations
- Log all deletions for audit trail

❌ **DON'T:**
- Put service role key in `.env` (committed to git)
- Use service role key in client-side code
- Share service role key publicly

---

## 📋 Setup Checklist

- [ ] Get service role key from Supabase Dashboard
- [ ] Add `SUPABASE_SERVICE_ROLE_KEY` to Vercel
- [ ] Add `VITE_SUPABASE_URL` to Vercel (if not already)
- [ ] Redeploy: `vercel --prod`
- [ ] Test delete staff
- [ ] Check console shows "✅ Auth user deleted"
- [ ] Verify in Supabase → Users (user gone)
- [ ] Try login with deleted credentials (should fail)

---

## 🐛 Troubleshooting

### Issue: Still Getting 403 Error

**Check:**
```
1. Is SUPABASE_SERVICE_ROLE_KEY set in Vercel?
2. Did you redeploy after adding it?
3. Is the key correct? (starts with "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9")
```

**Fix:**
- Re-copy key from Supabase Dashboard
- Ensure no extra spaces
- Redeploy: `vercel --prod`

### Issue: "Server configuration error"

**Meaning:** Service role key not found in environment variables

**Fix:**
1. Check Vercel environment variables
2. Make sure `SUPABASE_SERVICE_ROLE_KEY` is set
3. Check it's enabled for Production environment
4. Redeploy

### Issue: Auth user deleted but staff record remains

**Meaning:** Order is wrong or database delete failed

**Check console for:**
```
✅ Auth user deleted
❌ Failed to delete staff record
```

**This should not happen** - we delete staff record first, then auth user.

### Issue: "Auth user deletion failed (non-fatal)"

**Meaning:** Staff record deleted but auth cleanup failed

**Impact:** 
- Staff removed from app ✅
- Auth user still exists ⚠️
- User can't login (no staff record to fetch)
- But takes up space in auth.users table

**Fix:** Set service role key and redeploy

---

## 📞 Vercel Environment Variables

### All Required Variables:

```env
# Supabase (already set)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Supabase Service Role (NEW - required for delete)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# SendGrid (already set for emails)
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxx
SENDER_EMAIL=hi@spex.com.ng
```

---

## 🎯 Summary

**Problem:** Delete staff leaves auth user orphaned (403 error)  
**Cause:** Client-side anon key can't delete auth users  
**Solution:** Serverless function with service role key  
**Setup Time:** 2 minutes  
**Result:** Complete deletion (staff + auth user) ✅

**Next Steps:**
1. Get service role key from Supabase
2. Add to Vercel environment variables
3. Redeploy
4. Test delete - both records should be removed!

---

**Files Created:**
- `/api/delete-auth-user.js` - Serverless function for auth deletion

**Files Modified:**
- `src/services/staffService.ts` - Now calls serverless function

**Ready to deploy!** 🚀
