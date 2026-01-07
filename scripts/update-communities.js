/**
 * Community Description & Image Update Script
 * Guide for Seniors - Site Health Fix
 * 
 * This script updates community descriptions and image sources
 * for incomplete communities in the Greater Cleveland area.
 * 
 * Run with: NODE_TLS_REJECT_UNAUTHORIZED=0 node scripts/update-communities.js
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://hncgnxbooghjhpncujzx.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhuY2dueGJvb2doamhwbmN1anp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyMTI0ODIsImV4cCI6MjA1OTc4ODQ4Mn0.mdAL87W0h4PN7Xu8ESjjDxzjW_H3YH55i-FqAE5SXcs';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Community updates with researched descriptions and image sources
const communityUpdates = [
  {
    namePattern: '%fairmont%westlake%',
    description: `Fairmont Senior Living of Westlake provides compassionate assisted living and specialized memory care just 12 miles west of downtown Cleveland. As one of only two Gold Credentialed communities in Ohio, Fairmont uses the innovative Montessori-Inspired Lifestyle® approach to foster independence, dignity, and meaningful engagement for every resident.

Their dedicated memory care program honors each individual's strengths with tailored physical and cognitive therapies, while assisted living residents enjoy personalized daily support in a warm, homelike environment. Located conveniently near St. John Medical Center and Cleveland Clinic Fairview Hospital, families gain peace of mind knowing expert clinical care is minutes away.

The community serves Westlake and surrounding areas including Bay Village, Fairview Park, and Rocky River, offering virtual tours, private dining rooms, and beautifully landscaped outdoor spaces just one mile from Lake Erie.`,
    website: 'https://www.fairmontseniorliving.com/westlake-oh/',
    imageUrl: 'https://www.fairmontseniorliving.com/wp-content/uploads/2024/11/Fairmont-Westlake-Exterior-Website-Photo-1.jpg',
    imageSource: 'https://www.fairmontseniorliving.com/westlake-oh/gallery/',
    services: 'Assisted Living, Memory Care'
  },
  {
    namePattern: '%arden courts%parma%',
    description: `Arden Courts of Parma is a purpose-built memory care community dedicated exclusively to supporting individuals with Alzheimer's disease, dementia, and other memory impairments. Located in the heart of Parma, Ohio, just minutes from Parma Community General Hospital and University Hospitals Parma Medical Center, this intimate setting provides 24/7 specialized care in secure, thoughtfully designed neighborhoods.

Each resident benefits from personalized engagement programs that celebrate their unique life story, abilities, and preferences. The professionally trained staff creates meaningful daily activities that promote cognitive stimulation, social connection, and physical wellness. With a focus on person-centered care, Arden Courts helps residents maintain their highest possible quality of life.

The community features private and semi-private suites, secure outdoor courtyards for safe wandering, and nutritious chef-prepared meals.`,
    website: 'https://www.ardenseniorliving.com/parma-oh',
    imageSource: 'https://www.ardenseniorliving.com/parma-oh/gallery',
    services: 'Memory Care'
  },
  {
    namePattern: '%broadview multi%care%',
    description: `Broadview Multi-Care Center has proudly served the Cleveland and Parma communities for over 50 years, offering comprehensive skilled nursing, rehabilitation, and long-term care services. This family-owned and operated facility is located on Broadview Road in Parma, just minutes from major highways and leading hospitals including Cleveland Clinic and MetroHealth.

Recognized by Newsweek as one of America's Best Nursing Homes 2024, Broadview features a dedicated short-term rehabilitation unit with private suites and bathrooms. Residents benefit from physical, occupational, and speech therapies up to seven days a week, along with advanced respiratory therapy and on-site cardiology and pulmonary medical care.

With 200 beds and services including hospice and respite care, Broadview provides a homelike atmosphere where high-quality clinical care meets genuine compassion.`,
    website: 'https://lhshealth.com/broadview-multi-care-center/',
    imageUrl: 'https://lhshealth.com/wp-content/uploads/2023/06/broadview-1.jpg',
    imageSource: 'https://lhshealth.com/broadview-multi-care-center/',
    services: 'Skilled Nursing, Rehabilitation, Long-Term Care, Memory Care, Respite Care, Hospice'
  },
  {
    namePattern: '%ganzhorn%avon%',
    description: `The Ganzhorn Suites of Avon offers a distinctive approach to assisted living and memory care in one of Cleveland's most desirable western suburbs. Located conveniently near Cleveland Clinic Avon Hospital and just off I-90, this thoughtfully designed community emphasizes independence, choice, and meaningful engagement for every resident.

The assisted living program provides personalized support with daily activities including bathing, dressing, and medication management, while encouraging residents to maintain their preferred lifestyle. For those requiring memory care, Ganzhorn's specialized programming focuses on cognitive stimulation and activities tailored to each individual's life history.

Residents enjoy restaurant-style dining, beautifully appointed common areas, and a calendar full of social, recreational, and wellness activities. With 24-hour nursing oversight, families can trust their loved ones receive attentive, compassionate care.`,
    website: 'https://www.ganzhornsuites.com/avon-oh',
    imageSource: 'https://www.ganzhornsuites.com/avon-oh/gallery',
    services: 'Assisted Living, Memory Care'
  },
  {
    namePattern: '%vitalia%mentor%',
    description: `Vitalia Mentor serves as Lake County's premier destination for skilled nursing, rehabilitation, and specialized memory care. Located in Mentor, Ohio, just minutes from Lake Health's TriPoint Medical Center and University Hospitals Lake West Medical Center, this 117-bed community provides comprehensive care services on Cleveland's eastern edge.

The facility excels in short-term rehabilitation, helping residents recover from surgery, stroke, or illness through intensive physical, occupational, and speech therapy programs. Their dedicated memory care neighborhood offers a secure, structured environment for individuals living with Alzheimer's disease and dementia.

Vitalia Mentor combines modern amenities with personalized attention, offering private and semi-private rooms, therapy gym facilities, and engaging daily activities. The community accepts Medicare, Medicaid, and most insurance plans.`,
    website: 'https://www.vitaliasenior.com/mentor',
    imageSource: 'https://www.vitaliasenior.com/mentor/gallery',
    services: 'Skilled Nursing, Rehabilitation, Memory Care, Long-Term Care'
  },
  {
    namePattern: '%avenue%broadview heights%',
    description: `The Avenue at Broadview Heights offers modern assisted living in one of Cleveland's most desirable southern suburbs. This community provides personalized daily support with activities like bathing, dressing, and medication management while encouraging residents to maintain their independence and preferred lifestyle.

Located in Broadview Heights with convenient access to Cleveland Clinic's Broadview Heights Family Health Center and Hillcrest Hospital, residents benefit from proximity to quality healthcare. The community features spacious apartments, restaurant-style dining, and a full calendar of social and recreational activities.

For families seeking assisted living in the Broadview Heights, Seven Hills, or Independence areas, this community combines modern amenities with compassionate care in a welcoming neighborhood setting.`,
    services: 'Assisted Living'
  },
  {
    namePattern: '%heritage%strongsville%',
    description: `Heritage Club of Strongsville provides independent and assisted living options in one of Cleveland's most family-friendly southern suburbs. Located near Southwest General Health Center and with easy access to Cleveland Clinic facilities, this community offers peace of mind for both residents and families.

The community features well-appointed apartments, engaging social activities, and supportive services that allow residents to age in place comfortably. Whether your loved one seeks independent living with optional services or requires daily assistance with personal care, Heritage Club creates a welcoming environment where seniors can thrive.

Strongsville's excellent location provides easy access to shopping, dining, and recreational opportunities while maintaining a quiet residential atmosphere.`,
    services: 'Independent Living, Assisted Living'
  }
];

async function updateCommunities() {
  console.log('🚀 Starting community updates...\n');
  
  let updated = 0;
  let failed = 0;
  let skipped = 0;

  for (const update of communityUpdates) {
    console.log(`📝 Processing: ${update.namePattern}`);
    
    try {
      // First, find the community
      const { data: communities, error: findError } = await supabase
        .from('Community')
        .select('id, name, city, description')
        .ilike('name', update.namePattern)
        .eq('state', 'OH');

      if (findError) {
        console.error(`   ❌ Error finding community: ${findError.message}`);
        failed++;
        continue;
      }

      if (!communities || communities.length === 0) {
        console.log(`   ⚠️ No community found matching pattern`);
        skipped++;
        continue;
      }

      // If multiple matches, handle duplicates (keep first, update it)
      const primaryCommunity = communities[0];
      
      if (communities.length > 1) {
        console.log(`   ⚠️ Found ${communities.length} matches - will update primary and note duplicates`);
        for (let i = 1; i < communities.length; i++) {
          console.log(`      Duplicate: ${communities[i].name} (ID: ${communities[i].id})`);
        }
      }

      // Build update object
      const updateData = {
        description: update.description,
        updatedAt: new Date().toISOString()
      };

      if (update.website) updateData.website = update.website;
      if (update.imageUrl) updateData.image_url = update.imageUrl;
      if (update.services) updateData.services = update.services;
      // Note: official_image_source would need to be added to schema first

      // Perform update
      const { error: updateError } = await supabase
        .from('Community')
        .update(updateData)
        .eq('id', primaryCommunity.id);

      if (updateError) {
        console.error(`   ❌ Error updating: ${updateError.message}`);
        failed++;
      } else {
        console.log(`   ✅ Updated: ${primaryCommunity.name} (${primaryCommunity.city})`);
        updated++;
      }

    } catch (error) {
      console.error(`   ❌ Unexpected error: ${error.message}`);
      failed++;
    }
  }

  console.log('\n================================================================================');
  console.log('📊 UPDATE SUMMARY');
  console.log('================================================================================');
  console.log(`✅ Successfully updated: ${updated}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`⚠️ Skipped (not found): ${skipped}`);
  
  // Final verification
  console.log('\n📋 Verifying remaining incomplete communities...');
  
  const { data: remaining, error: remainingError } = await supabase
    .from('Community')
    .select('id, name, city')
    .eq('state', 'OH')
    .or('description.is.null,description.eq.');

  if (!remainingError && remaining) {
    console.log(`\n📌 Communities still missing descriptions: ${remaining.length}`);
    if (remaining.length > 0 && remaining.length <= 20) {
      remaining.forEach((c, i) => {
        console.log(`   ${i + 1}. ${c.name}, ${c.city} (ID: ${c.id})`);
      });
    }
  }
}

// Handle Fairmont duplicates specifically
async function handleFairmontDuplicates() {
  console.log('\n🔍 Checking for Fairmont duplicates...');
  
  const { data: fairmonts, error } = await supabase
    .from('Community')
    .select('id, name, city, description, createdAt')
    .ilike('name', '%fairmont%westlake%')
    .order('createdAt', { ascending: true });

  if (error) {
    console.error('Error finding Fairmont:', error.message);
    return;
  }

  if (fairmonts && fairmonts.length > 1) {
    console.log(`Found ${fairmonts.length} Fairmont entries:`);
    fairmonts.forEach((f, i) => {
      console.log(`   ${i + 1}. ID: ${f.id}, Created: ${f.createdAt}`);
      console.log(`      Has Description: ${f.description ? 'Yes' : 'No'}`);
    });
    
    console.log('\n⚠️ DUPLICATE CLEANUP REQUIRED:');
    console.log(`   Keep: ID ${fairmonts[0].id} (oldest record)`);
    for (let i = 1; i < fairmonts.length; i++) {
      console.log(`   Delete: ID ${fairmonts[i].id}`);
    }
    console.log('\n   Run this SQL to delete duplicates:');
    for (let i = 1; i < fairmonts.length; i++) {
      console.log(`   DELETE FROM "Community" WHERE id = '${fairmonts[i].id}';`);
    }
  } else if (fairmonts && fairmonts.length === 1) {
    console.log('✅ Only one Fairmont entry found - no duplicates');
  } else {
    console.log('⚠️ No Fairmont entries found');
  }
}

// Main execution
async function main() {
  console.log('================================================================================');
  console.log('🏥 GUIDE FOR SENIORS - Community Description Update');
  console.log('================================================================================\n');
  
  await handleFairmontDuplicates();
  await updateCommunities();
  
  console.log('\n✅ Script completed!');
}

main().catch(console.error);

