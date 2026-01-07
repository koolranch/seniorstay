-- Add meta_data JSONB column to Lead table for structured calculator data
-- This stores calculator inputs and results for lead scoring and analytics

ALTER TABLE "Lead"
ADD COLUMN IF NOT EXISTS meta_data JSONB;

-- Add comment for documentation
COMMENT ON COLUMN "Lead".meta_data IS 'Structured JSON data from affordability calculator. Contains: homeValue, valueGap, propertyTax, totalHomeCost, seniorLivingCost, selectedLocation, isHighValue, etc.';

-- Create index for querying high-value leads by calculator data
CREATE INDEX IF NOT EXISTS "Lead_meta_data_homeValue_idx" 
ON "Lead" ((meta_data->>'homeValue')::numeric) 
WHERE meta_data IS NOT NULL;

CREATE INDEX IF NOT EXISTS "Lead_meta_data_valueGap_idx" 
ON "Lead" ((meta_data->>'valueGap')::numeric) 
WHERE meta_data IS NOT NULL;

-- Example query to find high-value calculator leads:
-- SELECT * FROM "Lead" 
-- WHERE meta_data IS NOT NULL 
-- AND ((meta_data->>'homeValue')::numeric > 350000 OR (meta_data->>'valueGap')::numeric > 500);

