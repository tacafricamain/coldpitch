# Quick Test - Staff Authentication & Delete

## 🎯 Deployment Complete!

✅ **Production URL:** https://spexcoldpitch.vercel.app

---

## Test 1: Create Staff & Login (2 min)

### Step 1: Create Staff
```
1. Go to: https://spexcoldpitch.vercel.app
2. Login with admin credentials
3. Navigate to: Staff page
4. Click: "Add Staff" button
5. Fill in:
   - Name: Test Staff
   - Email: your-test-email@gmail.com (use your real email to receive it!)
   - Role: Sales Rep
   - Duty Days: (optional)
6. Click: "Create Staff"
7. Wait for success message
```

### Step 2: Check Email
```
1. Open inbox for the email you used
2. Look for: "Welcome to ColdPitch - Your Login Credentials"
3. Email should contain:
   - Login URL button
   - Email address
   - Temporary password (e.g., "aB3xY9#mK4pQ")
4. Copy the password
```

### Step 3: Test Login
```
1. Open incognito/private window (or logout)
2. Go to: https://spexcoldpitch.vercel.app/login
3. Enter:
   - Email: [the email you used]
   - Password: [password from email]
4. Click: "Sign in"

Expected Result:
✅ "Login successful"
✅ Redirects to dashboard
✅ Shows user name in top right
```

### Step 4: Check Console (Optional)
```
1. Press F12 (open console)
2. Look for logs:
   🔐 Attempting login with Supabase Auth...
   ✅ Supabase Auth successful
   ✅ Login activity recorded

If you see these logs = Perfect! Auth is working.
```

---

## Test 2: Delete Staff (1 min)

### Step 1: Open Console First
```
1. Stay on Staff page (or navigate back)
2. Press F12 to open console
3. Keep console visible
```

### Step 2: Delete the Test Staff
```
1. Find "Test Staff" in the list
2. Click: Delete button (trash icon)
3. Confirmation modal appears
4. Click: "Delete"
```

### Step 3: Watch Console & UI
```
Expected Console Output:
🗑️ Delete confirmation - Staff: {...}
👤 Current user: [id] [name]
🗑️ Attempting to delete staff: [id]
✅ Staff to delete: { name: "Test Staff", email: "..." }
✅ Activity logged
🗑️ Deleting staff record from database...
✅ Staff record deleted
✅ Auth user deleted (or warning if no admin perms)
🔄 Reloading activity logs...
✅ Activity logs reloaded: [number] entries

Expected UI:
✅ Toast notification: "Staff deleted - Test Staff has been removed"
✅ Staff card disappears from list
✅ Activity log shows "deleted staff member" entry (check Activity tab)
```

### Step 4: Verify User Can't Login
```
1. Try to login again with deleted staff credentials
2. Expected: Login fails with "Invalid credentials" error
3. This confirms auth user was also deleted ✅
```

---

## Test 3: Edit Staff (1 min)

### Step 1: Create Another Staff (if needed)
```
Same as Test 1, Step 1
```

### Step 2: Edit Staff
```
1. Find staff member in list
2. Click: Edit button (pencil icon)
3. Modal opens with current data
4. Change:
   - Name: Add " (Updated)" to name
   - Role: Change to different role
   - Duty Days: Add or remove some days
5. Click: "Save Changes"
```

### Step 3: Verify
```
Expected:
✅ Toast: "Staff updated - [Name] has been updated successfully"
✅ Staff card shows new name
✅ Role badge updated
✅ Check Activity tab: Shows "updated staff member" entry
```

---

## ✅ Success Criteria

All tests should show:

**Create & Login:**
- [ ] Staff created successfully
- [ ] Email received with credentials
- [ ] Login works with emailed password
- [ ] Console shows "Supabase Auth successful"
- [ ] Activity log shows "added new staff member"

**Delete:**
- [ ] Delete button works
- [ ] Console shows full delete process
- [ ] Toast notification appears
- [ ] Staff removed from list
- [ ] Activity log shows "deleted staff member"
- [ ] Deleted user cannot login

**Edit:**
- [ ] Edit button opens modal with data
- [ ] Changes save successfully
- [ ] UI updates immediately
- [ ] Activity log shows "updated staff member"

---

## 🐛 If Something Fails

### Login Doesn't Work
```
Check:
1. Is SENDGRID_API_KEY set in Vercel?
2. Did email arrive? (Check spam folder)
3. Are you using the exact password from email?
4. Open console - what error shows?

Debug:
- Try hardcoded admin login first: contact.jahswill@gmail.com / spex12+++
- Check Vercel logs for errors
```

### Delete Doesn't Work
```
Check:
1. Open console (F12) before clicking delete
2. What error appears in console?
3. Does toast notification show?

Debug:
- Look for specific error in console
- Check if error is about RLS policies
- Verify you're logged in as admin
```

### Edit Doesn't Work
```
Check:
1. Does modal open with data?
2. Can you change fields?
3. What happens when you click Save?

Debug:
- Open console before saving
- Look for validation errors
- Check if error is about duty_days column
```

---

## 📊 What's New

**Changed Files:**
1. `src/services/staffService.ts` - Auth user creation + delete logging
2. `src/hooks/useAuth.tsx` - Login with Supabase Auth
3. `src/pages/Staff/Staff.tsx` - Better delete error handling

**How It Works:**
```
Create Staff:
  1. Generate random password
  2. Create Supabase Auth user (auth.users table)
  3. Create staff record (staff table) with same ID
  4. Send email with credentials
  5. Done ✅

Login:
  1. Call supabase.auth.signInWithPassword()
  2. Get auth user ID
  3. Fetch staff data using that ID
  4. Store in localStorage
  5. Redirect to dashboard ✅

Delete:
  1. Fetch staff info
  2. Log activity ("deleted staff member")
  3. Delete staff database record
  4. Try to delete auth user (admin.deleteUser)
  5. Refresh activity logs ✅
```

---

## 🎉 Expected Result

After testing, you should be able to:
- ✅ Create staff → They receive email → They can login
- ✅ Edit staff → Changes save → Activity logged
- ✅ Delete staff → User removed → Activity logged → Can't login anymore

All three CRUD operations (Create, Update, Delete) + Authentication working perfectly!

---

**Time to test:** ~5 minutes total
**Difficulty:** Easy
**Prerequisites:** Admin access to production app

Ready to test? Go for it! 🚀
