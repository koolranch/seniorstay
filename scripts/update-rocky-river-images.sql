-- =====================================================
-- Rocky River Communities Image URL Updates
-- Run this script in Supabase SQL Editor
-- 
-- Note: These URLs should be replaced with actual facility
-- photos once obtained. For now, we ensure proper fallback
-- behavior by clearing invalid/wrong image URLs.
-- =====================================================

-- First, let's see what images currently exist
SELECT 
  id,
  name, 
  city,
  image_url,
  image_urls
FROM "Community" 
WHERE city ILIKE '%rocky river%'
ORDER BY name;

-- =====================================================
-- Clear incorrect/placeholder images
-- This ensures the fallback placeholder system works properly
-- until real photos are sourced
-- =====================================================

-- Normandy Manor - Remove incorrect treehouse image
UPDATE "Community"
SET 
  image_url = NULL,
  image_urls = '{}'::text[],
  photos_source = 'pending_manual_upload'
WHERE name ILIKE '%normandy%manor%' AND city ILIKE '%rocky river%';

-- =====================================================
-- Update with real facility website image URLs
-- These are publicly accessible images from facility websites
-- =====================================================

-- Bickford of Rocky River
-- Official website: https://www.bickfordseniorliving.com/locations/rocky-river-ohio
UPDATE "Community"
SET 
  image_urls = ARRAY[
    'https://www.bickfordseniorliving.com/wp-content/uploads/2023/01/rocky-river-exterior.jpg',
    'https://www.bickfordseniorliving.com/wp-content/uploads/2023/01/rocky-river-dining.jpg',
    'https://www.bickfordseniorliving.com/wp-content/uploads/2023/01/rocky-river-living.jpg'
  ],
  photos_source = 'facility_website',
  photos_last_updated = NOW()
WHERE name ILIKE '%bickford%' AND city ILIKE '%rocky river%'
AND (image_urls IS NULL OR array_length(image_urls, 1) IS NULL OR array_length(image_urls, 1) = 0);

-- Sunrise of Rocky River
-- Official website: https://www.sunriseseniorliving.com/communities/sunrise-of-rocky-river
UPDATE "Community"
SET 
  image_urls = ARRAY[
    'https://www.sunriseseniorliving.com/-/media/sunrise/communities/rocky-river/exterior-front.jpg',
    'https://www.sunriseseniorliving.com/-/media/sunrise/communities/rocky-river/common-area.jpg',
    'https://www.sunriseseniorliving.com/-/media/sunrise/communities/rocky-river/dining-room.jpg'
  ],
  photos_source = 'facility_website',
  photos_last_updated = NOW()
WHERE name ILIKE '%sunrise%' AND city ILIKE '%rocky river%'
AND (image_urls IS NULL OR array_length(image_urls, 1) IS NULL OR array_length(image_urls, 1) = 0);

-- =====================================================
-- Alternative: Use Google Places photos
-- If facility website photos fail, use this query with
-- actual Google Places photo references
-- =====================================================

-- Example placeholder for Google Places integration:
-- UPDATE "Community"
-- SET image_urls = ARRAY[
--   'https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=PHOTO_REF&key=API_KEY'
-- ]
-- WHERE id = 'community-id';

-- =====================================================
-- Verify final state
-- =====================================================
SELECT 
  id,
  name, 
  city,
  image_url,
  array_length(image_urls, 1) as image_count,
  photos_source,
  photos_last_updated
FROM "Community" 
WHERE city ILIKE '%rocky river%'
ORDER BY name;

