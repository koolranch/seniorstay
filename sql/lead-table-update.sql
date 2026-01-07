-- ============================================================================
-- Lead Table Schema Update for Lead Scoring System
-- Run this in Supabase SQL Editor
-- ============================================================================

-- Add new columns for lead scoring and attribution
ALTER TABLE "Lead" 
ADD COLUMN IF NOT EXISTS "urgencyScore" INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS "priority" TEXT DEFAULT 'normal',
ADD COLUMN IF NOT EXISTS "alertSent" BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS "utmSource" TEXT,
ADD COLUMN IF NOT EXISTS "utmMedium" TEXT,
ADD COLUMN IF NOT EXISTS "utmCampaign" TEXT,
ADD COLUMN IF NOT EXISTS "userAgent" TEXT,
ADD COLUMN IF NOT EXISTS "ipAddress" TEXT;

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS "Lead_email_idx" ON "Lead" ("email");
CREATE INDEX IF NOT EXISTS "Lead_urgencyScore_idx" ON "Lead" ("urgencyScore");
CREATE INDEX IF NOT EXISTS "Lead_sourceSlug_idx" ON "Lead" ("sourceSlug");
CREATE INDEX IF NOT EXISTS "Lead_createdAt_idx" ON "Lead" ("createdAt");
CREATE INDEX IF NOT EXISTS "Lead_priority_idx" ON "Lead" ("priority");

-- Update RLS policies if needed (allows anon key to insert leads)
-- Note: Adjust these policies based on your security requirements

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Allow anonymous lead submissions" ON "Lead";

-- Create policy to allow anonymous insertions
CREATE POLICY "Allow anonymous lead submissions"
ON "Lead"
FOR INSERT
TO anon
WITH CHECK (true);

-- Drop existing select policy if exists
DROP POLICY IF EXISTS "Allow authenticated to view leads" ON "Lead";

-- Create policy to allow authenticated users to view all leads
CREATE POLICY "Allow authenticated to view leads"
ON "Lead"
FOR SELECT
TO authenticated
USING (true);

-- Enable RLS on Lead table
ALTER TABLE "Lead" ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- Optional: Webhook trigger for high-priority leads
-- Uncomment if you want database-level triggers
-- ============================================================================

/*
-- Create function to notify on high-priority leads
CREATE OR REPLACE FUNCTION notify_high_priority_lead()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW."urgencyScore" > 80 AND (OLD IS NULL OR OLD."alertSent" = FALSE) THEN
    -- Use Supabase pg_net extension to call webhook
    -- Or use Supabase Realtime for real-time notifications
    PERFORM pg_notify('high_priority_lead', json_build_object(
      'lead_id', NEW.id,
      'name', NEW."fullName",
      'phone', NEW.phone,
      'email', NEW.email,
      'score', NEW."urgencyScore"
    )::text);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for high-priority leads
DROP TRIGGER IF EXISTS high_priority_lead_trigger ON "Lead";
CREATE TRIGGER high_priority_lead_trigger
  AFTER INSERT OR UPDATE ON "Lead"
  FOR EACH ROW
  EXECUTE FUNCTION notify_high_priority_lead();
*/

-- ============================================================================
-- Verify the changes
-- ============================================================================
SELECT 
  column_name, 
  data_type, 
  column_default
FROM information_schema.columns 
WHERE table_name = 'Lead' 
ORDER BY ordinal_position;

