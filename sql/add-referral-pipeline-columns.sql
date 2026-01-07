-- ============================================================================
-- COMMISSION-FIRST REFERRAL PIPELINE - Database Migration
-- Guide for Seniors - Cleveland Senior Living Placement
-- ============================================================================

-- Add referral pipeline status tracking
ALTER TABLE "Lead"
ADD COLUMN IF NOT EXISTS referral_status VARCHAR(50) DEFAULT 'new';

COMMENT ON COLUMN "Lead".referral_status IS 'Pipeline status: new, referral_sent, tour_scheduled, admitted, paid';

-- Add referral notification timestamp
ALTER TABLE "Lead"
ADD COLUMN IF NOT EXISTS referral_sent_at TIMESTAMP;

COMMENT ON COLUMN "Lead".referral_sent_at IS 'When referral notification was sent to community';

-- Add commission tracking columns
ALTER TABLE "Lead"
ADD COLUMN IF NOT EXISTS estimated_commission DECIMAL(10, 2);

ALTER TABLE "Lead"
ADD COLUMN IF NOT EXISTS actual_commission DECIMAL(10, 2);

ALTER TABLE "Lead"
ADD COLUMN IF NOT EXISTS commission_paid_at TIMESTAMP;

COMMENT ON COLUMN "Lead".estimated_commission IS 'Estimated commission based on city average (100% first month rent)';
COMMENT ON COLUMN "Lead".actual_commission IS 'Final commission amount received';

-- Add community admissions contact fields
ALTER TABLE "Lead"
ADD COLUMN IF NOT EXISTS admissions_contact_email VARCHAR(255);

ALTER TABLE "Lead"
ADD COLUMN IF NOT EXISTS admissions_contact_name VARCHAR(255);

ALTER TABLE "Lead"
ADD COLUMN IF NOT EXISTS admissions_contact_phone VARCHAR(50);

ALTER TABLE "Lead"
ADD COLUMN IF NOT EXISTS communityId VARCHAR(255);

-- Add financial readiness indicators
ALTER TABLE "Lead"
ADD COLUMN IF NOT EXISTS is_high_value BOOLEAN DEFAULT FALSE;

ALTER TABLE "Lead"
ADD COLUMN IF NOT EXISTS calculated_budget DECIMAL(10, 2);

ALTER TABLE "Lead"
ADD COLUMN IF NOT EXISTS home_value DECIMAL(12, 2);

ALTER TABLE "Lead"
ADD COLUMN IF NOT EXISTS value_gap DECIMAL(10, 2);

COMMENT ON COLUMN "Lead".is_high_value IS 'TRUE if homeValue > $350k OR valueGap > $500/mo';
COMMENT ON COLUMN "Lead".calculated_budget IS 'Monthly senior living budget from calculator';
COMMENT ON COLUMN "Lead".home_value IS 'Home value from affordability calculator';
COMMENT ON COLUMN "Lead".value_gap IS 'Monthly savings vs staying home';

-- Add tour and admission tracking
ALTER TABLE "Lead"
ADD COLUMN IF NOT EXISTS tour_scheduled_at TIMESTAMP;

ALTER TABLE "Lead"
ADD COLUMN IF NOT EXISTS tour_completed_at TIMESTAMP;

ALTER TABLE "Lead"
ADD COLUMN IF NOT EXISTS admitted_at TIMESTAMP;

ALTER TABLE "Lead"
ADD COLUMN IF NOT EXISTS move_in_date DATE;

-- Add advisor notes
ALTER TABLE "Lead"
ADD COLUMN IF NOT EXISTS advisor_notes TEXT;

-- Create indexes for pipeline queries
CREATE INDEX IF NOT EXISTS "Lead_referral_status_idx" ON "Lead"(referral_status);
CREATE INDEX IF NOT EXISTS "Lead_is_high_value_idx" ON "Lead"(is_high_value) WHERE is_high_value = TRUE;
CREATE INDEX IF NOT EXISTS "Lead_referral_sent_at_idx" ON "Lead"(referral_sent_at) WHERE referral_sent_at IS NOT NULL;

-- ============================================================================
-- CITY AVERAGE COMMISSION RATES (2026 Cleveland Market)
-- Used to estimate commission at lead creation
-- ============================================================================

-- Create commission rates reference table
CREATE TABLE IF NOT EXISTS commission_rates (
  id SERIAL PRIMARY KEY,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(2) DEFAULT 'OH',
  care_type VARCHAR(50) NOT NULL, -- 'assisted_living', 'memory_care', 'independent_living'
  avg_monthly_rate DECIMAL(10, 2) NOT NULL, -- Average first month rent (= commission)
  commission_percentage DECIMAL(5, 2) DEFAULT 100.00, -- 100% of first month
  effective_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(city, care_type)
);

-- Insert 2026 Cleveland market commission rates
INSERT INTO commission_rates (city, care_type, avg_monthly_rate) VALUES
  -- Premium Tier Cities
  ('Beachwood', 'assisted_living', 6800.00),
  ('Beachwood', 'memory_care', 8200.00),
  ('Shaker Heights', 'assisted_living', 6200.00),
  ('Shaker Heights', 'memory_care', 7800.00),
  ('Westlake', 'assisted_living', 5800.00),
  ('Westlake', 'memory_care', 7200.00),
  ('Rocky River', 'assisted_living', 5600.00),
  ('Rocky River', 'memory_care', 7000.00),
  ('Solon', 'assisted_living', 5900.00),
  ('Solon', 'memory_care', 7400.00),
  -- Volume Tier Cities
  ('Parma', 'assisted_living', 4900.00),
  ('Parma', 'memory_care', 6200.00),
  ('Strongsville', 'assisted_living', 5400.00),
  ('Strongsville', 'memory_care', 6800.00),
  ('Lakewood', 'assisted_living', 5600.00),
  ('Lakewood', 'memory_care', 7000.00),
  ('Mentor', 'assisted_living', 5200.00),
  ('Mentor', 'memory_care', 6600.00),
  -- Cleveland Metro Average
  ('Cleveland', 'assisted_living', 5520.00),
  ('Cleveland', 'memory_care', 6800.00),
  ('Cleveland', 'independent_living', 3200.00)
ON CONFLICT (city, care_type) DO UPDATE SET
  avg_monthly_rate = EXCLUDED.avg_monthly_rate;

-- ============================================================================
-- EXAMPLE QUERIES FOR COMMISSION DASHBOARD
-- ============================================================================

-- Total Pipeline Value Query:
-- SELECT 
--   referral_status,
--   COUNT(*) as lead_count,
--   SUM(estimated_commission) as pipeline_value
-- FROM "Lead"
-- WHERE referral_status != 'paid'
-- GROUP BY referral_status;

-- High-Value Leads Awaiting Referral:
-- SELECT * FROM "Lead"
-- WHERE is_high_value = TRUE 
-- AND referral_status = 'new'
-- ORDER BY estimated_commission DESC;

-- Monthly Commission Report:
-- SELECT 
--   DATE_TRUNC('month', commission_paid_at) as month,
--   SUM(actual_commission) as total_commission,
--   COUNT(*) as placements
-- FROM "Lead"
-- WHERE referral_status = 'paid'
-- GROUP BY DATE_TRUNC('month', commission_paid_at)
-- ORDER BY month DESC;

