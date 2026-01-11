-- Priority Community Image Updates
-- Generated: January 11, 2026
-- 
-- This script updates image_url for 16 priority Assisted Living and Memory Care
-- communities that were missing images. Images were discovered via Firecrawl scraping.
--
-- Run this SQL in your Supabase SQL Editor or via CLI.

-- 1. Concord Reserve (Concord) - Lutheran Senior Life
UPDATE "Community" 
SET image_url = 'https://lec.org/wp-content/uploads/Untitled-design-50.png'
WHERE name = 'Concord Reserve' AND neighborhood = 'Concord';

-- 2. Hamlet at Chagrin Falls (Chagrin Falls) - Hero image from website
UPDATE "Community" 
SET image_url = 'https://hamletretirement.com/wp-content/uploads/home-page-call-out-boxrs.jpg'
WHERE name = 'Hamlet at Chagrin Falls' AND neighborhood = 'Chagrin Falls';

-- 3. Beachwood Commons (Beachwood) - TalkFurther CDN image
UPDATE "Community" 
SET image_url = 'https://images.talkfurther.com/uploaded_facility/d8029298e98ed836c2d291b5d0c625c8.jpeg'
WHERE name = 'Beachwood Commons' AND neighborhood = 'Beachwood';

-- 4. Danbury Hudson (Hudson) - Danbury CDN image
UPDATE "Community" 
SET image_url = 'https://d2bsnvfgibl1g1.cloudfront.net/image/145023133959/image_698ir5ksk51lpaiteguranto22/-Tsquare1:1-FWEBP'
WHERE name = 'Danbury Hudson' AND neighborhood = 'Hudson';

-- 5. Devon Oaks (Westlake) - Eliza Jennings hero image
UPDATE "Community" 
SET image_url = 'https://devonoaks.elizajennings.org/wp-content/uploads/bb-plugin/cache/1-square-b0f278ca0cfd2377874c6ab4148e1732-v3gmhzq79s1d.jpg'
WHERE name = 'Devon Oaks' AND neighborhood = 'Westlake';

-- 6. Embassy of Rockport (Rocky River) - Embassy Healthcare image
UPDATE "Community" 
SET image_url = 'https://embassydata.wpenginepowered.com/wp-content/uploads/2024/11/location-content-section-generic.webp'
WHERE name = 'Embassy of Rockport' AND neighborhood = 'Rocky River';

-- 7. Hines Hill (Peninsula) - Hero aerial shot
UPDATE "Community" 
SET image_url = 'https://i0.wp.com/hineshillliving.com/wp-content/uploads/2023/05/20230518-DSC_0117-Edit-Edit.jpg'
WHERE name = 'Hines Hill' AND neighborhood = 'Peninsula';

-- 8. Hudson Grande (Hudson) - Building exterior
UPDATE "Community" 
SET image_url = 'https://www.hudsongrandeseniorliving.com/wp-content/uploads/sites/3/2024/05/hg-scaled.jpg'
WHERE name = 'Hudson Grande' AND neighborhood = 'Hudson';

-- 9. Lakeside at The Normandy (Rocky River) - OG social sharing image
UPDATE "Community" 
SET image_url = 'https://thenormandy.com/wp-content/uploads/2024/07/Lakeside-SocialSharing-AssistedLiving.png'
WHERE name = 'Lakeside at The Normandy' AND neighborhood = 'Rocky River';

-- 10. Saint Therese of Westlake (Westlake) - Bird's eye aerial view
UPDATE "Community" 
SET image_url = 'https://lirp.cdn-website.com/4b776b3e/dms3rep/multi/opt/Westlake_Birds+Eye+View-1920w.jpg'
WHERE name = 'Saint Therese of Westlake' AND neighborhood = 'Westlake';

-- 11. Villas at King David (Beachwood) - Vimeo thumbnail
UPDATE "Community" 
SET image_url = 'https://i.vimeocdn.com/video/1771439009-9c1b77bb951d7788833b6b12863327d9b325e3ccd6329f8f0457f8d217545281-d_1920x1080?r=pad'
WHERE name = 'Villas at King David' AND neighborhood = 'Beachwood';

-- 12. Vitalia Westlake (Westlake) - TalkFurther CDN image
UPDATE "Community" 
SET image_url = 'https://images.talkfurther.com/uploaded_facility/0c5421bfd078407bc944a143cb0595dc.jpeg'
WHERE name = 'Vitalia Westlake' AND neighborhood = 'Westlake';

-- 13. Rocky River Village (Rocky River) - Caring.com CDN image
UPDATE "Community" 
SET image_url = 'https://d13iq96prksfh0.cloudfront.net/cdn/photos/106930/900x600'
WHERE name = 'Rocky River Village' AND neighborhood = 'Rocky River';

-- 14. Wiggins Place (Beachwood) - Jewish Care Guide gallery image
UPDATE "Community" 
SET image_url = 'https://jewishcareguide.com/uploads/gallery/Captura%20de%20pantalla%202017-03-20%20a%20las%202.10.07.png'
WHERE name = 'Wiggins Place' AND neighborhood = 'Beachwood';

-- 15. Lantern of Chagrin Valley (Chagrin Falls) - Elder Life Financial image
UPDATE "Community" 
SET image_url = 'https://media.elderlifefinancial.com/community_images/oasis/7811/7ee6ed31-77a9-42ce-be51-c9e235f7b922_large.jpg?format=auto&width=747&height=400'
WHERE name = 'Lantern of Chagrin Valley' AND neighborhood = 'Chagrin Falls';

-- 16. Windsor Heights (Beachwood) - Sunshine Retirement OG image
UPDATE "Community" 
SET image_url = 'https://www.sunshineretirementliving.com/wp-content/uploads/2017/07/windsor-heights-2-3-1.jpg'
WHERE name = 'Windsor Heights' AND neighborhood = 'Beachwood';

-- Verify updates
SELECT name, neighborhood, image_url 
FROM "Community" 
WHERE name IN (
  'Concord Reserve', 'Hamlet at Chagrin Falls', 'Beachwood Commons',
  'Danbury Hudson', 'Devon Oaks', 'Embassy of Rockport', 'Hines Hill',
  'Hudson Grande', 'Lakeside at The Normandy', 'Saint Therese of Westlake',
  'Villas at King David', 'Vitalia Westlake', 'Rocky River Village',
  'Wiggins Place', 'Lantern of Chagrin Valley', 'Windsor Heights'
)
ORDER BY name;
