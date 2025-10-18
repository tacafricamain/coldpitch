-- Add duty_days column to staff table
-- This column stores the days of the week when staff members are on duty

ALTER TABLE staff 
ADD COLUMN IF NOT EXISTS duty_days TEXT[] DEFAULT '{}';

-- Add comment to explain the column
COMMENT ON COLUMN staff.duty_days IS 'Days of the week when staff member is on duty (e.g., ["Monday", "Tuesday", "Wednesday"])';

-- Example: Update existing staff to have Monday-Friday duty days
-- Uncomment if you want to set default duty days for existing staff
-- UPDATE staff 
-- SET duty_days = ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
-- WHERE duty_days = '{}' OR duty_days IS NULL;
