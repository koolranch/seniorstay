/**
 * Apply hand-written descriptions to AL/MC/IL communities that are missing
 * them (empty descriptions cause the page to be noindexed and excluded from
 * the sitemap). Descriptions were written from verified facts: Supabase
 * care-type/amenity data plus Google Places ratings gathered on 2026-07-03
 * via scripts/gather-description-facts.ts.
 *
 * Safety: only updates rows whose current description is NULL or <= 50 chars.
 *
 * Usage:
 *   npx tsx scripts/apply-community-descriptions.ts --dry-run
 *   npx tsx scripts/apply-community-descriptions.ts
 */

import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.production.local' });
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const dryRun = process.argv.includes('--dry-run');

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const DESCRIPTIONS: Array<{ id: string; name: string; description: string }> = [
  {
    id: '220ef84c-9916-44aa-a649-621a936642f1',
    name: 'Maplewood at Cuyahoga Falls',
    description:
      'Maplewood at Cuyahoga Falls offers assisted living and memory care in a wooded setting on West Bath Road, on the border of Cuyahoga Falls and Akron. The community is known for its farm-to-table, restaurant-style dining and a dedicated memory care program built around each resident\u2019s personal history. Families consistently rate Maplewood among the highest-reviewed senior living communities in the Akron area, and its location puts residents within easy reach of Summit County\u2019s hospitals and the Cuyahoga Valley National Park.',
  },
  {
    id: '1ac3645d-c70e-4f9d-9608-599217c4c4d5',
    name: 'Brookdale Wickliffe',
    description:
      'Brookdale Wickliffe provides assisted living and memory care on Ridge Road in Wickliffe, serving families across Lake County and Cleveland\u2019s eastern suburbs. As part of the national Brookdale network, the community offers personalized care plans, medication management, and structured daily programming, with a secured memory care neighborhood for residents living with dementia. Its location off I-90 makes visits convenient for family in Willoughby, Euclid, and the surrounding east side.',
  },
  {
    id: '2d408d30-8f8c-49bd-8572-3d1c86e298fe',
    name: 'Danbury Senior Living Cuyahoga Falls',
    description:
      'Danbury Senior Living Cuyahoga Falls, located at 2645 Sackett Avenue, offers assisted living and memory care from a locally grown Ohio operator. Danbury communities emphasize resident choice \u2014 flexible dining, a full activity calendar, and care plans that adjust as needs change. The Cuyahoga Falls location serves families throughout the Falls, Stow, and greater Akron, with quick access to Route 8 and area hospitals.',
  },
  {
    id: 'baac72b7-478e-4306-9761-398355cbd5d6',
    name: 'Light of Hearts Villa',
    description:
      'Light of Hearts Villa is a faith-rooted assisted living and memory care community on Union Street in Bedford, sponsored in the Catholic tradition with an on-site chapel and pastoral care. Residents enjoy restaurant-style dining, community gardens, and a full social calendar in an intimate, mission-driven setting. Highly rated by families, the Villa serves Bedford, Maple Heights, Solon, and Cleveland\u2019s southeast suburbs.',
  },
  {
    id: 'b64c4494-2ea7-45f6-bbe3-a66a33e777a2',
    name: "Berea Alzheimer's Care Center",
    description:
      'Berea Alzheimer\u2019s Care Center is a specialized memory care community in Berea dedicated entirely to residents living with Alzheimer\u2019s disease and other dementias. Because dementia care is its sole focus, staff training, building design, and daily programming all center on cognitive support and resident safety. The center serves southwest Cleveland suburbs including Berea, Middleburg Heights, and Strongsville, minutes from Southwest General Health Center.',
  },
  {
    id: 'ca38eb95-4ed5-441b-824e-160386034910',
    name: 'Brookdale Medina South',
    description:
      'Brookdale Medina South offers assisted living and memory care just south of Medina\u2019s historic square. The community features restaurant-style dining, a fitness center, transportation services, housekeeping, and community gardens, along with a secured memory care neighborhood. Well rated by area families, it serves Medina County residents who want quality care close to home, with Cleveland Clinic Medina Hospital nearby.',
  },
  {
    id: 'fb781978-f151-4ca4-b98c-f75fd8b1a5c4',
    name: 'St. Augustine Towers Assisted Living',
    description:
      'St. Augustine Towers provides assisted living in Cleveland as part of St. Augustine Health Ministries, a Catholic nonprofit that has served Cleveland seniors for decades. The community offers personal care assistance, medication support, and daily activities at an accessible price point for city families, with pastoral care available on campus. Its west side location keeps residents close to longtime neighborhoods, churches, and family.',
  },
  {
    id: '43ff83fa-6db0-41aa-b84f-9e81b2b95af7',
    name: 'Vitalia Senior Residences at Westlake',
    description:
      'Vitalia Senior Residences at Westlake is a modern assisted living and memory care community on Center Ridge Road, minutes from UH St. John Medical Center and the shops at Crocker Park. One of the newer buildings in Westlake, Vitalia features resort-style common areas, restaurant dining, a theater, and a salon, with a secured memory care neighborhood. It serves families across Cleveland\u2019s west side, from Bay Village to North Olmsted.',
  },
  {
    id: '1364b89d-5f10-4497-885e-63bc1980a81c',
    name: 'Brooklyn Pointe Assisted Living and Memory Care',
    description:
      'Brooklyn Pointe offers assisted living and memory care in Brooklyn, Ohio, convenient to I-480 and Cleveland\u2019s southwest neighborhoods. The community pairs restaurant-style dining and landscaped courtyard gardens with a dedicated memory care program in a secured neighborhood. Families in Brooklyn, Parma, and Old Brooklyn appreciate being able to keep a parent close by while getting 24-hour care support.',
  },
  {
    id: 'd857de36-3f1d-4e86-bd70-f35325758cb1',
    name: 'Danbury Hudson',
    description:
      'Danbury Hudson brings the Ohio-based Danbury Senior Living model to Hudson, offering assisted living and memory care with an unusually deep amenity list: restaurant-style dining, a fitness center, transportation, housekeeping, an on-site licensed nurse, a beauty salon, and 24-hour staffing. Well rated by area families, it serves Hudson, Stow, Twinsburg, and northern Summit County in one of the region\u2019s most desirable historic communities.',
  },
  {
    id: 'e45a8e91-8766-4e39-b94e-3b3253e99fce',
    name: 'Hudson Grande Senior Living',
    description:
      'Hudson Grande Senior Living offers assisted living and memory care in Hudson with licensed nursing on site, transportation services, and full housekeeping. The community\u2019s memory care program provides structured, secured support for residents with dementia while assisted living residents keep as much independence as they can manage. Strong family reviews and a location near Hudson\u2019s Western Reserve downtown make it a frequent choice for Summit County families.',
  },
  {
    id: '24a1d6c9-83da-4e68-a7cc-6d61f420ee55',
    name: 'Danbury Cuyahoga Falls',
    description:
      'Danbury\u2019s Cuyahoga Falls campus provides assisted living and memory care with restaurant-style dining, housekeeping, a beauty salon, 24-hour staffing, and a busy social calendar. Run by one of Ohio\u2019s homegrown senior living operators, the community is designed around resident choice, with care plans that flex as needs change. It serves Cuyahoga Falls, Stow, Silver Lake, and the greater Akron area.',
  },
  {
    id: '742b1271-1cda-44b3-9189-883ddcfb6f8d',
    name: 'Lakeside Assisted Living at The Normandy',
    description:
      'Lakeside Assisted Living is part of The Normandy senior living campus in Rocky River, a longstanding west side institution near Lake Erie and Cleveland Clinic Fairview Hospital. Residents receive personal care support with restaurant-style dining and daily activities, and the larger Normandy campus offers additional levels of care if needs progress. Its Rocky River location keeps residents in the heart of the Detroit Road corridor, close to family in Lakewood, Westlake, and Bay Village.',
  },
  {
    id: '29be3edb-d31b-413f-8d67-5c8910043849',
    name: 'StoryPoint Rockside',
    description:
      'StoryPoint Rockside (formerly Vitalia Rockside) offers independent living, assisted living, and memory care in Seven Hills, just off the Rockside Road corridor near Independence. The full continuum lets couples with different care needs stay in one community, and the modern campus includes restaurant dining and extensive common spaces. Well rated by families, it draws residents from Seven Hills, Parma, Independence, and Broadview Heights.',
  },
  {
    id: '40001c45-1fb2-4d07-b48d-29d62d84f654',
    name: 'Saint Therese of Westlake',
    description:
      'Saint Therese of Westlake is a faith-based assisted living and memory care community on Detroit Road, featuring an on-site chapel, restaurant-style dining, transportation, housekeeping, a salon, and community gardens. Spiritual life is woven into daily programming for residents who want it, while the community welcomes seniors of all backgrounds. It serves Westlake, Bay Village, Avon, and Cleveland\u2019s western suburbs, minutes from UH St. John Medical Center.',
  },
  {
    id: '7155b37a-3f18-44c8-b41b-63149fa8c42e',
    name: 'Concord Reserve',
    description:
      'Concord Reserve is a continuing care community on Dover Center Road in Westlake offering independent living, assisted living, memory care, and skilled nursing on a single campus. That full continuum means residents can move between care levels without leaving the community \u2014 a major consideration for couples and for families planning ahead. Amenities include restaurant-style dining, a fitness center, an on-site licensed nurse, a chapel, and 24-hour staffing.',
  },
  {
    id: '028e6ef8-036e-401b-a216-68e6245e63ed',
    name: 'Beachwood Commons',
    description:
      'Beachwood Commons provides assisted living on Cleveland\u2019s east side with a broad amenity set: restaurant-style dining, a fitness center, a swimming pool, transportation, housekeeping, licensed nursing on site, and community gardens. Located in Beachwood minutes from UH Ahuja Medical Center and Cleveland Clinic\u2019s east side campuses, it serves families in Beachwood, Shaker Heights, Pepper Pike, and the surrounding suburbs.',
  },
  {
    id: '5a6889a4-5865-498c-83b9-aa5a102433bb',
    name: 'Windsor Heights Assisted Living',
    description:
      'Windsor Heights offers assisted living and memory care in Beachwood, and stands out for consistently strong family reviews. The community provides personal care, medication management, and a secured memory care neighborhood, with UH Ahuja Medical Center and Hillcrest Hospital both a short drive away. Families across Cleveland\u2019s east side \u2014 Beachwood, Lyndhurst, South Euclid, and Shaker Heights \u2014 tour Windsor Heights for its balance of care quality and value.',
  },
  {
    id: '3af95a7c-6b08-41dc-816c-59dc2fcf95fe',
    name: 'Summit Point',
    description:
      'Summit Point in Macedonia offers independent living, assisted living, and memory care on one campus, serving families across northern Summit County. The full continuum of care allows residents to age in place as needs change, and the community\u2019s location between Cleveland and Akron \u2014 near Route 8 and the Ohio Turnpike \u2014 makes visits easy from either direction. Well rated by families in Macedonia, Twinsburg, Hudson, and Sagamore Hills.',
  },
  {
    id: 'c457fc31-35d9-40d1-a24d-71f33b797d47',
    name: 'The Villas at King David',
    description:
      'The Villas at King David offers assisted living and memory care in Beachwood on the Menorah Park campus, one of Cleveland\u2019s most established senior care organizations. Residents benefit from the campus\u2019s depth of clinical resources and cultural programming, including kosher dining traditions, while living in apartment-style residences. The location serves Beachwood, Shaker Heights, University Heights, and Cleveland\u2019s east side Jewish community, though residents of all backgrounds are welcome.',
  },
  {
    id: '85b6c366-876c-434f-bc3c-cd9546b769c3',
    name: 'American House Macedonia',
    description:
      'American House Macedonia provides independent living and assisted living with restaurant-style dining, a fitness center, housekeeping, a beauty salon, community gardens, and 24-hour staffing. The community sits in Macedonia near the Route 8 corridor, convenient to both Cleveland\u2019s southeast suburbs and northern Akron. Its combination of independent and assisted living lets residents start with minimal support and add care services as needs grow.',
  },
  {
    id: '6268a07a-8d2c-4c1f-ac49-8fc88e42367c',
    name: 'Westwood Place',
    description:
      'Westwood Place offers assisted living in Cleveland with personal care assistance, medication support, and daily social programming in a smaller, more intimate setting than the large suburban campuses. For families who want to keep a parent in the city \u2014 close to longtime neighborhoods, churches, and relatives \u2014 Westwood Place provides an accessible option with 24-hour staff support.',
  },
  {
    id: 'd941a83b-e1ab-46eb-9e1b-2fd2dac7356a',
    name: 'Embassy of Rockport',
    description:
      'Embassy of Rockport provides assisted living and memory care in Rocky River with restaurant-style dining, transportation, housekeeping, a beauty salon, a chapel, community gardens, and 24-hour staffing. The community serves Cleveland\u2019s west shore \u2014 Rocky River, Fairview Park, Lakewood, and Westlake \u2014 with Cleveland Clinic Fairview Hospital just minutes away. A secured memory care neighborhood supports residents living with dementia.',
  },
  {
    id: '3c3fbde5-0117-4da8-9eb3-1b660240131f',
    name: 'Maplewood at Chardon',
    description:
      'Maplewood at Chardon brings farm-to-table dining and a personalized memory care program to Geauga County, offering assisted living and memory care near Chardon\u2019s historic town square. One of the highest-rated senior living communities on Cleveland\u2019s far east side, Maplewood emphasizes fresh, locally sourced meals and life-story-based dementia care. It serves Chardon, Chesterland, Munson, and the Chagrin Valley\u2019s eastern communities.',
  },
  {
    id: 'ccd858e0-ce68-45e2-9318-64ea01c93788',
    name: 'Paramount Senior Living',
    description:
      'Paramount Senior Living at Middleburg Heights offers independent living and assisted living with one of the fuller amenity sets in the southwest suburbs: restaurant-style dining, a fitness center, transportation, housekeeping, licensed nursing on site, community gardens, and 24-hour staffing. Located near Southwest General Health Center and I-71, it serves Middleburg Heights, Berea, Strongsville, and Parma families.',
  },
  {
    id: '4afeaf63-e3f0-4a7b-97e1-d8498db18fda',
    name: 'Vitalia North Royalton',
    description:
      'Vitalia North Royalton offers independent living, assisted living, and memory care on one modern campus in the southwest suburbs. The continuum-of-care model lets residents transition between levels without changing communities, and the newer construction features apartment-style residences with contemporary common spaces. Well rated by families, it serves North Royalton, Broadview Heights, Strongsville, and Brecksville.',
  },
  {
    id: 'f7b198eb-a4ef-4b39-b8ec-9e7ffc6e7444',
    name: 'Vitalia Stow',
    description:
      'Vitalia Stow provides independent living, assisted living, and memory care in Stow, serving Summit County families between Akron and Hudson. The campus offers a full continuum of care with modern apartment residences, and it earns consistently strong reviews from area families. Residents stay close to Stow-Kent shopping, area churches, and Summa and Western Reserve hospital services in the Akron area.',
  },
  {
    id: 'e92e4621-15f1-4ef0-9d2b-04d18c67b372',
    name: 'Vitalia Active Adult Community North Olmsted',
    description:
      'Vitalia North Olmsted is an active adult independent living community for seniors who want maintenance-free apartment living with resort-style amenities \u2014 without paying for care services they don\u2019t need. One of the highest-rated senior communities on Cleveland\u2019s west side, it attracts residents downsizing from homes in North Olmsted, Westlake, Fairview Park, and Olmsted Falls, with Great Northern shopping and I-480 minutes away.',
  },
  {
    id: 'be6426df-1380-48f4-b925-332fbb4e02bb',
    name: 'Brookdale Montrose',
    description:
      'Brookdale Montrose offers assisted living and memory care in Akron\u2019s Montrose area, near the Route 18 retail corridor and Cleveland Clinic Akron General facilities. Amenities include restaurant-style dining, a fitness center, transportation, housekeeping, a beauty salon, community gardens, and 24-hour staffing, plus a secured memory care neighborhood. The location serves Fairlawn, Copley, Bath, and Akron\u2019s western suburbs.',
  },
  {
    id: 'c0ddd178-b249-4451-8a02-6400092a51d3',
    name: 'The Grande at Middleburg Heights',
    description:
      'The Grande at Middleburg Heights provides assisted living in Cleveland\u2019s southwest suburbs, with personal care assistance, medication management, and daily activity programming supported by 24-hour staff. Its location near Bagley Road puts residents minutes from Southwest General Health Center and keeps family visits easy from Berea, Parma, Strongsville, and Brook Park.',
  },
  {
    id: '08ca2f88-da07-44b3-98af-3c47b3a8f675',
    name: 'Vitalia Montrose',
    description:
      'Vitalia Montrose offers independent living, assisted living, and memory care on a single modern campus in Akron\u2019s Montrose area. The full continuum means a resident can start in an independent apartment and add care services over time without moving communities. Strongly reviewed by families, it serves Fairlawn, Bath, Copley, and greater Akron, close to the Montrose shopping district and area hospitals.',
  },
  {
    id: '66b639ec-5c5f-4618-aada-fcdef735fc92',
    name: 'Woodside Senior Living',
    description:
      'Woodside Senior Living offers assisted living in Bedford, providing personal care, medication support, and social programming with 24-hour staffing in Cleveland\u2019s southeast suburbs. The community serves Bedford, Bedford Heights, Maple Heights, and Garfield Heights families looking for practical, accessible assisted living close to home, with the Bedford campus of University Hospitals nearby.',
  },
  {
    id: '412bd683-ecdd-4a49-b649-2368dc2661c0',
    name: 'The Winfield at Richmond Heights',
    description:
      'The Winfield at Richmond Heights offers independent living and assisted living on Cleveland\u2019s northeast side, with memory support available as needs change. Apartment-style residences, dining services, and daily programming serve seniors from Richmond Heights, Euclid, Lyndhurst, Highland Heights, and Willoughby. UH Richmond Medical Center is nearby, and Hillcrest Hospital is a short drive south.',
  },
  {
    id: '5430ee81-ac37-4cc4-b956-e325f9321909',
    name: 'Richmond Heights Place',
    description:
      'Richmond Heights Place provides assisted living and memory care on Cleveland\u2019s northeast side, with a secured memory care neighborhood for residents living with dementia. The community offers personal care, medication management, and structured daily activities at a more accessible price point than many east side campuses, serving Richmond Heights, Euclid, South Euclid, and Cleveland Heights families.',
  },
  {
    id: '8c608d2e-8580-4ba6-a16f-059cdb8d8c42',
    name: 'Elmcroft of Sagamore Hills',
    description:
      'Elmcroft of Sagamore Hills offers assisted living and memory care in Northfield, set in the wooded Sagamore Hills area between Cleveland and Akron near the Cuyahoga Valley National Park. Residents receive personal care support and structured memory care programming in a suburban campus setting. The location serves Northfield, Macedonia, Brecksville, and Nordonia Hills families, with easy Route 8 access for visitors.',
  },
  {
    id: '198bcc86-7156-434e-bb17-3facfa608c78',
    name: 'Brookdale Bath',
    description:
      'Brookdale Bath provides assisted living and memory care in the Bath and Montrose area west of Akron. Part of the national Brookdale network, the community offers personalized care plans, medication management, daily programming, and a secured memory care neighborhood. It serves Bath Township, Fairlawn, Copley, and Akron\u2019s western suburbs, close to the Montrose retail corridor and Cleveland Clinic Akron General.',
  },
  {
    id: '31da613a-b9e1-4654-a86e-3bf2ab875fd2',
    name: 'Your Second Family',
    description:
      'Your Second Family is a small, residential-style assisted living home in Brooklyn, Ohio, offering a high staff-to-resident ratio and a genuinely home-like alternative to large senior living campuses. For families whose parent would be overwhelmed by a big community, this setting provides personal care, meals, and companionship in an intimate house environment on Cleveland\u2019s southwest side.',
  },
  {
    id: '364306c6-b1ff-44c3-8e4d-f1576c4e9217',
    name: 'Marymount Place',
    description:
      'Marymount Place offers assisted living in Garfield Heights on the Village at Marymount campus, a Catholic senior care community adjacent to Cleveland Clinic Marymount Hospital. Residents enjoy restaurant-style dining, community gardens, social activities, and pastoral care, with the reassurance of a hospital next door. It serves Garfield Heights, Maple Heights, Independence, and Cleveland\u2019s southeast neighborhoods.',
  },
  {
    id: '361f025d-d6d6-4025-bc78-f12ebec75edd',
    name: 'Rocky River Village',
    description:
      'Rocky River Village provides assisted living and memory care in Rocky River, one of Cleveland\u2019s most walkable west shore suburbs. Residents receive personal care and dementia support close to the Detroit Road business district, the Rocky River Reservation Metroparks, and Cleveland Clinic Fairview Hospital. The community serves Rocky River, Lakewood, Fairview Park, and Westlake families.',
  },
  {
    id: 'd58d215c-f8a1-41f1-9d51-7f3cbd26a4c5',
    name: 'Danbury Senior Living Brunswick',
    description:
      'Danbury Senior Living Brunswick offers independent living, assisted living, and memory care in Medina County, with restaurant-style dining, housekeeping, licensed nursing on site, a beauty salon, community gardens, and 24-hour staffing. The Ohio-based Danbury organization emphasizes resident choice and flexible care plans. Well rated by families, the campus serves Brunswick, Medina, Strongsville, and Hinckley.',
  },
  {
    id: 'c7db9506-76f4-4117-b3b2-be62cf5e6498',
    name: 'Hines Hill Senior Living',
    description:
      'Hines Hill Senior Living offers assisted living in Hudson with restaurant-style dining, housekeeping, memory support programming, and a full activity calendar in a boutique-scale setting. Smaller than the big regional campuses, Hines Hill appeals to families who want more personal attention in one of Northeast Ohio\u2019s most sought-after communities. It serves Hudson, Stow, Twinsburg, and northern Summit County.',
  },
  {
    id: '2806d7a1-600a-4191-99a2-d2a84f369429',
    name: 'Sunrise of Cuyahoga Falls',
    description:
      'Sunrise of Cuyahoga Falls provides assisted living and memory care as part of the Sunrise Senior Living network, known for its signature Reminiscence memory care neighborhoods and individualized service plans. Among the highest-rated senior living communities in the Akron area, it serves Cuyahoga Falls, Stow, Silver Lake, and Akron families with personal care, medication management, and daily programming.',
  },
  {
    id: '932a2dce-542e-4bac-9913-e129891f973f',
    name: 'Devon Oaks Assisted Living',
    description:
      'Devon Oaks offers assisted living and memory care on Crocker Road in Westlake as part of the Eliza Jennings network, a respected Northeast Ohio nonprofit serving seniors since 1888. Smaller and quieter than the large campuses nearby, Devon Oaks is known for long-tenured staff and continuity of caregivers, with restaurant-style dining and dedicated memory care programming. UH St. John Medical Center and Crocker Park are minutes away.',
  },
  {
    id: '5d0b147e-84a7-4943-b4f8-6dec49d42668',
    name: 'Wiggins Place',
    description:
      'Wiggins Place is an assisted living residence on the Menorah Park campus in Beachwood, giving residents apartment-style living backed by the clinical depth of one of Cleveland\u2019s most established senior care organizations. Kosher dining and Jewish cultural programming are central to campus life, and residents have priority access to Menorah Park\u2019s rehabilitation and care services. It serves Beachwood, Shaker Heights, and Cleveland\u2019s east side.',
  },
  {
    id: 'dff5aeab-df72-481b-b9f1-0a8540630d20',
    name: 'Danbury Senior Living North Ridgeville',
    description:
      'Danbury Senior Living North Ridgeville offers assisted living and memory care in fast-growing eastern Lorain County, with restaurant-style dining, housekeeping, licensed nursing on site, a beauty salon, community gardens, and 24-hour staffing. Part of the Ohio-based Danbury family of communities, it serves North Ridgeville, Avon, Elyria, and Westlake families, with convenient access from I-480 and Route 83.',
  },
  {
    id: '93a420ab-7890-4e8b-a08d-e31404698847',
    name: 'StoryPoint Medina',
    description:
      'StoryPoint Medina offers independent living, assisted living, and memory care on one campus near Medina\u2019s historic square. One of the highest-rated senior living communities in Medina County, StoryPoint pairs a full care continuum with chef-prepared dining and robust daily programming. The campus serves Medina, Brunswick, Wadsworth, and southern Cleveland suburbs, close to Cleveland Clinic Medina Hospital.',
  },
  {
    id: '46f44534-0bb5-412b-b631-d7693c957bc2',
    name: 'Vista Springs Ravinia',
    description:
      'Vista Springs Ravinia provides assisted living and memory care in Independence, near the Rockside Road corridor at the center of Cuyahoga County. Known for its \u201cresort-style\u201d hospitality model and strongly reviewed by families, the community offers chef-prepared dining, daily programming, and a dedicated memory care neighborhood. Its central location makes visits easy from Independence, Seven Hills, Brecksville, and Garfield Heights.',
  },
];

async function main() {
  console.log(`${dryRun ? '[DRY RUN] ' : ''}Applying ${DESCRIPTIONS.length} descriptions...\n`);

  let applied = 0;
  let skipped = 0;

  for (const entry of DESCRIPTIONS) {
    const { data: current, error: fetchError } = await supabase
      .from('Community')
      .select('id, name, description')
      .eq('id', entry.id)
      .single();

    if (fetchError || !current) {
      console.log(`✗ ${entry.name}: row not found (${fetchError?.message})`);
      skipped++;
      continue;
    }

    if (current.description && current.description.trim().length > 50) {
      console.log(`- ${entry.name}: already has description, skipping`);
      skipped++;
      continue;
    }

    if (dryRun) {
      console.log(`→ ${entry.name}: would apply ${entry.description.length} chars`);
      applied++;
      continue;
    }

    const { error: updateError } = await supabase
      .from('Community')
      .update({ description: entry.description, updatedAt: new Date().toISOString() })
      .eq('id', entry.id);

    if (updateError) {
      console.log(`✗ ${entry.name}: update failed (${updateError.message})`);
      skipped++;
    } else {
      console.log(`✓ ${entry.name} (${entry.description.length} chars)`);
      applied++;
    }
  }

  console.log(`\nDone. Applied: ${applied}, skipped: ${skipped}`);
}

main();
