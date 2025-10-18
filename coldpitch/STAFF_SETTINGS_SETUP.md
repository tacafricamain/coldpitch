# Staff and Settings Setup Instructions

## 🗄️ Database Migration

### Step 1: Run SQL Migration in Supabase

1. **Go to your Supabase project dashboard**
   - Navigate to: https://supabase.com/dashboard/project/YOUR_PROJECT_ID

2. **Open the SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Copy and paste the entire SQL migration**
   - Open the file: `DATABASE_MIGRATION.sql`
   - Copy all the SQL code
   - Paste it into the Supabase SQL Editor

4. **Run the migration**
   - Click the "Run" button (or press Ctrl+Enter)
   - Wait for the success message

### What the migration creates:

✅ **staff** table
- Stores staff members with roles, avatars, login times, and lead counts
- Sample staff: Admin User, John Doe, Sarah Smith, Mike Johnson

✅ **activity_logs** table
- Tracks all user actions (create, update, delete)
- Includes user info, action type, entity type, and details

✅ **settings** table
- Stores user-specific settings
- Profile info, notification preferences, API keys, team settings

✅ **Indexes for performance**
- Optimized queries for staff, activity logs, and prospects

✅ **Row Level Security (RLS)**
- Enabled on all new tables with open policies (can be restricted later)

✅ **Sample data**
- 4 staff members with login history
- Multiple activity log entries

## 🎨 Frontend Pages Created

### Staff Page (`/staff`)
**Features:**
- 📊 Staff overview with KPI cards (total staff, active staff, total leads, activities)
- 👥 Staff member list with avatars, roles, last login, and lead counts
- 📝 Real-time activity timeline showing all staff actions
- 🔍 Click on any staff member to see detailed stats:
  - Role, status, total leads added
  - Login count and history
  - Personal activity history

**Access:** Click "Staff" in the sidebar or navigate to `/staff`

### Settings Page (`/settings`)
**Features:**
- 👤 **Profile Settings:**
  - Update name, email, phone
  - Set timezone
  
- 🔔 **Notifications:**
  - Email notifications toggle
  - Browser notifications toggle
  - New reply alerts
  - Daily summary
  - Weekly reports

- 🔑 **API Keys:**
  - OpenAI API key (for AI pitch generation)
  - SendGrid API key (for email campaigns)
  - Twilio API key (for SMS/WhatsApp)

- 👥 **Team Settings:**
  - Company name and website
  - Default email signature
  - Auto-assign leads toggle

**Access:** Click "Settings" in the sidebar or navigate to `/settings`

## 🔄 Live Database Integration

All features are **fully integrated with Supabase**:

### Staff Management
```typescript
import { staffService } from '../services/staffService';

// Get all staff
const staff = await staffService.getAllStaff();

// Create activity log
await staffService.createActivityLog({
  user_id: staffId,
  user_name: 'John Doe',
  action: 'created prospect',
  entity_type: 'prospect',
  entity_id: prospectId,
  details: { name: 'Acme Corp' }
});

// Record login
await staffService.recordLogin(staffId);
```

### Settings Management
```typescript
import { settingsService } from '../services/settingsService';

// Get settings
const settings = await settingsService.getSettings(userId);

// Update profile
await settingsService.updateProfile(userId, {
  name: 'John Doe',
  email: 'john@example.com',
  timezone: 'America/New_York'
});

// Update notifications
await settingsService.updateNotifications(userId, {
  email_notifications: true,
  browser_notifications: false,
  // ...
});
```

## 🚀 Testing the Features

### Test Staff Page:
1. Navigate to `/staff`
2. You should see 4 staff members
3. Click on any staff member to see their details
4. Check the activity timeline on the right

### Test Settings Page:
1. Navigate to `/settings`
2. Try updating your profile information
3. Toggle notification preferences
4. Add API keys (optional)
5. Configure team settings
6. Click "Save Changes" to persist to database

## 📊 Database Schema

### staff table
```sql
id UUID PRIMARY KEY
name TEXT NOT NULL
email TEXT UNIQUE NOT NULL
role TEXT (Admin|Sales Manager|Sales Rep|Staff)
avatar_seed TEXT
login_times TIMESTAMPTZ[]
total_leads_added INTEGER
status TEXT (active|inactive)
created_at TIMESTAMPTZ
updated_at TIMESTAMPTZ
```

### activity_logs table
```sql
id UUID PRIMARY KEY
user_id UUID (references staff)
user_name TEXT
action TEXT
entity_type TEXT (prospect|campaign|template|staff|settings)
entity_id TEXT
details JSONB
timestamp TIMESTAMPTZ
```

### settings table
```sql
id UUID PRIMARY KEY
user_id UUID (references staff)
profile JSONB
notifications JSONB
api_keys JSONB
team_settings JSONB
created_at TIMESTAMPTZ
updated_at TIMESTAMPTZ
```

## 🔗 Integration with Prospects

The prospects table now has:
- `user_id` - References the staff member who added the lead
- `added_by` - Name of the staff member

This enables lead attribution and tracking which staff member added each prospect.

## 📝 Next Steps

1. **Run the migration** in Supabase SQL Editor
2. **Refresh your app** - The Staff and Settings menu items should appear
3. **Test the pages** - Navigate to `/staff` and `/settings`
4. **Customize** - Update staff roles, add more team members, configure settings

## 🛠️ Troubleshooting

**If you see "Load failed" errors:**
1. Check your Supabase credentials in `.env.local`
2. Verify the migration ran successfully in Supabase
3. Check browser console for specific errors

**If tables don't exist:**
1. Re-run the `DATABASE_MIGRATION.sql` file
2. Check for SQL errors in Supabase dashboard

**If RLS blocks access:**
1. The policies are set to allow all access for now
2. You can restrict access later by modifying the policies

## ✅ Verification Checklist

- [ ] Migration SQL runs without errors
- [ ] Can see 4 staff members in the database
- [ ] Can see activity logs in the database
- [ ] Staff page loads and displays all members
- [ ] Settings page loads and shows all tabs
- [ ] Can update and save settings
- [ ] Activity timeline shows recent actions
- [ ] Staff details modal works when clicking members
