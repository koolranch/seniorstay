/**
 * Script to identify communities with missing descriptions or placeholder images
 * Run with: NODE_TLS_REJECT_UNAUTHORIZED=0 node scripts/identify-incomplete-communities.js
 */

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://hncgnxbooghjhpncujzx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhuY2dueGJvb2doamhwbmN1anp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyMTI0ODIsImV4cCI6MjA1OTc4ODQ4Mn0.mdAL87W0h4PN7Xu8ESjjDxzjW_H3YH55i-FqAE5SXcs';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Greater Cleveland area cities (focus on these)
const clevelandAreaCities = [
  'WESTLAKE', 'BEACHWOOD', 'PARMA', 'SHAKER HEIGHTS', 'ROCKY RIVER', 
  'MENTOR', 'LAKEWOOD', 'STRONGSVILLE', 'SOLON', 'AVON', 'AVON LAKE',
  'BAY VILLAGE', 'BROOKLYN', 'BRECKSVILLE', 'BRUNSWICK', 'CHAGRIN FALLS',
  'CLEVELAND', 'CLEVELAND HEIGHTS', 'EUCLID', 'FAIRVIEW PARK', 'GARFIELD HEIGHTS',
  'INDEPENDENCE', 'LYNDHURST', 'MAPLE HEIGHTS', 'MAYFIELD HEIGHTS', 'MAYFIELD VILLAGE',
  'MEDINA', 'MIDDLEBURG HEIGHTS', 'NORTH OLMSTED', 'NORTH ROYALTON', 'OLMSTED FALLS',
  'ORANGE', 'PARMA HEIGHTS', 'PEPPER PIKE', 'RICHMOND HEIGHTS', 'SEVEN HILLS',
  'SOUTH EUCLID', 'TWINSBURG', 'UNIVERSITY HEIGHTS', 'WESTLAKE', 'WILLOUGHBY', 'WARRENSVILLE HEIGHTS',
  'BEDFORD', 'BEREA', 'BROOK PARK', 'BROADVIEW HEIGHTS', 'CHARDON', 'GATES MILLS',
  'HIGHLAND HEIGHTS', 'HUDSON', 'INDEPENDENCE', 'NORTHFIELD', 'MACEDONIA', 'NORTON'
];

async function identifyIncompleteCommunities() {
  console.log('🔍 Querying Greater Cleveland communities...\n');

  const { data: allCommunities, error } = await supabase
    .from('Community')
    .select('id, name, slug, city, state, description, image_url, image_urls, website, address, services')
    .eq('state', 'OH')
    .order('city');

  if (error) {
    console.error('Error fetching communities:', error);
    return;
  }

  // Filter to Greater Cleveland area
  const communities = allCommunities.filter(c => 
    clevelandAreaCities.some(city => 
      c.city && c.city.toUpperCase().includes(city) || city.includes(c.city?.toUpperCase())
    )
  );

  console.log(`📊 Total Ohio communities: ${allCommunities.length}`);
  console.log(`📊 Greater Cleveland area communities: ${communities.length}\n`);

  // Identify missing descriptions
  const missingDescriptions = communities.filter(c => 
    !c.description || c.description.trim() === '' || c.description.length < 50
  );

  // Identify placeholder/missing images
  const placeholderImages = communities.filter(c => {
    const hasValidImage = (c.image_url && !c.image_url.includes('placeholder') && !c.image_url.includes('no-image')) ||
                          (c.image_urls && c.image_urls.length > 0 && !c.image_urls[0]?.includes('placeholder'));
    return !hasValidImage;
  });

  // Find duplicates by normalized name
  const nameMap = new Map();
  communities.forEach(c => {
    const normalizedName = c.name.toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .replace(/(inc|llc|corporation|corp)$/g, '');
    if (!nameMap.has(normalizedName)) {
      nameMap.set(normalizedName, []);
    }
    nameMap.get(normalizedName).push(c);
  });
  
  const duplicates = Array.from(nameMap.values()).filter(group => group.length > 1);

  // Output summary
  console.log('=' .repeat(80));
  console.log('📋 SUMMARY');
  console.log('=' .repeat(80));
  console.log(`Missing Descriptions: ${missingDescriptions.length}`);
  console.log(`Missing/Placeholder Images: ${placeholderImages.length}`);
  console.log(`Potential Duplicates: ${duplicates.length} groups`);

  // Output communities needing descriptions
  console.log('\n' + '=' .repeat(80));
  console.log('📝 COMMUNITIES MISSING DESCRIPTIONS (' + missingDescriptions.length + ')');
  console.log('=' .repeat(80));
  
  missingDescriptions.forEach((c, i) => {
    console.log(`${i + 1}. ${c.name} | ${c.city}, ${c.state} | ID: ${c.id}`);
    if (c.website) console.log(`   Website: ${c.website}`);
    if (c.services) console.log(`   Services: ${c.services}`);
  });

  // Output communities needing images
  console.log('\n' + '=' .repeat(80));
  console.log('🖼️  COMMUNITIES WITH MISSING IMAGES (' + placeholderImages.length + ')');
  console.log('=' .repeat(80));
  
  placeholderImages.forEach((c, i) => {
    console.log(`${i + 1}. ${c.name} | ${c.city} | ID: ${c.id}`);
    if (c.website) console.log(`   Website: ${c.website}`);
  });

  // Output duplicates
  if (duplicates.length > 0) {
    console.log('\n' + '=' .repeat(80));
    console.log('⚠️  POTENTIAL DUPLICATES (' + duplicates.length + ' groups)');
    console.log('=' .repeat(80));
    
    duplicates.forEach((group, i) => {
      console.log(`\nGroup ${i + 1}:`);
      group.forEach(c => {
        console.log(`  - ${c.name}`);
        console.log(`    ID: ${c.id}`);
        console.log(`    City: ${c.city} | Desc: ${c.description ? 'Yes' : 'No'} | Image: ${c.image_url ? 'Yes' : 'No'}`);
      });
    });
  }

  // JSON for processing - only incomplete ones
  console.log('\n' + '=' .repeat(80));
  console.log('📋 JSON DATA FOR PROCESSING');
  console.log('=' .repeat(80));
  
  const output = {
    missingDescriptions: missingDescriptions.map(c => ({
      id: c.id,
      name: c.name,
      city: c.city,
      address: c.address,
      website: c.website,
      services: c.services,
      slug: c.slug
    })),
    missingImages: placeholderImages.map(c => ({
      id: c.id,
      name: c.name,
      city: c.city,
      website: c.website,
      slug: c.slug
    })),
    duplicates: duplicates.map(group => group.map(c => ({
      id: c.id,
      name: c.name,
      city: c.city,
      hasDescription: !!c.description,
      hasImage: !!c.image_url
    })))
  };

  console.log(JSON.stringify(output, null, 2));
}

identifyIncompleteCommunities().catch(console.error);
