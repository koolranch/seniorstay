-- =====================================================
-- Rocky River Communities SEO Content Enrichment
-- Run this script in Supabase SQL Editor
-- =====================================================

-- Bickford of Rocky River
-- Keywords: Bickford of Rocky River, assisted living Rocky River OH, memory care Rocky River
UPDATE "Community" 
SET 
  description = 'Bickford of Rocky River is a boutique assisted living and memory care community located at 21600 Detroit Road in Rocky River, Ohio. As part of the nationally recognized Bickford Senior Living family, this intimate community specializes in personalized care with a focus on maintaining residents'' independence and dignity.

The community features chef-prepared meals served three times daily in a warm, family-style dining setting. Residents enjoy 24-hour licensed nursing staff, engaging life enrichment activities, and compassionate care tailored to individual needs. The memory care neighborhood provides a secure, homelike environment with specialized programming designed to stimulate cognitive function and promote meaningful connections.

Located just minutes from the Rocky River Reservation Metroparks, residents benefit from scenic views and access to nature trails. The community is conveniently situated near Fairview Hospital, St. John Medical Center, and the upscale Crocker Park shopping district, offering families peace of mind and easy access to healthcare, dining, and entertainment.',
  services = 'Assisted Living,Memory Care'
WHERE name ILIKE '%bickford%' AND city ILIKE '%rocky river%';

-- Sunrise of Rocky River
-- Keywords: Sunrise of Rocky River, Sunrise Senior Living, assisted living Rocky River
UPDATE "Community"
SET 
  description = 'Sunrise of Rocky River is a premier assisted living and memory care community offering exceptional senior care on the west side of Greater Cleveland. Part of the renowned Sunrise Senior Living network, this community combines elegant accommodations with personalized care services designed to help residents live life on their own terms.

The community features spacious suites, restaurant-style dining with diverse menu options, and an extensive calendar of social, educational, and wellness activities. Sunrise''s signature Reminiscence program provides specialized memory care in a purposefully designed neighborhood that promotes safety, comfort, and engagement for residents with Alzheimer''s and other forms of dementia.

With 24-hour care staff, medication management, and coordination with healthcare providers, Sunrise of Rocky River ensures residents receive the support they need while maintaining their independence. The community''s prime location near Lake Erie and the Rocky River Metroparks offers beautiful surroundings, while proximity to Cleveland''s west side healthcare facilities provides convenient access to medical services.',
  services = 'Assisted Living,Memory Care'
WHERE name ILIKE '%sunrise%' AND city ILIKE '%rocky river%';

-- Normandy Manor of Rocky River
-- Keywords: Normandy Manor Rocky River, nursing home Rocky River OH
UPDATE "Community"
SET 
  description = 'Normandy Manor of Rocky River is a long-established senior care community providing skilled nursing and rehabilitation services to residents in the Rocky River area. Located in a peaceful residential neighborhood, Normandy Manor offers a comfortable environment focused on helping seniors recover, rehabilitate, and receive ongoing care with dignity and respect.

The community features experienced nursing staff available around the clock, comprehensive rehabilitation services including physical, occupational, and speech therapy, and thoughtfully planned activities to keep residents engaged and connected. Normandy Manor emphasizes personalized care plans that address each resident''s unique health needs and personal preferences.

Families appreciate the community''s convenient location near major healthcare facilities including Fairview Hospital and St. John Medical Center, as well as its accessibility from I-90 and surrounding Cleveland suburbs. The caring staff works closely with families and healthcare providers to ensure seamless coordination of care.',
  services = 'Skilled Nursing,Rehabilitation'
WHERE name ILIKE '%normandy%manor%' AND city ILIKE '%rocky river%';

-- Welsh Home
-- Keywords: Welsh Home Rocky River, nursing home Rocky River, senior care Rocky River
UPDATE "Community"
SET 
  description = 'The Welsh Home is a historic nonprofit senior care community serving the Rocky River area with a tradition of compassionate care dating back generations. Located in a welcoming residential setting, The Welsh Home provides skilled nursing, rehabilitation services, and long-term care with a commitment to treating every resident like family.

The community offers 24-hour skilled nursing care, comprehensive rehabilitation programs, and a warm, homelike atmosphere that sets it apart from larger institutional facilities. Residents enjoy nutritious home-style meals, engaging recreational activities, and the personal attention that comes from a dedicated, caring staff who truly know each resident by name.

The Welsh Home''s nonprofit mission ensures that the focus remains on resident well-being rather than profits. Conveniently located near Rocky River''s parks and Lake Erie shoreline, the community offers families a trusted option for quality senior care with deep roots in the local community.',
  services = 'Skilled Nursing,Long-Term Care'
WHERE name ILIKE '%welsh%home%' AND city ILIKE '%rocky river%';

-- =====================================================
-- Verify updates
-- =====================================================
SELECT 
  id,
  name, 
  city,
  LEFT(description, 100) as description_preview,
  services
FROM "Community" 
WHERE city ILIKE '%rocky river%'
ORDER BY name;

