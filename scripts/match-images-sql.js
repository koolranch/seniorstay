/**
 * Match community images using direct SQL approach
 * Run with: node scripts/match-images-sql.js
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://hncgnxbooghjhpncujzx.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_KEY) {
  console.error('Missing SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Manual mapping of images to communities based on filenames
const imageMap = {
  // Exact matches we can confirm
  'american-house-macedonia-macedonia-oh.webp': 'American House Macedonia',
  'arden-courts-parma-parma-oh.webp': 'Arden Courts of Parma',
  'atria-north-olmsted-north-olmsted-oh.webp': 'Atria North Olmsted',
  'avenue-macedonia-macedonia-oh.webp': 'The Avenue',
  'berea-alzheimers-care-center-berea-oh.webp': "Berea Alzheimer's Care Center",
  'brookdale-mentor-mentor-oh.webp': 'Brookdale',
  'brookdale-north-olmsted-north-olmsted-oh.webp': 'Brookdale North Olmsted',
  ' brookdale-north-olmsted-north-olmsted-oh.webp': 'Brookdale North Olmsted',
  'brooklyn-pointe-assisted-living-brooklyn-oh.webp': 'Brooklyn Pointe Assisted Living and Memory Care',
  'danbury-senior-living-broadview-heights-oh.webp': 'Danbury Senior Living Broadview Heights',
  'danbury-senior-living-brunswick-oh.webp': 'Danbury Senior Living Brunswick',
  'danbury-senior-living-hudson-oh.webp': 'Danbury Senior Living Hudson',
  'danbury-senior-living-mentor-oh.webp': 'Danbury Senior Living Mentor',
  'danbury-senior-living-north-canton-oh.webp': 'Danbury Senior Living North Canton',
  'eliza-jennings-cleveland-oh.webp': 'Eliza Jennings',
  'elmcroft-sagamore-hills-sagamore-hills-oh.webp': 'Elmcroft of Sagamore Hills',
  'emerald-village-north-olmsted-oh.webp': 'Emerald Village',
  'forest-hills-place-cleveland-heights-oh.webp': 'Forest Hills Place',
  'governors-village-mayfield-village-oh.webp': "Governor's Village",
  'grand-north-pointe-northfield-oh.webp': 'Grand North Pointe',
  'harborchase-shaker-heights-shaker-heights-oh.webp': 'HarborChase of Shaker Heights',
  'haven-at-lakewood-lakewood-oh.webp.jpeg': 'Haven at Lakewood',
  'hudson-meadows-hudson-oh.webp': 'Hudson Meadows',
  'jennings-brecksville-brecksville-oh.webp': 'Jennings at Brecksville',
  'kemper-house-highland-heights-oh.webp': 'Kemper House',
  'landing-stow-stow-oh.webp': 'The Landing of Stow',
  'laurel-lake-retirement-community-hudson-oh.webp': 'Laurel Lake Retirement Community',
  'legacy-place-parma-parma-oh.webp': 'Legacy Place Parma',
  'light-of-hearts-villa-bedford-oh.webp': 'Light of Hearts Villa',
  'maplewood-at-twinsburg-twinsburg-oh.webp': 'Maplewood at Twinsburg',
  'maple-woods-care-center-chardon-oh.webp': 'Maple Woods Care Center',
  'marymount-place-garfield-heights-oh.webp': 'Marymount Place',
  ' mcgregor-cleveland-oh.webp': 'McGregor',
  'mount-alverna-village-parma-oh.webp': 'Mount Alverna Village',
  'ohio-living-breckenridge-village-willoughby-oh.webp': 'Ohio Living Breckenridge Village',
  'paramount-senior-living-middleburg-heights-oh.webp': 'Paramount Senior Living',
  'parkside-villa-middleburg-heights-oh.webp': 'Parkside Villa',
  'renaissance-richfield-bath-richfield-oh.webp': 'Renaissance Richfield-Bath',
  'residence-chardon-chardon-oh.webp': 'The Residence at Chardon',
  'rocky-river-gardens-rocky-river-oh.webp': 'Rocky River Gardens',
  'rose-senior-living-beachwood-oh.webp': 'Rose Senior Living at Beachwood',
  'royalton-woods-north-royalton-oh.webp': 'Royalton Woods',
  'shevchenko-manor-parma-oh.webp': 'SHEVCHENKO MANOR',
  'storypoint-shaker-heights-shaker-heights-oh.webp': 'StoryPoint Shaker Heights',
  'summit-point-macedonia-oh.webp': 'Summit Point',
  'sunrise-parma-parma-oh.webp': 'Sunrise At Parma',
  'symphony-mentor-mentor-oh.webp': 'Symphony Mentor',
  'vista-springs-ravinia-independence-oh.webp': 'Vista Springs Ravinia',
  'vitalia-rockside-seven-hills-oh.webp': 'Vitalia Rockside',
  'vitalia-stow-stow-oh.webp': 'Vitalia Stow',
  'vitalia-strongsville-strongsville-oh.webp': 'Vitalia Strongsville',
  'vitalia-westlake-westlake-oh.webp': 'Vitalia Westlake',
  'westwood-place-cleveland-oh.webp': 'Westwood Place',
  'wexford-healthcare-center-tallmadge-oh.webp': 'Wexford Healthcare Center',
  'woodlands-shaker-heights-shaker-heights-oh.webp': 'The Woodlands at Shaker Heights',
};

async function main() {
  console.log('🖼️  Matching community images to database...\n');

  let updated = 0;
  let alreadySet = 0;
  let notFound = 0;

  for (const [filename, communityNamePart] of Object.entries(imageMap)) {
    try {
      // Find community by partial name match
      const { data: communities, error } = await supabase
        .from('Community')
        .select('id, name, city, image_url')
        .or(`name.ilike.%${communityNamePart}%`);

      if (error) {
        console.error(`Error querying for "${communityNamePart}":`, error.message);
        continue;
      }

      if (!communities || communities.length === 0) {
        console.log(`✗ No match found for: ${communityNamePart} (${filename})`);
        notFound++;
        continue;
      }

      // If multiple matches, try to find best one
      let targetCommunity = communities[0];
      if (communities.length > 1) {
        // Prefer AL/MC over skilled nursing
        const alMc = communities.find(c => 
          c.name.includes('Assisted Living') || 
          c.name.includes('Memory Care') ||
          c.name.includes('Independent Living')
        );
        if (alMc) targetCommunity = alMc;
      }

      // Check if already has image
      if (targetCommunity.image_url) {
        console.log(`⊙ ${targetCommunity.name} already has: ${targetCommunity.image_url}`);
        alreadySet++;
        continue;
      }

      // Update with image URL
      const imageUrl = `/community-images/${filename}`;
      const { error: updateError } = await supabase
        .from('Community')
        .update({ image_url: imageUrl })
        .eq('id', targetCommunity.id);

      if (updateError) {
        console.log(`✗ Failed to update ${targetCommunity.name}:`, updateError.message);
      } else {
        console.log(`✓ ${targetCommunity.name} → ${filename}`);
        updated++;
      }

    } catch (error) {
      console.error(`Error processing ${filename}:`, error);
    }
  }

  console.log('\n' + '='.repeat(80));
  console.log('📊 RESULTS');
  console.log('='.repeat(80));
  console.log(`Communities updated with images: ${updated}`);
  console.log(`Communities already had images: ${alreadySet}`);
  console.log(`Communities not found: ${notFound}`);
  console.log(`Total processed: ${Object.keys(imageMap).length}`);

  // Check homepage status
  console.log('\n🏠 Homepage AL/MC Communities with images:');
  const { data: homepageCommunities } = await supabase
    .from('Community')
    .select('name, image_url')
    .or('name.ilike.%Assisted Living%,name.ilike.%Memory Care%,name.ilike.%Independent Living%')
    .order('name');

  if (homepageCommunities) {
    const withImages = homepageCommunities.filter(c => c.image_url).length;
    console.log(`${withImages}/${homepageCommunities.length} AL/MC communities have images`);
    
    console.log('\nSample communities with images:');
    homepageCommunities
      .filter(c => c.image_url)
      .slice(0, 10)
      .forEach(c => console.log(`  ✓ ${c.name}`));
  }

  console.log('\n✨ Done!');
}

main().catch(console.error);

