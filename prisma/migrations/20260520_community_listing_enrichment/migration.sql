-- Community listing enrichment fields (pricing, availability, amenities, Ohio license)
ALTER TABLE "Community"
  ADD COLUMN IF NOT EXISTS starting_price_monthly INTEGER,
  ADD COLUMN IF NOT EXISTS availability_status TEXT,
  ADD COLUMN IF NOT EXISTS ohio_license_number TEXT,
  ADD COLUMN IF NOT EXISTS amenity_tags TEXT[] DEFAULT '{}';

COMMENT ON COLUMN "Community".starting_price_monthly IS 'Advisor-confirmed starting monthly rent in USD';
COMMENT ON COLUMN "Community".availability_status IS 'tours_available | waitlist | call_for_availability';
COMMENT ON COLUMN "Community".amenity_tags IS 'Scraped or verified amenity labels for UI display';
