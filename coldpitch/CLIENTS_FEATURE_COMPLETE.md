# Client Projects & Renewal Tracking Feature

## Overview
This feature allows you to track client projects, manage renewals (domains, hosting, maintenance), and automatically include renewal revenue in the dashboard's total revenue.

## What Was Built

### 1. **Client Projects Page** (`/clients`)
A comprehensive page to manage all client projects with:
- **Project Information**: Client name, project name, type, description, amount
- **Renewal Tracking**: Renewal type (Domain/Hosting/Maintenance/License), renewal dates, renewal amount
- **Payment Status**: Track payment status (Unpaid/Partial/Paid) and amount paid
- **Status Management**: Renewal status (Pending/Paid/Overdue/Cancelled/N/A)
- **Auto-Renewal**: Toggle automatic renewal for projects

### 2. **Features**
- ✅ **Stats Dashboard**: Shows total projects, active renewals, paid renewals, and renewal revenue
- ✅ **Filter by Status**: Filter projects by renewal status (All/Pending/Paid/Overdue/N/A)
- ✅ **Quick Actions**: Mark renewals as paid with one click
- ✅ **Renewal Alerts**: Highlights renewals due within 30 days
- ✅ **Responsive Design**: Works on mobile and desktop
- ✅ **Revenue Integration**: Renewal revenue automatically added to dashboard total revenue

### 3. **Project Types**
- Website
- Mobile App
- Software
- Hosting
- Domain
- Other

### 4. **Renewal Types**
- Domain (annual domain registration)
- Hosting (web hosting services)
- Maintenance (ongoing maintenance contracts)
- License (software licenses)
- None (one-time projects)

### 5. **Renewal Statuses**
- **Pending**: Renewal is due but not yet paid
- **Paid**: Renewal has been paid
- **Overdue**: Renewal date has passed without payment
- **Cancelled**: Renewal was cancelled
- **N/A**: No renewal required (one-time project)

## Database Structure

### `client_projects` Table
```sql
- id (UUID)
- client_id (TEXT)
- client_name (TEXT)
- project_name (TEXT)
- project_type (TEXT)
- description (TEXT)
- amount (DECIMAL)
- renewal_type (TEXT)
- renewal_date (TIMESTAMP)
- next_renewal_date (TIMESTAMP)
- renewal_amount (DECIMAL)
- renewal_status (TEXT)
- payment_status (TEXT)
- amount_paid (DECIMAL)
- last_payment_date (TIMESTAMP)
- auto_renew (BOOLEAN)
- notes (TEXT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

## How to Use

### 1. **Add a New Project**
1. Navigate to **Clients** page
2. Click **+ New Project** button
3. Fill in the project details:
   - Client name and project name (required)
   - Project type (Website, App, etc.)
   - Project amount
   - Renewal information (if applicable)
4. Click **Create Project**

### 2. **Track Renewals**
- Set **Renewal Type** (Domain/Hosting/Maintenance/License)
- Enter **Renewal Date** (when renewal started)
- Enter **Next Renewal Date** (when next payment is due)
- Set **Renewal Amount** (how much the renewal costs)
- Set **Renewal Status** to "Pending" for upcoming renewals

### 3. **Mark Renewals as Paid**
- When a client pays for renewal, click the **Mark Paid** button
- This will:
  - Update renewal status to "Paid"
  - Update payment status to "Paid"
  - Record the payment date
  - Add the amount to total revenue on the dashboard

### 4. **View Revenue**
- Dashboard's **Total Revenue** now includes:
  - Invoice payments
  - Renewal payments from client projects
- Clients page shows **Renewal Revenue** separately

## Setup Instructions

### 1. **Run Database Migration**
Execute the SQL file in Supabase:
```bash
# Run this SQL in Supabase SQL Editor
supabase/migrations/create_client_projects_table.sql
```

### 2. **Verify Route**
The route is already added to the app:
- Path: `/clients`
- Menu item added to sidebar with Building2 icon

### 3. **Test the Feature**
1. Login to the app
2. Navigate to **Clients** from the sidebar
3. Add a test project:
   - Client: "Acme Corp"
   - Project: "Company Website"
   - Type: "Website"
   - Amount: 500,000
   - Renewal Type: "Hosting"
   - Next Renewal: Set to 1 month from today
   - Renewal Amount: 50,000
   - Status: "Pending"
4. Mark the renewal as paid
5. Check the dashboard - total revenue should now include the renewal amount

## Benefits

1. **Centralized Tracking**: All client projects in one place
2. **Revenue Visibility**: See total revenue including renewals
3. **Proactive Management**: Get alerts for upcoming renewals
4. **Client Retention**: Track renewal status to follow up with clients
5. **Financial Planning**: Forecast recurring revenue from renewals
6. **Automated Calculations**: Dashboard automatically includes renewal revenue

## Future Enhancements

- [ ] Email notifications for upcoming renewals (30 days, 7 days, 1 day before)
- [ ] Auto-renew integration with payment gateways
- [ ] Client portal for self-service renewals
- [ ] Renewal history tracking
- [ ] Revenue analytics by project type
- [ ] Export client project reports

## Components Created

### Pages
- `src/pages/Clients/Clients.tsx` - Main clients page

### Components
- `src/components/ClientProjectModal/ClientProjectModal.tsx` - Add/Edit project modal

### Services
- `src/services/clientService.ts` - Client and project API service

### Types
- Updated `src/types/index.ts` with `ClientProject` interface

### Database
- `supabase/migrations/create_client_projects_table.sql` - Migration file

## Integration Points

### Dashboard
- Added `clientService.getRenewalRevenue()` to fetch paid renewal amounts
- Total Revenue = Invoice Revenue + Renewal Revenue

### Sidebar
- Added "Clients" menu item with Building2 icon
- Route: `/clients`

### App Router
- Added `/clients` route to `App.tsx`

## Notes
- All renewal payments marked as "Paid" are automatically included in dashboard revenue
- Projects without renewals (renewal_type = "None") show status as "N/A"
- The system highlights renewals due within 30 days
- Responsive design works on mobile, tablet, and desktop
