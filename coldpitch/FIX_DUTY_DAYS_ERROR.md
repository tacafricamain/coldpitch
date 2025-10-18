# Fix: Duty Days Update Error

## The Issue

When updating staff with duty days, you're getting an error because the `duty_days` column doesn't exist in the database yet.

## Solution: Add the Column to Database

### Step 1: Open Supabase SQL Editor

1. Go to your Supabase project: https://supabase.com/dashboard
2. Navigate to your project: `irbtqnzpzlloaqldlkbm`
3. Click **SQL Editor** in the left sidebar
4. Click **New Query**

### Step 2: Run This SQL

Copy and paste this into the SQL editor:

```sql
-- Add duty_days column to staff table
ALTER TABLE staff 
ADD COLUMN IF NOT EXISTS duty_days TEXT[] DEFAULT '{}';

-- Add comment for documentation
COMMENT ON COLUMN staff.duty_days IS 'Days of the week when staff member is on duty (e.g., ["Monday", "Tuesday"])';

-- Verify the column was added
SELECT column_name, data_type, column_default
FROM information_schema.columns 
WHERE table_name = 'staff' 
AND column_name = 'duty_days';
```

### Step 3: Click "Run" (or press Ctrl+Enter)

You should see output like:
```
column_name | data_type | column_default
duty_days   | ARRAY     | '{}'::text[]
```

This confirms the column was added successfully.

### Step 4: Test in Your App

1. Refresh your ColdPitch app in the browser
2. Go to Staff page
3. Click "Edit" on any staff member
4. Select some duty days
5. Click "Update Staff"
6. ✅ Should work now!

## Optional: Set Default Duty Days for Existing Staff

If you want to set Mon-Fri as default for all existing staff:

```sql
UPDATE staff 
SET duty_days = ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
WHERE duty_days = '{}' OR duty_days IS NULL;
```

## Troubleshooting

### Error: "column duty_days does not exist"

**Cause:** The migration hasn't been run yet.

**Fix:** Run the SQL from Step 2 above.

### Error: "permission denied"

**Cause:** Supabase RLS (Row Level Security) might be blocking the update.

**Fix:** We disabled RLS earlier, but if it's re-enabled, run:
```sql
ALTER TABLE staff DISABLE ROW LEVEL SECURITY;
```

### Error: "invalid input syntax for type text[]"

**Cause:** The data being sent is in wrong format.

**Fix:** This shouldn't happen with our code, but if it does, check browser console for the actual data being sent.

### Error persists after running SQL

**Cause:** Browser cache or old connection.

**Fix:**
1. Hard refresh browser (Ctrl+Shift+R)
2. Restart dev server
3. Clear browser console and try again

## Verification

After running the migration:

1. **Check Column Exists:**
   ```sql
   SELECT * FROM staff LIMIT 1;
   ```
   Should show `duty_days` column in results.

2. **Test Update:**
   ```sql
   UPDATE staff 
   SET duty_days = ARRAY['Monday', 'Wednesday', 'Friday']
   WHERE id = 'some-staff-id';
   ```

3. **Test Query:**
   ```sql
   SELECT name, duty_days FROM staff;
   ```

## What This Column Does

The `duty_days` column:
- Stores an array of weekday names
- Example: `['Monday', 'Tuesday', 'Wednesday']`
- Used for attendance tracking
- Optional (can be empty array `{}`)
- Supports all 7 days of the week

## Error Handling Added

The app now shows better error messages:
- If column missing, console will show exact SQL to run
- Error toast shows specific error message
- No app crash, graceful handling

## Migration File

The migration is also saved in:
`supabase/migrations/006_add_duty_days_to_staff.sql`

You can run it from there or use the SQL above.

## Next Steps After Fix

Once the column is added:

1. ✅ Update staff duty days
2. ✅ View attendance badges on staff list
3. ✅ Track who logged in on duty days
4. ✅ See full schedule in staff details

---

**TL;DR:** Run this SQL in Supabase:
```sql
ALTER TABLE staff ADD COLUMN IF NOT EXISTS duty_days TEXT[] DEFAULT '{}';
```

Then refresh your app and try updating staff again! 🎉
