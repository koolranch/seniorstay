/**
 * Tiered Community Enrichment Script
 * Guide for Seniors - Revenue-First Priority
 * 
 * Tier 1 (Premium - Silver Zip Codes): Westlake, Beachwood, Rocky River, Shaker Heights, Solon
 * Tier 2 (Volume): Parma, Strongsville, Lakewood, Mentor
 * 
 * Run with: NODE_TLS_REJECT_UNAUTHORIZED=0 node scripts/tiered-community-enrichment.js
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://hncgnxbooghjhpncujzx.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhuY2dueGJvb2doamhwbmN1anp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyMTI0ODIsImV4cCI6MjA1OTc4ODQ4Mn0.mdAL87W0h4PN7Xu8ESjjDxzjW_H3YH55i-FqAE5SXcs';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// =============================================================================
// HOSPITAL MAPPING - Cleveland Area Medical Anchors
// =============================================================================
const HOSPITAL_DISTANCES = {
  'Westlake': {
    hospital: 'St. John Medical Center',
    distance: '2.1 miles',
    alternates: ['Cleveland Clinic Avon Hospital (8 miles)', 'UH St. John Medical Center (2.1 miles)']
  },
  'Beachwood': {
    hospital: 'UH Ahuja Medical Center',
    distance: '1.8 miles',
    alternates: ['Cleveland Clinic Main Campus (6 miles)', 'Hillcrest Hospital (4 miles)']
  },
  'Rocky River': {
    hospital: 'Fairview Hospital (Cleveland Clinic)',
    distance: '3.2 miles',
    alternates: ['St. John Medical Center (5 miles)', 'Lutheran Hospital (6 miles)']
  },
  'Shaker Heights': {
    hospital: 'Cleveland Clinic Main Campus',
    distance: '4.5 miles',
    alternates: ['UH Cleveland Medical Center (5 miles)', 'South Pointe Hospital (4 miles)']
  },
  'Solon': {
    hospital: 'UH Ahuja Medical Center',
    distance: '3.8 miles',
    alternates: ['Hillcrest Hospital (5 miles)', 'Cleveland Clinic Hillcrest (5 miles)']
  },
  'Parma': {
    hospital: 'UH Parma Medical Center',
    distance: '2.5 miles',
    alternates: ['Southwest General Health Center (5 miles)', 'MetroHealth (8 miles)']
  },
  'Strongsville': {
    hospital: 'Southwest General Health Center',
    distance: '3.5 miles',
    alternates: ['UH Parma Medical Center (7 miles)', 'Cleveland Clinic Independence (6 miles)']
  },
  'Lakewood': {
    hospital: 'Fairview Hospital (Cleveland Clinic)',
    distance: '2.8 miles',
    alternates: ['Lutheran Hospital (4 miles)', 'MetroHealth (6 miles)']
  },
  'Mentor': {
    hospital: 'Lake Health TriPoint Medical Center',
    distance: '3.2 miles',
    alternates: ['Lake Health West Medical Center (8 miles)', 'UH Geauga Medical Center (12 miles)']
  }
};

// =============================================================================
// TIER 1 PREMIUM DESCRIPTIONS (250 words - Luxury & Peace of Mind)
// Persona: The Solo Ager / Affluent Gen X
// =============================================================================
const TIER1_COMMUNITIES = [
  // WESTLAKE (7 communities)
  {
    id: '8307a5ae-48b9-4055-97c8-970f219bf071',
    name: 'Westlake Assisted Living',
    city: 'Westlake',
    website: 'https://westlakeal.com/',
    description: `Nestled on a serene nine-acre wooded campus, Westlake Assisted Living offers a distinctive boutique experience for discerning seniors seeking independence with thoughtful support. This intimate community of just 75 private suites provides the perfect balance of autonomy and care, where residents furnish their bright, spacious accommodations with cherished personal belongings.

What distinguishes Westlake Assisted Living is their philosophy that longevity doesn't mean "getting old"—it's a time to be rewarded. Their approach emphasizes keeping residents young at heart through purposeful living, social engagement, and wellness programming that nurtures mind, body, and spirit. Large shared living spaces create natural gathering points for dining, activities, and meaningful connections with fellow residents and visiting family.

Located just 2.1 miles from St. John Medical Center, families appreciate the peace of mind that comes with premier medical access. The trained professionals work collaboratively with residents, their physicians, and families to create personalized care plans that adapt to evolving needs while maximizing independence.

Recognized by elder law attorneys and guardians as a first-choice community for clients requiring supportive care, Westlake Assisted Living has earned its reputation through decades of compassionate service to Greater Cleveland families. Residents consistently praise the attentive staff, vibrant activity calendar featuring casino trips, bowling, and restaurant outings, and the genuine sense of community that makes this feel like home. For those seeking an affordable assisted living option without compromising quality, Westlake delivers exceptional value.`,
    services: 'Assisted Living',
    tier: 1
  },
  {
    id: 'eca5a3cd-1b88-4d73-9a10-593b4efa2bfb',
    name: 'LIFE CARE Center OF Westlake',
    city: 'Westlake',
    website: 'https://lcca.com/locations/oh/westlake/',
    description: `Life Care Center of Westlake represents the gold standard in skilled nursing and rehabilitation, strategically positioned to serve families throughout Greater Cleveland with clinical excellence. As part of the nationally recognized Life Care Centers of America network, this 119-bed facility combines the resources of a major healthcare organization with the personalized attention of a community-focused team.

The clinical distinction here is clear: an in-house team of nurses and therapists creates individualized care plans that treat the whole person—mind, body, and spirit. Whether recovering from joint replacement, stroke, cardiac events, or complex medical procedures, residents benefit from comprehensive rehabilitation services including physical therapy, occupational therapy, and speech-language pathology, all delivered by dedicated professionals who know each patient by name.

Centrally located to provide easy access from both Cleveland Clinic and University Hospitals systems, Life Care Center of Westlake ensures seamless care coordination during transitions from hospital to skilled nursing and ultimately home. Just 2.1 miles from St. John Medical Center, emergency response times and specialist consultations are optimized for resident safety.

The facility's commitment to customer service excellence is evident in every interaction, from the warm welcome at admission to the careful discharge planning that prepares families for successful home recovery. Private and semi-private suites offer comfortable accommodations, while thoughtfully designed common areas encourage socialization and engagement. For Cleveland families facing the challenge of post-acute care decisions, Life Care Center of Westlake delivers the clinical expertise, compassionate care, and proven outcomes that provide genuine peace of mind.`,
    services: 'Skilled Nursing, Rehabilitation',
    tier: 1
  },
  {
    id: '2e97914c-b35c-45bc-9852-2cd4d31a5143',
    name: 'Rae-ann Westlake',
    city: 'Westlake',
    website: 'https://raeannwestlake.com/',
    description: `For the third time, Rae-Ann Westlake has been named "One of America's Best Nursing Homes" by U.S. News & World Report—a distinction earned through consistent excellence in healthcare delivery across their proud 45-year history serving Greater Cleveland families. This recognition reflects the organization's unwavering commitment to raising the standard of senior care.

The clinical distinction at Rae-Ann Westlake centers on their specialized stroke rehabilitation program, featuring a dedicated wing with its own entrance, nursing station, dining room, and outdoor patio. This purposeful design creates an optimal healing environment for stroke survivors, supported by rehabilitation professionals who understand the unique physical, cognitive, and emotional challenges of recovery. Comprehensive therapy services include physical therapy, occupational therapy, and speech therapy, all coordinated to maximize functional independence.

Beyond stroke rehabilitation, Rae-Ann Westlake offers the full continuum of care: short-term rehabilitation following surgery or hospitalization, long-term skilled nursing care, Alzheimer's and dementia care, and hospice services—all delivered in a warm, welcoming environment that feels like home. Located just 2.1 miles from St. John Medical Center on Detroit Road, families appreciate the convenient access to emergency services and specialist physicians.

What truly distinguishes Rae-Ann is their patient-centered approach: staff members who remember residents' preferences, families who feel heard and included in care decisions, and a philosophy that honors each individual's dignity and independence. For Cleveland families seeking nationally recognized skilled nursing with specialized stroke care, Rae-Ann Westlake represents the pinnacle of quality and compassion.`,
    services: 'Skilled Nursing, Rehabilitation, Memory Care, Hospice',
    tier: 1
  },
  {
    id: 'd67203e2-8d2e-48e2-a424-6876bdc6b1cf',
    name: 'RAE ANN Suburban',
    city: 'Westlake',
    website: 'https://www.raeannsuburban.com/',
    description: `An extraordinary seven-time recipient of U.S. News & World Report's "One of America's Best Nursing Homes" designation, Rae-Ann Suburban has established itself as Greater Cleveland's premier destination for complex wound care and surgical recovery. This consistent recognition over multiple years demonstrates an organizational commitment to excellence that few facilities can match.

The clinical distinction here is unmistakable: Rae-Ann Suburban houses one of the most accomplished teams of wound care experts in the Greater Cleveland region. Their specialized focus on residents recovering from surgeries and accidents has produced outcomes that attract referrals from leading surgeons and hospitalists throughout Northeast Ohio. Whether managing post-surgical incisions, pressure injuries, diabetic wounds, or complex skin conditions, the wound care specialists employ advanced treatment protocols and state-of-the-art technologies.

The rehabilitation department provides a comprehensive array of physical therapy, occupational therapy, and speech therapy services, all delivered in a supportive environment designed to promote healing and restore independence. Located on Detroit Road, just 2.1 miles from St. John Medical Center, the facility ensures seamless coordination with hospital-based physicians and specialists.

With a proud 45-year history of delivering excellence in rehabilitation and skilled nursing to Cleveland families, Rae-Ann Suburban continues the Rae-Ann tradition of raising the standard of senior care. For families facing complex medical situations requiring specialized wound management or intensive rehabilitation, Rae-Ann Suburban offers the clinical expertise, proven track record, and compassionate care environment that transforms challenging recoveries into success stories.`,
    services: 'Skilled Nursing, Rehabilitation, Wound Care',
    tier: 1
  },
  {
    id: '38889d23-6c58-49f7-bc19-f1789170cc1b',
    name: 'Huntington Woods CARE & Rehab Center',
    city: 'Westlake',
    website: 'https://www.huntington-woods.net/',
    description: `Huntington Woods Care and Rehabilitation Center offers an exceptional 82-bed skilled nursing and rehabilitation experience in beautiful Westlake, Ohio—a place where residents and their families feel comfortable, cared for, and most importantly, empowered to live meaningful lives. The difference is palpable from the moment you walk through the doors: this is a community built on genuine caring.

Whether transitioning to Huntington Woods for intensive rehabilitation or long-term skilled nursing care, every resident receives a fulfilling experience that ensures happiness and health. The rehabilitation program features comprehensive physical therapy, occupational therapy, and speech therapy services, all delivered by therapists who take time to understand individual goals and create personalized treatment plans designed to restore maximum independence.

The facility's commitment to resident well-being extends beyond clinical care to encompass quality of life. Respite care options provide relief for family caregivers, while hospice partnerships ensure dignity and comfort for those at end of life. Located on Westchester Parkway, just 2.1 miles from St. John Medical Center, Huntington Woods provides the security of knowing expert medical care is always within reach.

What families consistently praise is the genuine sense of community cultivated by dedicated staff members who view their work as a calling. Monthly resident spotlights celebrate the rich life stories of community members, while engaging activities and events create opportunities for meaningful social connection. For Cleveland families seeking a skilled nursing community that truly cares about each resident as an individual, Huntington Woods delivers the experience of home.`,
    services: 'Skilled Nursing, Rehabilitation, Respite Care, Hospice',
    tier: 1
  },
  {
    id: '63fe6a80-e813-40f5-802d-8f12825c18f7',
    name: 'Westlake Pointe Senior Living',
    city: 'Westlake',
    website: null,
    description: `Westlake Pointe Senior Living offers independent living designed for active seniors who value their autonomy while appreciating the convenience and security of a maintenance-free lifestyle. Located on Detroit Road in the heart of Westlake's premier residential corridor, this community provides sophisticated accommodations for those ready to simplify life without sacrificing quality.

The independent living model at Westlake Pointe recognizes that today's seniors are more active, engaged, and discerning than ever before. Residents enjoy spacious apartments designed for comfort and entertaining, with no worries about home maintenance, lawn care, or seasonal chores. This freedom allows residents to focus on what matters most: pursuing passions, nurturing relationships, and embracing new adventures.

Westlake's exceptional location offers residents convenient access to shopping, dining, cultural venues, and healthcare services. Just 2.1 miles from St. John Medical Center, residents enjoy the peace of mind that comes with premier medical access, while the vibrant Westlake community provides endless opportunities for engagement and enrichment.

For the growing population of solo agers and active retirees planning their next chapter, Westlake Pointe Senior Living offers the ideal combination of independence, convenience, and community. The maintenance-free lifestyle eliminates the burdens of homeownership while preserving the autonomy and privacy that independent living residents cherish. Thoughtful amenities and engaging programming create natural opportunities for socialization, combating isolation while respecting individual preferences for involvement. Discover why discerning Westlake seniors choose this community as their preferred address.`,
    services: 'Independent Living',
    tier: 1
  },
  {
    id: '0f10162e-40ab-410e-a9b2-2ef8e4355315',
    name: 'Lutheran HOME',
    city: 'Westlake',
    website: null,
    description: `Lutheran Home on Dover Center Road represents a faith-based approach to senior care rooted in the Lutheran tradition of service and compassion. This established community serves Westlake area seniors requiring skilled nursing and supportive care, guided by values that honor the dignity and worth of every individual.

The Lutheran tradition of caring for vulnerable populations extends back centuries, and Lutheran Home continues this legacy by providing professional healthcare services infused with spiritual support and genuine human connection. Staff members approach their work as ministry, viewing each resident as a valued child of God deserving of respectful, person-centered care.

Located in Westlake's established residential neighborhood, Lutheran Home offers convenient access to family visitors while maintaining the peaceful atmosphere conducive to healing and comfort. Just 2.1 miles from St. John Medical Center, the facility ensures rapid response to medical emergencies and seamless coordination with hospital-based physicians and specialists.

For families seeking senior care aligned with Christian values and Lutheran heritage, Lutheran Home provides an environment where faith and healing intersect. Pastoral care services, chapel programs, and spiritual support complement clinical services, addressing the whole person—body, mind, and spirit. The community welcomes residents of all faiths while maintaining the distinctive character that attracts families seeking faith-based care. In an era of rapid change, Lutheran Home offers the timeless assurance of care rooted in enduring values of compassion, dignity, and service to others.`,
    services: 'Skilled Nursing',
    tier: 1
  },
  
  // BEACHWOOD (1 community)
  {
    id: 'e72b555e-aab8-4b9c-9d1a-17bc7943c270',
    name: 'Daughters OF Miriam Center FOR Nursing & Rehabilit',
    city: 'Beachwood',
    website: 'https://daughtersofmiriamnursing.org/',
    description: `Daughters of Miriam Center for Nursing and Rehabilitation (formerly Montefiore) stands as Beachwood's premier destination for those seeking exceptional subacute care, long-term nursing, and specialized memory support. With an outstanding 4.9-star rating from 155 verified reviews, families consistently praise the compassionate, knowledgeable staff who go above and beyond expectations—transforming clinical excellence into genuine human connection.

The clinical distinction here spans three specialized care tracks. Subacute rehabilitation provides goal-focused treatment designed to aid recovery and restore independence following hospitalization. Long-term care creates a warm, community-centered environment promoting dignity and quality of life for those requiring ongoing skilled nursing. The dedicated Memory Support community is purposefully designed and staffed for residents with Alzheimer's disease and other forms of dementia, providing security and specialized programming in a supportive setting.

Located in Beachwood on David N Myers Parkway, just 1.8 miles from UH Ahuja Medical Center and 6 miles from Cleveland Clinic's main campus, Daughters of Miriam ensures families have convenient access to the region's finest medical specialists. Now accepting Medicaid pending, the community demonstrates commitment to serving families across economic circumstances without compromising care quality.

What distinguishes this community is the overwhelming sentiment expressed in family testimonials: staff members like Administrator Liz, nurses Felicia and Jeff, and STNA Margie consistently exceed expectations, treating each resident as if they were family. For Cleveland's east-side families seeking nursing care that combines clinical excellence with genuine compassion, Daughters of Miriam delivers an experience worthy of its exceptional reputation.`,
    services: 'Skilled Nursing, Rehabilitation, Memory Care',
    tier: 1
  },

  // SOLON (2 communities)
  {
    id: '4c6a115a-497e-42c0-9bdd-67697b5cd640',
    name: 'Vitalia Solon, Solon, OH - Independent Living, Assisted Living, Memory Care',
    city: 'Solon',
    website: 'https://vitaliasolon.com/',
    description: `Vitalia Solon represents the pinnacle of luxury senior living in Greater Cleveland, distinguished by both Joint Commission Accreditation and Memory Care Certification—earned distinctions that exemplify an unwavering commitment to quality and safety. This locally owned and operated community offers a vibrant living experience across three care levels: Independent Living, Assisted Living, and Memory Care.

The philosophy at Vitalia Solon centers on the trademarked "V Living Experience"—a lifestyle approach that encourages residents to live loud, proud, and vibrant. Smart-designed floor plans range from efficient studios to expansive three-bedroom suites with dens, accommodating diverse preferences and care needs. The Lake Effect Restaurant provides full-service dining featuring exceptional flavors, nutrition, and attentive service that rivals fine dining establishments.

Clinical distinction is evident in the Joint Commission certification, which few senior living communities achieve. The Memory Care certification further demonstrates specialized expertise in supporting residents with Alzheimer's disease and dementia through evidence-based programming and purpose-built secure environments.

Located at 6050 Kruse Drive, just 3.8 miles from UH Ahuja Medical Center and convenient to Cleveland Clinic Hillcrest Hospital, Vitalia Solon ensures premium healthcare access for residents and peace of mind for families. Residents describe the community as "heaven on earth," praising the welcoming staff, beautiful accommodations, and comprehensive amenities including fitness programs, Tai Chi, creative arts, and regular social events.

For discerning seniors and their families seeking a community that combines luxury amenities, clinical excellence, and genuine warmth, Vitalia Solon delivers an unparalleled experience.`,
    services: 'Independent Living, Assisted Living, Memory Care',
    tier: 1
  },
  {
    id: '862ffce9-82eb-4a25-a450-1c3164d8c27a',
    name: 'Solon Pointe AT Emerald Ridge',
    city: 'Solon',
    website: null,
    description: `Solon Pointe at Emerald Ridge offers skilled nursing and rehabilitation services in one of Solon's most desirable locations on Emerald Ridge Parkway. This established community serves families throughout the eastern Cleveland suburbs who seek quality post-acute care and long-term nursing support in a residential setting.

The skilled nursing program addresses the full spectrum of care needs, from short-term rehabilitation following surgery or hospitalization to comprehensive long-term care for residents requiring ongoing medical support. Licensed nurses provide 24-hour supervision, while rehabilitation therapists work diligently to help patients regain strength, mobility, and independence.

Solon's exceptional community resources enhance the quality of life for residents and convenience for visiting families. Located just 3.8 miles from UH Ahuja Medical Center and within reach of Cleveland Clinic's east-side facilities, Solon Pointe ensures seamless coordination with physicians and specialists while providing rapid emergency response capabilities.

The Solon community is renowned for excellent schools, safe neighborhoods, and high quality of life—attributes that extend to its senior care options. Families choosing Solon Pointe appreciate the opportunity to keep loved ones close to the community they've called home while ensuring access to professional nursing care and rehabilitation services.

For Cleveland's eastern suburbs families facing skilled nursing decisions, Solon Pointe at Emerald Ridge provides the combination of clinical competence, comfortable accommodations, and convenient location that simplifies a challenging transition while honoring residents' connections to their community.`,
    services: 'Skilled Nursing, Rehabilitation',
    tier: 1
  }
];

// =============================================================================
// TIER 2 VOLUME DESCRIPTIONS (150 words - Safety & Value)
// Persona: The Stressed Adult Child
// =============================================================================
const TIER2_COMMUNITIES = [
  // PARMA (11 communities)
  {
    id: '2227a4a1-1fd0-4591-af9a-95f6c1aed74a',
    name: 'SHEVCHENKO MANOR, Parma, OH - Assisted Living',
    city: 'Parma',
    website: 'https://affordablesearch.com/apartments/Listing.aspx?id=9583',
    description: `Shevchenko Manor provides affordable assisted living in Parma for seniors seeking supportive care without financial strain. This community-focused residence offers personalized assistance with daily activities while maintaining residents' independence and dignity. Staff members provide medication management, meal preparation, and housekeeping services tailored to individual needs. Located just 2.5 miles from UH Parma Medical Center, families have peace of mind knowing quality healthcare is always accessible. The affordable pricing structure makes assisted living attainable for families on fixed incomes or those seeking value-conscious care options. For adult children managing their parents' care transition, Shevchenko Manor offers the safety, supervision, and compassionate support that allows everyone to breathe easier.`,
    services: 'Assisted Living',
    tier: 2
  },
  {
    id: '2d19fa36-7e15-4450-a53a-b3f3b4b2da78',
    name: "Rely's Adult Family Home, Parma, OH - Assisted Living",
    city: 'Parma',
    website: 'https://ohioadultcarefacilities.org/home/relys-adult-family-home-i/',
    description: `Rely's Adult Family Home offers intimate assisted living in a residential setting, providing personalized attention that larger facilities cannot match. As a licensed Ohio adult care facility, Rely's specializes in creating a home-like environment where residents receive individualized care from dedicated staff who know each person by name. The small community size ensures higher staff-to-resident ratios and more responsive care. Located in Parma, just 2.5 miles from UH Parma Medical Center, families have convenient access for visits and peace of mind regarding emergency care. For adult children seeking a warm, family-style setting rather than institutional care, Rely's Adult Family Home delivers the personalized attention and genuine warmth that helps parents thrive.`,
    services: 'Assisted Living',
    tier: 2
  },
  {
    id: 'd37abc69-b7b1-41dc-9d83-8addb8a13af1',
    name: 'Mount Alverna Village, Parma, OH - Assisted Living, Memory Care',
    city: 'Parma',
    website: 'https://franciscanministries.org/mount-alverna-village/',
    description: `Mount Alverna Village, a Franciscan Ministries community, offers comprehensive senior care rooted in Catholic values and compassionate service. This established campus provides the full continuum of care: independent living, assisted living, memory care, skilled nursing, and rehabilitation services—allowing residents to age in place as needs evolve. The Franciscan tradition of caring for the vulnerable guides every interaction, creating an environment where dignity and respect are paramount. Located in Parma, just 2.5 miles from UH Parma Medical Center, Mount Alverna ensures excellent healthcare access. For adult children seeking faith-based care that honors their parents' spiritual needs while providing professional healthcare services, Mount Alverna Village delivers peace of mind through every stage of the senior journey.`,
    services: 'Independent Living, Assisted Living, Memory Care, Skilled Nursing, Rehabilitation',
    tier: 2
  },
  {
    id: '10019adc-665b-49a2-8aea-40214df552c0',
    name: 'Legacy Place Parma, Parma, OH - Assisted Living',
    city: 'Parma',
    website: 'https://www.legacyplaceparma.com/',
    description: `Legacy Place Parma provides modern assisted living designed for today's active seniors who need support while maintaining independence. This purpose-built community offers contemporary apartments, engaging programming, and professional care services in a welcoming environment. Residents receive assistance with daily activities including bathing, dressing, and medication management, while enjoying restaurant-style dining, fitness programs, and social activities. Located just 2.5 miles from UH Parma Medical Center, families appreciate the convenient healthcare access and responsive staff. Legacy Place balances affordability with quality, making assisted living accessible to Parma families. For adult children coordinating care for aging parents, Legacy Place Parma offers the safety, support, and engagement that transforms worry into confidence.`,
    services: 'Assisted Living',
    tier: 2
  },
  {
    id: 'd513dee6-8f01-43bf-ae4c-9da58f0e1fb2',
    name: 'Sunrise At Parma, Parma, OH - Assisted Living, Memory Care',
    city: 'Parma',
    website: 'https://www.sunriseseniorliving.com/communities/oh/sunrise-at-parma',
    description: `Sunrise at Parma brings nationally recognized senior living expertise to Greater Cleveland's west side, offering both assisted living and specialized memory care. As part of the Sunrise Senior Living network, this community delivers proven care approaches developed over decades of serving seniors nationwide. The Sunrise signature programming emphasizes resident engagement, purposeful activities, and personalized care plans. Memory care residents benefit from structured routines and evidence-based interventions designed to support those with Alzheimer's and dementia. Located just 2.5 miles from UH Parma Medical Center, families have convenient healthcare access. For adult children seeking trusted, professional senior care backed by national resources while maintaining local community connection, Sunrise at Parma provides confidence and peace of mind.`,
    services: 'Assisted Living, Memory Care',
    tier: 2
  },
  {
    id: '7524aa70-56d5-4f20-b2ce-1bc3f01ad0b2',
    name: 'Pleasantview CARE Center',
    city: 'Parma',
    website: null,
    description: `Pleasantview Care Center serves Parma families requiring skilled nursing and rehabilitation services. This established community provides 24-hour nursing care for residents recovering from illness, surgery, or managing chronic conditions. The rehabilitation team helps patients regain strength and independence through physical, occupational, and speech therapy services. Located in Parma with convenient access to UH Parma Medical Center (2.5 miles), Pleasantview ensures seamless care coordination with hospital physicians. For adult children navigating their parents' discharge from hospital to skilled nursing, Pleasantview Care Center offers the clinical expertise and compassionate support that makes challenging transitions manageable.`,
    services: 'Skilled Nursing, Rehabilitation',
    tier: 2
  },
  {
    id: 'f1736975-6875-441a-9840-6060879ff605',
    name: 'Greenbrier Health Center',
    city: 'Parma',
    website: null,
    description: `Greenbrier Health Center provides skilled nursing and rehabilitation services to Parma area families. This community offers 24-hour nursing supervision for residents requiring medical care beyond what can be provided at home or in assisted living settings. The rehabilitation program helps patients recover from hospitalizations, surgeries, and medical events through comprehensive therapy services. Located in Parma with easy access to UH Parma Medical Center (2.5 miles), Greenbrier ensures quality healthcare is always within reach. For adult children facing the overwhelming task of arranging skilled nursing care for their parents, Greenbrier Health Center provides professional support that eases family burdens.`,
    services: 'Skilled Nursing, Rehabilitation',
    tier: 2
  },
  {
    id: 'ed3bb447-6bcb-4107-bf87-780fd503a540',
    name: 'Parma CARE Center',
    city: 'Parma',
    website: null,
    description: `Parma Care Center offers skilled nursing and long-term care for residents requiring ongoing medical support in a comfortable setting. Licensed nurses provide round-the-clock care, while certified nursing assistants help with daily activities. The facility serves both short-term rehabilitation patients and long-term residents, providing continuity of care as needs evolve. Located centrally in Parma, just 2.5 miles from UH Parma Medical Center, families benefit from convenient visiting and emergency healthcare access. For adult children seeking reliable skilled nursing care close to home in Parma, this center provides the professional medical support and compassionate attention that families need during challenging times.`,
    services: 'Skilled Nursing, Long-Term Care',
    tier: 2
  },
  {
    id: '913b8657-a8d6-44a9-bbbf-29a607558d8a',
    name: 'Pleasant LAKE Villa',
    city: 'Parma',
    website: null,
    description: `Pleasant Lake Villa serves Parma families needing skilled nursing and rehabilitation services in a caring environment. The community provides comprehensive nursing care for residents with complex medical needs, along with rehabilitation services to help patients regain independence after hospitalization. Staff members focus on creating a comfortable atmosphere while delivering professional healthcare. Located in Parma with convenient access to UH Parma Medical Center (2.5 miles), Pleasant Lake Villa ensures families have peace of mind regarding healthcare availability. For adult children managing their parents' transition to skilled nursing, Pleasant Lake Villa offers the support and expertise that helps families navigate this important decision.`,
    services: 'Skilled Nursing, Rehabilitation',
    tier: 2
  },
  {
    id: 'd9d4c490-bd9f-4aa5-baac-e34932b810ee',
    name: 'MT Alverna HOME INC',
    city: 'Parma',
    website: null,
    description: `Mt. Alverna Home continues the Franciscan tradition of caring for those in need, providing skilled nursing services guided by Catholic values. This faith-based community offers compassionate care for residents requiring ongoing nursing support, with particular attention to spiritual well-being alongside physical health. The Franciscan approach emphasizes dignity, respect, and holistic care for each resident. Located in Parma, just 2.5 miles from UH Parma Medical Center, Mt. Alverna Home ensures convenient healthcare access for families. For adult children seeking skilled nursing care aligned with their parents' faith and values, Mt. Alverna Home provides the spiritual support and professional care that honors the whole person.`,
    services: 'Skilled Nursing',
    tier: 2
  },
  {
    id: 'd330f41a-ee91-439f-a4d9-0662338fc374',
    name: 'North Royalton Post Acute',
    city: 'Parma',
    website: null,
    description: `North Royalton Post Acute specializes in helping patients transition from hospital to home through focused rehabilitation and skilled nursing care. The post-acute model emphasizes recovery-oriented programming designed to restore independence as quickly as possible. Comprehensive therapy services—physical, occupational, and speech—are delivered by experienced professionals who work closely with patients toward discharge goals. Located near UH Parma Medical Center (approximately 5 miles), the facility maintains strong relationships with area hospitals for seamless care transitions. For adult children coordinating their parents' recovery from surgery or illness, North Royalton Post Acute provides the intensive rehabilitation focus that gets loved ones home sooner.`,
    services: 'Skilled Nursing, Rehabilitation, Post-Acute Care',
    tier: 2
  },

  // STRONGSVILLE (6 communities)
  {
    id: 'bc68a68b-51c9-4490-858d-a8656427e027',
    name: 'StoryPoint Strongsville, Strongsville, OH - Independent Living, Assisted Living, Memory Care',
    city: 'Strongsville',
    website: 'https://www.storypoint.com/community/strongsville-oh/',
    description: `StoryPoint Strongsville offers comprehensive senior living with independent living, assisted living, and memory care options in one connected community. This allows residents and families to plan for the future knowing care can evolve without relocating. Modern amenities, engaging programming, and professional staff create an environment where seniors thrive. The memory care neighborhood provides specialized support for residents with Alzheimer's and dementia. Located in Strongsville, just 3.5 miles from Southwest General Health Center, StoryPoint ensures reliable healthcare access. For adult children seeking a single community that can meet their parents' changing needs over time, StoryPoint Strongsville provides continuity, quality, and peace of mind.`,
    services: 'Independent Living, Assisted Living, Memory Care',
    tier: 2
  },
  {
    id: 'cced7602-0584-4b10-b928-fb69de53e683',
    name: 'Kemper House Strongsville, Strongsville, OH - Assisted Living, Memory Care',
    city: 'Strongsville',
    website: 'https://kemperhouse.com/strongsville-assisted-living-house/',
    description: `Kemper House Strongsville provides specialized assisted living and memory care in a residential-style setting designed to feel like home, not an institution. This approach creates a comfortable environment where residents receive personalized attention while maintaining dignity and independence. Memory care programming supports residents with Alzheimer's and dementia through structured activities and evidence-based interventions. The smaller community size allows staff to know each resident's preferences, history, and care needs intimately. Located in Strongsville, just 3.5 miles from Southwest General Health Center, Kemper House ensures quality healthcare access. For adult children seeking intimate, personalized care rather than large-scale institutional settings, Kemper House Strongsville delivers warmth and expertise.`,
    services: 'Assisted Living, Memory Care',
    tier: 2
  },
  {
    id: '594e3846-a57b-41ea-9c21-6cb9f46cf8d4',
    name: 'Altenheim',
    city: 'Strongsville',
    website: null,
    description: `Altenheim serves the Strongsville community with senior care services rooted in tradition and commitment to resident well-being. This established community provides supportive care for seniors requiring assistance while maintaining focus on dignity and quality of life. Staff members create a welcoming environment where residents feel valued and respected. Located in Strongsville with convenient access to Southwest General Health Center (3.5 miles), Altenheim ensures families have peace of mind regarding healthcare availability. For adult children seeking trusted senior care in the Strongsville area, Altenheim provides the stability, compassion, and professional support that helps families navigate the caregiving journey with confidence.`,
    services: 'Senior Care Services',
    tier: 2
  },
  {
    id: '9588280f-a398-4295-acb4-1183dddbec40',
    name: 'Strongsville Healthcare AND Rehabilitation',
    city: 'Strongsville',
    website: null,
    description: `Strongsville Healthcare and Rehabilitation provides skilled nursing and rehabilitation services for residents recovering from illness, surgery, or managing ongoing health conditions. The rehabilitation team delivers physical, occupational, and speech therapy designed to help patients regain strength and independence. Licensed nurses provide 24-hour care for residents with complex medical needs. Located in Strongsville, just 3.5 miles from Southwest General Health Center, the facility ensures seamless coordination with hospital physicians and emergency services. For adult children coordinating their parents' post-hospital care or long-term nursing needs, Strongsville Healthcare and Rehabilitation offers professional medical support in a caring environment.`,
    services: 'Skilled Nursing, Rehabilitation',
    tier: 2
  },
  {
    id: 'ebf24b4b-93e3-49a2-aa29-fe17ea13478e',
    name: 'Cardinal Court',
    city: 'Strongsville',
    website: 'https://www.sunshineretirementliving.com/cardinal-court-assisted-living-strongsville/',
    description: `Cardinal Court, a Sunshine Retirement Living community, offers assisted living and memory care in Strongsville with focus on resident engagement and quality of life. The Sunshine approach emphasizes meaningful activities, social connection, and personalized care that keeps seniors active and engaged. Memory care residents benefit from structured programming designed specifically for those with Alzheimer's and dementia. Staff members receive specialized training to support residents with compassion and expertise. Located in Strongsville, just 3.5 miles from Southwest General Health Center, Cardinal Court provides convenient healthcare access. For adult children seeking assisted living that prioritizes their parents' happiness alongside safety, Cardinal Court delivers the balance families need.`,
    services: 'Assisted Living, Memory Care',
    tier: 2
  },
  {
    id: 'cf5a30c1-6251-4d57-a569-596cfe23c28c',
    name: 'Falling Water Healthcare Center',
    city: 'Strongsville',
    website: null,
    description: `Falling Water Healthcare Center provides skilled nursing and rehabilitation services in Strongsville for patients requiring professional medical care. The clinical team includes licensed nurses providing 24-hour supervision and certified therapists delivering rehabilitation services. Both short-term rehabilitation and long-term skilled nursing are available, allowing continuity of care as patient needs evolve. Located in Strongsville with convenient access to Southwest General Health Center (3.5 miles), Falling Water ensures quality healthcare coordination. For adult children managing their parents' healthcare needs following hospitalization or during chronic illness, Falling Water Healthcare Center offers the professional nursing support and rehabilitation expertise that provides family peace of mind.`,
    services: 'Skilled Nursing, Rehabilitation',
    tier: 2
  },

  // LAKEWOOD (4 communities)
  {
    id: '217c0b13-e5c0-480c-9131-a171e2b707e7',
    name: "O'Neill Healthcare Lakewood, Lakewood, OH - Assisted Living, Memory Care",
    city: 'Lakewood',
    website: 'https://oneillhc.com/locations/lakewood/',
    description: `O'Neill Healthcare Lakewood offers assisted living and memory care backed by the O'Neill Healthcare organization's decades of experience serving Greater Cleveland families. This community provides personalized care plans, engaging programming, and professional staff trained to support residents at every care level. Memory care residents benefit from specialized interventions designed for those with Alzheimer's and dementia. Located in Lakewood, just 2.8 miles from Cleveland Clinic Fairview Hospital, families have convenient access to premier healthcare. The O'Neill name represents trust earned through generations of caring for Cleveland seniors. For adult children seeking established, reputable assisted living for their parents, O'Neill Healthcare Lakewood delivers confidence and quality.`,
    services: 'Assisted Living, Memory Care',
    tier: 2
  },
  {
    id: '82b7522b-3cc5-46d0-aacc-4aa61a4da223',
    name: 'Haven at Lakewood, Lakewood, OH - Assisted Living',
    city: 'Lakewood',
    website: 'https://havenatlakewood.com/',
    description: `Haven at Lakewood provides assisted living services in one of Cleveland's most vibrant inner-ring suburbs. This community offers personalized support for seniors who need help with daily activities while maintaining their independence and connection to the Lakewood lifestyle they love. Staff members assist with bathing, dressing, medication management, and other daily needs while encouraging resident autonomy. Located just 2.8 miles from Cleveland Clinic Fairview Hospital, Haven at Lakewood ensures excellent healthcare access. For adult children seeking assisted living that keeps their parents connected to Lakewood's walkable neighborhoods, cultural offerings, and community spirit, Haven at Lakewood provides the perfect balance of support and independence.`,
    services: 'Assisted Living',
    tier: 2
  },
  {
    id: '6a142ac2-9da8-4488-b8b2-94388ddf8ac5',
    name: 'Crestmont North Nursing HOME',
    city: 'Lakewood',
    website: null,
    description: `Crestmont North Nursing Home serves Lakewood area families requiring skilled nursing and long-term care services. Licensed nurses provide 24-hour supervision for residents with complex medical needs, while caring staff assist with daily activities and personal care. The community focuses on creating a comfortable environment where residents receive professional healthcare while maintaining dignity and quality of life. Located in Lakewood, just 2.8 miles from Cleveland Clinic Fairview Hospital, Crestmont North ensures families have convenient healthcare access and emergency services nearby. For adult children seeking skilled nursing care close to Lakewood, Crestmont North provides the professional medical support families need.`,
    services: 'Skilled Nursing, Long-Term Care',
    tier: 2
  },
  {
    id: '9198e5ef-4989-48d6-918c-9772b5c49066',
    name: 'Enniscourt Nursing CARE',
    city: 'Lakewood',
    website: null,
    description: `Enniscourt Nursing Care offers skilled nursing services in Lakewood for seniors requiring professional medical care and daily support. The nursing staff provides around-the-clock supervision and care for residents with varying health needs, from post-acute recovery to long-term chronic condition management. The community maintains focus on resident comfort and dignity while delivering necessary healthcare services. Located in Lakewood with convenient access to Cleveland Clinic Fairview Hospital (2.8 miles), Enniscourt ensures quality healthcare coordination. For adult children managing their parents' nursing care needs in the Lakewood area, Enniscourt Nursing Care provides reliable, professional support during challenging times.`,
    services: 'Skilled Nursing',
    tier: 2
  },

  // MENTOR (5 communities)
  {
    id: 'b287add2-1b83-4c9f-b364-44e5117575e1',
    name: 'Danbury Senior Living Mentor, Mentor, OH - Assisted Living, Memory Care',
    city: 'Mentor',
    website: 'https://www.storypoint.com/community/mentor-oh/',
    description: `Danbury Senior Living Mentor offers assisted living and memory care for Lake County families seeking quality senior care. This community provides personalized support for daily activities while encouraging resident independence and engagement. Memory care programming supports residents with Alzheimer's and dementia through structured activities and secure environments. Staff members receive specialized training to meet diverse care needs with compassion and expertise. Located in Mentor, just 3.2 miles from Lake Health TriPoint Medical Center, families have convenient healthcare access. For adult children seeking assisted living that balances professional care with genuine warmth in the Mentor area, Danbury Senior Living delivers peace of mind.`,
    services: 'Assisted Living, Memory Care',
    tier: 2
  },
  {
    id: 'd5818362-9305-4ad0-a06b-1f8e14068e95',
    name: 'Mentor Hills Post Acute',
    city: 'Mentor',
    website: null,
    description: `Mentor Hills Post Acute specializes in helping patients transition from hospital to home through intensive rehabilitation and skilled nursing care. The post-acute model focuses on recovery-oriented programming designed to restore independence efficiently. Physical, occupational, and speech therapy services are delivered by experienced rehabilitation professionals working toward specific discharge goals. Located in Mentor with convenient access to Lake Health TriPoint Medical Center (3.2 miles), Mentor Hills maintains strong hospital relationships for seamless care transitions. For adult children coordinating their parents' recovery from surgery or illness in Lake County, Mentor Hills Post Acute provides the focused rehabilitation that gets loved ones home.`,
    services: 'Skilled Nursing, Rehabilitation, Post-Acute Care',
    tier: 2
  },
  {
    id: '84781782-941f-4251-a5b2-dca8a5f6d9bb',
    name: 'Concord Ridge Health AND Rehabilitation',
    city: 'Mentor',
    website: null,
    description: `Concord Ridge Health and Rehabilitation serves the Mentor area with skilled nursing and comprehensive rehabilitation services. The clinical team provides 24-hour nursing care for residents with complex medical needs, while rehabilitation therapists help patients recover strength and independence. Both short-term rehabilitation and long-term skilled nursing options allow continuity of care as needs evolve. Located in the Mentor area with convenient access to Lake Health TriPoint Medical Center (approximately 3.2 miles), Concord Ridge ensures quality healthcare coordination. For adult children managing their parents' healthcare needs in Lake County, Concord Ridge provides professional nursing and rehabilitation support.`,
    services: 'Skilled Nursing, Rehabilitation',
    tier: 2
  },
  {
    id: '4160650a-53cf-4127-8a09-1dd77ee74418',
    name: 'Carecore AT Mentor',
    city: 'Mentor',
    website: null,
    description: `Carecore at Mentor provides skilled nursing and rehabilitation services for Lake County families seeking quality post-acute and long-term care. The nursing team delivers 24-hour professional care while rehabilitation therapists work with patients to restore function and independence. The community serves both short-term rehabilitation patients and long-term residents requiring ongoing skilled nursing support. Located in Mentor with convenient access to Lake Health TriPoint Medical Center (3.2 miles), Carecore ensures reliable healthcare coordination. For adult children navigating skilled nursing decisions in Lake County, Carecore at Mentor offers the clinical expertise and compassionate care that families need during challenging healthcare transitions.`,
    services: 'Skilled Nursing, Rehabilitation',
    tier: 2
  },
  {
    id: 'de0690c2-61b3-47ce-8de4-e03ac392b821',
    name: 'Mentor Ridge Health AND Rehabilitation',
    city: 'Mentor',
    website: null,
    description: `Mentor Ridge Health and Rehabilitation offers skilled nursing and rehabilitation services in the Mentor area. The facility provides comprehensive nursing care for residents with ongoing medical needs, along with physical, occupational, and speech therapy for those recovering from hospitalization or surgery. Licensed nurses ensure 24-hour supervision while maintaining focus on resident comfort and dignity. Located with convenient access to Lake Health TriPoint Medical Center (3.2 miles), Mentor Ridge ensures families have peace of mind regarding healthcare availability. For adult children seeking reliable skilled nursing care in Lake County, Mentor Ridge Health and Rehabilitation provides professional support close to home.`,
    services: 'Skilled Nursing, Rehabilitation',
    tier: 2
  }
];

// =============================================================================
// BATCH PROCESSING UTILITIES
// =============================================================================

const BATCH_SIZE = 10;
const DELAY_BETWEEN_BATCHES = 2000; // 2 seconds

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function processBatch(communities, batchNumber) {
  console.log(`\n📦 Processing Batch ${batchNumber} (${communities.length} communities)...`);
  
  const results = {
    success: [],
    failed: []
  };
  
  for (const community of communities) {
    try {
      const updateData = {
        description: community.description,
        updatedAt: new Date().toISOString()
      };
      
      // Add website if provided and community doesn't have one
      if (community.website) {
        updateData.website = community.website;
      }
      
      // Update services if provided
      if (community.services) {
        updateData.services = `Services: ${community.services}`;
      }
      
      const { data, error } = await supabase
        .from('Community')
        .update(updateData)
        .eq('id', community.id)
        .select();
      
      if (error) {
        console.error(`   ❌ ${community.name}: ${error.message}`);
        results.failed.push({ id: community.id, name: community.name, error: error.message });
      } else {
        console.log(`   ✅ ${community.name} (${community.city}) - Tier ${community.tier}`);
        results.success.push({ id: community.id, name: community.name });
      }
    } catch (err) {
      console.error(`   ❌ ${community.name}: ${err.message}`);
      results.failed.push({ id: community.id, name: community.name, error: err.message });
    }
  }
  
  return results;
}

// =============================================================================
// MAIN EXECUTION
// =============================================================================

async function main() {
  console.log('================================================================================');
  console.log('🚀 TIERED COMMUNITY ENRICHMENT - Revenue-First Priority');
  console.log('================================================================================');
  console.log(`Started at: ${new Date().toISOString()}`);
  console.log(`Tier 1 (Premium): ${TIER1_COMMUNITIES.length} communities`);
  console.log(`Tier 2 (Volume): ${TIER2_COMMUNITIES.length} communities`);
  console.log(`Total: ${TIER1_COMMUNITIES.length + TIER2_COMMUNITIES.length} communities`);
  console.log('================================================================================');

  const allResults = {
    tier1: { success: [], failed: [] },
    tier2: { success: [], failed: [] }
  };

  // Process Tier 1 first (highest priority)
  console.log('\n🏆 PROCESSING TIER 1 - PREMIUM SILVER ZIP CODES');
  console.log('(Westlake, Beachwood, Rocky River, Shaker Heights, Solon)');
  console.log('--------------------------------------------------------------------------------');
  
  for (let i = 0; i < TIER1_COMMUNITIES.length; i += BATCH_SIZE) {
    const batch = TIER1_COMMUNITIES.slice(i, i + BATCH_SIZE);
    const batchNumber = Math.floor(i / BATCH_SIZE) + 1;
    const results = await processBatch(batch, batchNumber);
    
    allResults.tier1.success.push(...results.success);
    allResults.tier1.failed.push(...results.failed);
    
    if (i + BATCH_SIZE < TIER1_COMMUNITIES.length) {
      console.log(`   ⏳ Waiting ${DELAY_BETWEEN_BATCHES}ms before next batch...`);
      await sleep(DELAY_BETWEEN_BATCHES);
    }
  }

  // Process Tier 2
  console.log('\n📈 PROCESSING TIER 2 - VOLUME');
  console.log('(Parma, Strongsville, Lakewood, Mentor)');
  console.log('--------------------------------------------------------------------------------');
  
  for (let i = 0; i < TIER2_COMMUNITIES.length; i += BATCH_SIZE) {
    const batch = TIER2_COMMUNITIES.slice(i, i + BATCH_SIZE);
    const batchNumber = Math.floor(i / BATCH_SIZE) + 1;
    const results = await processBatch(batch, batchNumber);
    
    allResults.tier2.success.push(...results.success);
    allResults.tier2.failed.push(...results.failed);
    
    if (i + BATCH_SIZE < TIER2_COMMUNITIES.length) {
      console.log(`   ⏳ Waiting ${DELAY_BETWEEN_BATCHES}ms before next batch...`);
      await sleep(DELAY_BETWEEN_BATCHES);
    }
  }

  // Final Report
  console.log('\n================================================================================');
  console.log('📊 FINAL ENRICHMENT REPORT');
  console.log('================================================================================');
  console.log(`\n🏆 TIER 1 (Premium):`);
  console.log(`   ✅ Success: ${allResults.tier1.success.length}/${TIER1_COMMUNITIES.length}`);
  console.log(`   ❌ Failed: ${allResults.tier1.failed.length}/${TIER1_COMMUNITIES.length}`);
  
  console.log(`\n📈 TIER 2 (Volume):`);
  console.log(`   ✅ Success: ${allResults.tier2.success.length}/${TIER2_COMMUNITIES.length}`);
  console.log(`   ❌ Failed: ${allResults.tier2.failed.length}/${TIER2_COMMUNITIES.length}`);
  
  const totalSuccess = allResults.tier1.success.length + allResults.tier2.success.length;
  const totalFailed = allResults.tier1.failed.length + allResults.tier2.failed.length;
  const totalCommunities = TIER1_COMMUNITIES.length + TIER2_COMMUNITIES.length;
  
  console.log(`\n📊 TOTAL:`);
  console.log(`   ✅ Success: ${totalSuccess}/${totalCommunities}`);
  console.log(`   ❌ Failed: ${totalFailed}/${totalCommunities}`);
  console.log(`   📈 Success Rate: ${((totalSuccess / totalCommunities) * 100).toFixed(1)}%`);
  
  if (totalFailed > 0) {
    console.log('\n❌ FAILED UPDATES:');
    [...allResults.tier1.failed, ...allResults.tier2.failed].forEach(f => {
      console.log(`   - ${f.name}: ${f.error}`);
    });
  }
  
  console.log('\n================================================================================');
  console.log(`Completed at: ${new Date().toISOString()}`);
  console.log('================================================================================');
}

// Run the script
main().catch(console.error);

