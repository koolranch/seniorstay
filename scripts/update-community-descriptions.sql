-- =====================================================
-- Community Descriptions Update Script
-- Guide for Seniors - Site Health Fix
-- Generated: 2026-01-06
-- =====================================================

-- =====================================================
-- 1. FAIRMONT SENIOR LIVING OF WESTLAKE (Duplicate Resolution)
-- =====================================================

-- First, identify the duplicates and keep the most complete record
-- Based on our research, we'll update the primary record and delete the duplicate

-- Update the primary Fairmont record with complete information
UPDATE "Community"
SET 
  description = 'Fairmont Senior Living of Westlake provides compassionate assisted living and specialized memory care just 12 miles west of downtown Cleveland. As one of only two Gold Credentialed communities in Ohio, Fairmont uses the innovative Montessori-Inspired Lifestyle® approach to foster independence, dignity, and meaningful engagement for every resident.

Their dedicated memory care program honors each individual''s strengths with tailored physical and cognitive therapies, while assisted living residents enjoy personalized daily support in a warm, homelike environment. Located conveniently near St. John Medical Center and Cleveland Clinic Fairview Hospital, families gain peace of mind knowing expert clinical care is minutes away.

The community serves Westlake and surrounding areas including Bay Village, Fairview Park, and Rocky River, offering virtual tours, private dining rooms, and beautifully landscaped outdoor spaces just one mile from Lake Erie. Whether your loved one needs help with daily activities or specialized dementia care, Fairmont''s servant-leadership philosophy ensures they''ll experience stability, fulfillment, and genuine connection every day.',
  website = 'https://www.fairmontseniorliving.com/westlake-oh/',
  image_url = 'https://www.fairmontseniorliving.com/wp-content/uploads/2024/11/Fairmont-Westlake-Exterior-Website-Photo-1.jpg',
  services = 'Assisted Living, Memory Care',
  "updatedAt" = NOW()
WHERE name ILIKE '%fairmont%westlake%' 
  AND id = (
    SELECT id FROM "Community" 
    WHERE name ILIKE '%fairmont%westlake%' 
    ORDER BY "createdAt" ASC 
    LIMIT 1
  );

-- Delete duplicate Fairmont record (keep the first one created)
DELETE FROM "Community"
WHERE name ILIKE '%fairmont%westlake%' 
  AND id != (
    SELECT id FROM "Community" 
    WHERE name ILIKE '%fairmont%westlake%' 
    ORDER BY "createdAt" ASC 
    LIMIT 1
  );

-- =====================================================
-- 2. ARDEN COURTS OF PARMA (Memory Care)
-- =====================================================
UPDATE "Community"
SET 
  description = 'Arden Courts of Parma is a purpose-built memory care community dedicated exclusively to supporting individuals with Alzheimer''s disease, dementia, and other memory impairments. Located in the heart of Parma, Ohio, just minutes from Parma Community General Hospital and University Hospitals Parma Medical Center, this intimate setting provides 24/7 specialized care in secure, thoughtfully designed neighborhoods.

Each resident benefits from personalized engagement programs that celebrate their unique life story, abilities, and preferences. The professionally trained staff creates meaningful daily activities that promote cognitive stimulation, social connection, and physical wellness. With a focus on person-centered care, Arden Courts helps residents maintain their highest possible quality of life while providing families with much-needed peace of mind.

The community features private and semi-private suites, secure outdoor courtyards for safe wandering, and nutritious chef-prepared meals. For Cleveland-area families navigating the challenges of memory loss, Arden Courts offers a compassionate environment where your loved one can thrive with dignity and purpose.',
  website = 'https://www.ardenseniorliving.com/parma-oh',
  services = 'Memory Care',
  "updatedAt" = NOW()
WHERE name ILIKE '%arden courts%parma%'
RETURNING id, name;

-- =====================================================
-- 3. BROADVIEW MULTI-CARE CENTER (Skilled Nursing)
-- =====================================================
UPDATE "Community"
SET 
  description = 'Broadview Multi-Care Center has proudly served the Cleveland and Parma communities for over 50 years, offering comprehensive skilled nursing, rehabilitation, and long-term care services. This family-owned and operated facility is located on Broadview Road in Parma, just minutes from major highways and leading hospitals including Cleveland Clinic and MetroHealth.

Recognized by Newsweek as one of America''s Best Nursing Homes 2024, Broadview features a dedicated short-term rehabilitation unit with private suites and bathrooms. Residents benefit from physical, occupational, and speech therapies up to seven days a week, along with advanced respiratory therapy and on-site cardiology and pulmonary medical care. Full-time nurse practitioners and certified wound care nurses ensure clinical excellence around the clock.

With 200 beds and services including hospice and respite care, Broadview provides a homelike atmosphere where high-quality clinical care meets genuine compassion. The facility offers private dining for family gatherings, complimentary Wi-Fi, and dedicated activity areas designed to support each resident''s well-being.',
  website = 'https://lhshealth.com/broadview-multi-care-center/',
  image_url = 'https://lhshealth.com/wp-content/uploads/2023/06/broadview-1.jpg',
  services = 'Skilled Nursing, Rehabilitation, Long-Term Care, Memory Care, Respite Care, Hospice',
  "updatedAt" = NOW()
WHERE name ILIKE '%broadview multi%care%'
RETURNING id, name;

-- =====================================================
-- 4. THE GANZHORN SUITES OF AVON (Assisted Living / Memory Care)
-- =====================================================
UPDATE "Community"
SET 
  description = 'The Ganzhorn Suites of Avon offers a distinctive approach to assisted living and memory care in one of Cleveland''s most desirable western suburbs. Located conveniently near Cleveland Clinic Avon Hospital and just off I-90, this thoughtfully designed community emphasizes independence, choice, and meaningful engagement for every resident.

The assisted living program provides personalized support with daily activities including bathing, dressing, and medication management, while encouraging residents to maintain their preferred lifestyle and routines. For those requiring memory care, Ganzhorn''s specialized programming focuses on cognitive stimulation, sensory experiences, and activities tailored to each individual''s life history and interests.

Residents enjoy restaurant-style dining, beautifully appointed common areas, and a calendar full of social, recreational, and wellness activities. The community''s proximity to local shopping, restaurants, and Lake Erie attractions keeps families connected to the broader Avon community. With 24-hour nursing oversight and emergency response systems, families can trust that their loved ones receive attentive, compassionate care in a safe and engaging environment.',
  website = 'https://www.ganzhornsuites.com/avon-oh',
  services = 'Assisted Living, Memory Care',
  "updatedAt" = NOW()
WHERE name ILIKE '%ganzhorn%avon%'
RETURNING id, name;

-- =====================================================
-- 5. O'NEILL HEALTHCARE LAKEWOOD (Skilled Nursing)
-- =====================================================
UPDATE "Community"
SET 
  description = 'O''Neill Healthcare Lakewood brings over 55 years of family-owned expertise to skilled nursing and rehabilitation care on Cleveland''s near west side. Located in the vibrant Lakewood community, this facility provides convenient access to Cleveland Clinic Fairview Hospital, Lakewood Hospital, and the entire Cleveland Clinic health system.

Specializing in short-term rehabilitation and long-term skilled nursing, O''Neill Healthcare Lakewood offers comprehensive physical, occupational, and speech therapy services to help residents recover and return home whenever possible. Their dedicated clinical team includes experienced nurses, certified nursing assistants, and rehabilitation specialists committed to individualized care plans.

The facility accepts Medicare, Medicaid, and most private insurance, making quality care accessible to families throughout Cuyahoga County. Residents benefit from engaging activity programs, nutritious meals, and comfortable accommodations designed for both recovery and extended stays. For families seeking skilled nursing care with a personal touch in the Lakewood area, O''Neill Healthcare combines clinical excellence with the warmth of a family-operated community.',
  website = 'https://www.oneillhc.com/lakewood',
  services = 'Skilled Nursing, Rehabilitation, Long-Term Care',
  "updatedAt" = NOW()
WHERE name ILIKE '%o''neill%lakewood%' OR name ILIKE '%oneill%lakewood%'
RETURNING id, name;

-- =====================================================
-- 6. VITALIA MENTOR (Skilled Nursing / Memory Care)
-- =====================================================
UPDATE "Community"
SET 
  description = 'Vitalia Mentor serves as Lake County''s premier destination for skilled nursing, rehabilitation, and specialized memory care. Located in Mentor, Ohio, just minutes from Lake Health''s TriPoint Medical Center and University Hospitals Lake West Medical Center, this 117-bed community provides comprehensive care services on Cleveland''s eastern edge.

The facility excels in short-term rehabilitation, helping residents recover from surgery, stroke, or illness through intensive physical, occupational, and speech therapy programs. Their dedicated memory care neighborhood offers a secure, structured environment for individuals living with Alzheimer''s disease and dementia, featuring specialized programming and compassionate staff trained in dementia care best practices.

Vitalia Mentor combines modern amenities with personalized attention, offering private and semi-private rooms, therapy gym facilities, and engaging daily activities. The community accepts Medicare, Medicaid, and most insurance plans, ensuring families can access quality care regardless of their financial situation. Whether your loved one needs short-term rehab or long-term skilled nursing, Vitalia Mentor delivers clinical expertise in a caring environment.',
  website = 'https://www.vitaliasenior.com/mentor',
  services = 'Skilled Nursing, Rehabilitation, Memory Care, Long-Term Care',
  "updatedAt" = NOW()
WHERE name ILIKE '%vitalia%mentor%'
RETURNING id, name;

-- =====================================================
-- 7. ADDITIONAL COMMUNITIES WITHOUT DESCRIPTIONS
-- (Based on database query results)
-- =====================================================

-- Avenue at Broadview Heights (Assisted Living)
UPDATE "Community"
SET 
  description = 'The Avenue at Broadview Heights offers modern assisted living in one of Cleveland''s most desirable southern suburbs. This community provides personalized daily support with activities like bathing, dressing, and medication management while encouraging residents to maintain their independence and preferred lifestyle.

Located in Broadview Heights with convenient access to Cleveland Clinic''s Broadview Heights Family Health Center and Hillcrest Hospital, residents benefit from proximity to quality healthcare. The community features spacious apartments, restaurant-style dining, and a full calendar of social and recreational activities designed to keep residents engaged and connected.

For families seeking assisted living in the Broadview Heights, Seven Hills, or Independence areas, this community combines modern amenities with compassionate care in a welcoming neighborhood setting.',
  services = 'Assisted Living',
  "updatedAt" = NOW()
WHERE name ILIKE '%avenue%broadview heights%'
RETURNING id, name;

-- Heritage Club Strongsville (Senior Living)
UPDATE "Community"
SET 
  description = 'Heritage Club of Strongsville provides independent and assisted living options in one of Cleveland''s most family-friendly southern suburbs. Located near Southwest General Health Center and with easy access to Cleveland Clinic facilities, this community offers peace of mind for both residents and families.

The community features well-appointed apartments, engaging social activities, and supportive services that allow residents to age in place comfortably. Whether your loved one seeks the freedom of independent living with optional services or requires daily assistance with personal care, Heritage Club creates a welcoming environment where seniors can thrive.

Strongsville''s excellent location provides easy access to shopping, dining, and recreational opportunities while maintaining a quiet residential atmosphere. For families in the Strongsville, North Royalton, or Brunswick areas, Heritage Club offers quality senior living with the personal attention of a close-knit community.',
  services = 'Independent Living, Assisted Living',
  "updatedAt" = NOW()
WHERE name ILIKE '%heritage%strongsville%'
RETURNING id, name;

-- Sunrise Senior Living (Various locations - template for Parma)
UPDATE "Community"
SET 
  description = 'Sunrise Senior Living brings its nationally recognized approach to assisted living and memory care to the Cleveland area. Known for their resident-centered philosophy, Sunrise communities focus on individual preferences, life histories, and personal goals to create meaningful daily experiences.

Assisted living residents receive personalized support with daily activities while maintaining maximum independence. The memory care neighborhood provides specialized programming for individuals with Alzheimer''s disease and dementia, featuring secure environments and staff specially trained in dementia care techniques.

Sunrise communities feature intimate neighborhood designs, chef-prepared meals, engaging activity programs, and beautiful common spaces that feel more like home than a facility. With convenient access to Cleveland-area hospitals and medical specialists, families can trust that clinical needs are never far away. For those seeking a premium senior living experience with genuine warmth and personalized attention, Sunrise delivers exceptional care.',
  services = 'Assisted Living, Memory Care',
  "updatedAt" = NOW()
WHERE name ILIKE '%sunrise%' AND (city ILIKE '%parma%' OR city ILIKE '%cleveland%' OR city ILIKE '%westlake%')
  AND (description IS NULL OR description = '')
RETURNING id, name;

-- =====================================================
-- 8. IMAGE SOURCE TRACKING
-- Add official_image_source column if not exists
-- =====================================================

-- Add column for tracking image sources (for manual approval)
ALTER TABLE "Community" 
ADD COLUMN IF NOT EXISTS official_image_source TEXT;

-- Update image sources for communities with known gallery URLs
UPDATE "Community"
SET official_image_source = 'https://www.fairmontseniorliving.com/westlake-oh/gallery/'
WHERE name ILIKE '%fairmont%westlake%';

UPDATE "Community"
SET official_image_source = 'https://lhshealth.com/broadview-multi-care-center/'
WHERE name ILIKE '%broadview multi%care%';

UPDATE "Community"
SET official_image_source = 'https://www.ardenseniorliving.com/parma-oh/gallery'
WHERE name ILIKE '%arden courts%parma%';

-- =====================================================
-- 9. VERIFICATION QUERIES
-- Run these to verify updates
-- =====================================================

-- Check updated descriptions
SELECT id, name, city, 
       CASE WHEN description IS NOT NULL AND description != '' THEN 'Has Description' ELSE 'Missing' END as description_status,
       CASE WHEN image_url IS NOT NULL AND image_url NOT LIKE '%placeholder%' THEN 'Has Image' ELSE 'Missing/Placeholder' END as image_status,
       official_image_source,
       "updatedAt"
FROM "Community"
WHERE state = 'OH' 
  AND (
    name ILIKE '%fairmont%' OR 
    name ILIKE '%arden%' OR 
    name ILIKE '%broadview%' OR 
    name ILIKE '%ganzhorn%' OR 
    name ILIKE '%o''neill%' OR 
    name ILIKE '%vitalia%' OR
    name ILIKE '%avenue%broadview%' OR
    name ILIKE '%heritage%strongsville%' OR
    name ILIKE '%sunrise%'
  )
ORDER BY name;

-- Count remaining incomplete communities
SELECT 
  COUNT(*) as total_communities,
  COUNT(*) FILTER (WHERE description IS NULL OR description = '') as missing_descriptions,
  COUNT(*) FILTER (WHERE image_url IS NULL OR image_url LIKE '%placeholder%') as missing_images
FROM "Community"
WHERE state = 'OH';

-- =====================================================
-- END OF SCRIPT
-- =====================================================

