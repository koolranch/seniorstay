/**
 * Script to clean up Supabase storage filenames and match images to communities
 * 
 * Run with: node scripts/match-community-images.js
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Use the correct Supabase project for guideforseniors
const SUPABASE_URL = 'https://hncgnxbooghjhpncujzx.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_KEY) {
  console.error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable');
  console.error('Please ensure .env.local has SUPABASE_SERVICE_ROLE_KEY set');
  process.exit(1);
}

console.log('🔗 Connecting to Supabase:', SUPABASE_URL);

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Normalize filename for matching
function normalizeFilename(filename) {
  return filename
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-_.]/g, '')
    .replace(/-+/g, '-');
}

// Generate slug from community name and city
function generateSlug(name, city) {
  const cleanName = name
    .replace(/,.*$/, '') // Remove everything after comma
    .replace(/\s+(assisted living|memory care|independent living|skilled nursing).*/gi, '')
    .trim();
  
  return `${cleanName}-${city}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

async function main() {
  console.log('🖼️  Starting community image matching process...\n');

  // Step 1: Get all files from storage
  console.log('📁 Fetching files from Supabase storage...');
  const { data: files, error: filesError } = await supabase
    .storage
    .from('community-images')
    .list();

  if (filesError || !files) {
    console.error('Error fetching files:', filesError);
    return;
  }

  console.log(`Found ${files.length} files in storage\n`);

  // Step 2: Clean up problematic filenames
  console.log('🧹 Cleaning up problematic filenames...');
  
  const filesToCleanup = [
    { old: ' brookdale-north-olmsted-north-olmsted-oh.webp', new: 'brookdale-north-olmsted-north-olmsted-oh.webp' },
    { old: ' mcgregor-cleveland-oh.webp', new: 'mcgregor-cleveland-oh.webp' },
    { old: 'haven-at-lakewood-lakewood-oh.webp.jpeg', new: 'haven-at-lakewood-lakewood-oh.webp' },
    { old: 'regina-health-center-richfield-oh.webp.jpg', new: 'regina-health-center-richfield-oh.webp' },
    { old: 'willowood-care-center-brunswick-oh.webp .avif', new: 'willowood-care-center-brunswick-oh.webp' },
  ];

  for (const file of filesToCleanup) {
    try {
      // Download the file
      const { data: fileData, error: downloadError } = await supabase
        .storage
        .from('community-images')
        .download(file.old);

      if (downloadError) {
        console.log(`⚠️  Could not download ${file.old}: ${downloadError.message}`);
        continue;
      }

      // Upload with new name
      const { error: uploadError } = await supabase
        .storage
        .from('community-images')
        .upload(file.new, fileData, {
          contentType: 'image/webp',
          upsert: true
        });

      if (uploadError) {
        console.log(`⚠️  Could not upload ${file.new}: ${uploadError.message}`);
        continue;
      }

      // Delete old file
      const { error: deleteError } = await supabase
        .storage
        .from('community-images')
        .remove([file.old]);

      if (deleteError) {
        console.log(`⚠️  Could not delete ${file.old}: ${deleteError.message}`);
        continue;
      }

      console.log(`✓ Cleaned: ${file.old} → ${file.new}`);

      // Update any database references
      const { error: updateError } = await supabase
        .from('Community')
        .update({ image_url: `/community-images/${file.new}` })
        .eq('image_url', `/community-images/${file.old}`);

      if (updateError) {
        console.log(`⚠️  Could not update database references: ${updateError.message}`);
      }

    } catch (error) {
      console.log(`⚠️  Error cleaning ${file.old}:`, error);
    }
  }

  console.log('✓ Filename cleanup complete\n');

  // Step 3: Get updated file list
  const { data: cleanFiles, error: cleanFilesError } = await supabase
    .storage
    .from('community-images')
    .list();

  if (cleanFilesError || !cleanFiles) {
    console.error('Error fetching cleaned files:', cleanFilesError);
    return;
  }

  // Step 4: Get all AL/MC communities
  console.log('🏘️  Fetching Assisted Living and Memory Care communities...');
  const { data: communities, error: communitiesError } = await supabase
    .from('Community')
    .select('id, name, city, state, image_url')
    .or('name.ilike.%Assisted Living%,name.ilike.%Memory Care%,name.ilike.%Independent Living%')
    .order('name');

  if (communitiesError || !communities) {
    console.error('Error fetching communities:', communitiesError);
    return;
  }

  console.log(`Found ${communities.length} AL/MC communities\n`);

  // Step 5: Match images to communities
  console.log('🔗 Matching images to communities...\n');
  
  const matches = [];
  const unmatched = [];
  let updated = 0;

  for (const file of cleanFiles) {
    const filename = file.name;
    
    // Skip if not an image file
    if (!filename.match(/\.(webp|jpeg|jpg|avif|png)$/i)) {
      continue;
    }

    // Extract base name without extension
    const baseName = filename.replace(/\.(webp|jpeg|jpg|avif|png)$/i, '');
    
    // Try to find matching community
    let bestMatch = null;
    let bestMatchScore = 0;

    for (const community of communities) {
      const communitySlug = generateSlug(community.name, community.city);
      const fileSlug = normalizeFilename(baseName);

      // Calculate match score
      let score = 0;
      
      // Exact slug match
      if (communitySlug === fileSlug) {
        score = 100;
      }
      // Contains slug
      else if (fileSlug.includes(communitySlug) || communitySlug.includes(fileSlug)) {
        score = 80;
      }
      // City and partial name match
      else if (fileSlug.includes(community.city.toLowerCase().replace(/\s+/g, '-'))) {
        const nameParts = community.name.toLowerCase().split(/[\s,]+/);
        const matchingParts = nameParts.filter(part => 
          part.length > 3 && fileSlug.includes(part)
        );
        score = matchingParts.length * 20;
      }

      if (score > bestMatchScore) {
        bestMatchScore = score;
        bestMatch = community;
      }
    }

    if (bestMatch && bestMatchScore >= 60) {
      const confidence = bestMatchScore >= 90 ? 'HIGH' : bestMatchScore >= 75 ? 'MEDIUM' : 'LOW';
      matches.push({
        community: bestMatch.name,
        file: filename,
        confidence
      });

      // Update database if community doesn't already have an image
      if (!bestMatch.image_url) {
        const { error: updateError } = await supabase
          .from('Community')
          .update({ image_url: `/community-images/${filename}` })
          .eq('id', bestMatch.id);

        if (!updateError) {
          updated++;
          console.log(`✓ ${bestMatch.name} → ${filename} (${confidence})`);
        } else {
          console.log(`✗ Failed to update ${bestMatch.name}: ${updateError.message}`);
        }
      } else {
        console.log(`⊙ ${bestMatch.name} already has image: ${bestMatch.image_url}`);
      }
    } else {
      unmatched.push(filename);
    }
  }

  // Step 6: Report results
  console.log('\n' + '='.repeat(80));
  console.log('📊 MATCHING RESULTS');
  console.log('='.repeat(80));
  console.log(`Total images processed: ${cleanFiles.length}`);
  console.log(`Successfully matched: ${matches.length}`);
  console.log(`Database records updated: ${updated}`);
  console.log(`Unmatched files: ${unmatched.length}`);
  
  if (unmatched.length > 0) {
    console.log('\n⚠️  Unmatched images:');
    unmatched.forEach(file => console.log(`   - ${file}`));
  }

  console.log('\n✅ Image matching complete!\n');

  // Step 7: Verify homepage communities have images
  console.log('🏠 Checking homepage communities...');
  const { data: homepageCommunities, error: hpError } = await supabase
    .from('Community')
    .select('name, image_url')
    .or('name.ilike.%Assisted Living%,name.ilike.%Memory Care%,name.ilike.%Independent Living%')
    .order('name')
    .limit(20);

  if (!hpError && homepageCommunities) {
    const withImages = homepageCommunities.filter(c => c.image_url).length;
    console.log(`Homepage communities with images: ${withImages}/${homepageCommunities.length}`);
  }

  console.log('\n✨ Done!');
}

main().catch(console.error);

