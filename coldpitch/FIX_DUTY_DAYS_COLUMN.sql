-- Quick check if duty_days column exists
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'staff' 
AND column_name = 'duty_days';

-- If the above returns no rows, run this to add the column:
ALTER TABLE staff 
ADD COLUMN IF NOT EXISTS duty_days TEXT[] DEFAULT '{}';

-- Verify it was added:
SELECT column_name, data_type, column_default
FROM information_schema.columns 
WHERE table_name = 'staff' 
AND column_name = 'duty_days';

-- Optional: Set default duty days for existing staff (Mon-Fri)
-- UPDATE staff 
-- SET duty_days = ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
-- WHERE duty_days = '{}' OR duty_days IS NULL;
