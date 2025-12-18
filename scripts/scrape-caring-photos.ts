/**
 * Scrape Caring.com Photos (Fallback)
 * 
 * For communities that don't have website photos, this script searches
 * Caring.com and scrapes their photo galleries as a fallback source.
 * 
 * Usage: npx tsx scripts/scrape-caring-photos.ts
 */

import { createClient } from '@supabase/supabase-js';

// Supabase client setup
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables:');
  console.error('- NEXT_PUBLIC_SUPABASE_URL');
  console.error('- SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface Community {
  id: string;
  name: string;
  city: string;
  state: string;
  image_urls: string[];
}

/**
 * Clean community name for search
 * Remove location suffixes and extra info
 */
function cleanCommunityName(name: string): string {
  return name
    .replace(/,.*$/, '') // Remove everything after comma
    .replace(/\s+-\s+.*$/, '') // Remove service types after dash
    .trim();
}

/**
 * Build Caring.com search URL
 */
function buildCaringSearchUrl(communityName: string, city: string, state: string): string {
  const cleanName = cleanCommunityName(communityName);
  const searchTerm = encodeURIComponent(`${cleanName} ${city} ${state}`);
  return `https://www.caring.com/search?q=${searchTerm}`;
}

/**
 * Search Caring.com and scrape photos
 * Note: This would use Firecrawl MCP in production
 */
async function scrapeCaringPhotos(community: Community): Promise<string[]> {
  const searchUrl = buildCaringSearchUrl(community.name, community.city, community.state);
  console.log(`🔍 Searching Caring.com: ${searchUrl}`);
  
  // In production, this would:
  // 1. Use firecrawl_search to find the community listing
  // 2. Extract the community detail page URL
  // 3. Use firecrawl_scrape on the detail page to get photos
  // 4. Filter and return image URLs
  //
  // Example:
  // const searchResults = await firecrawl_search({
  //   query: `${cleanCommunityName(community.name)} ${community.city} Ohio site:caring.com`,
  //   limit: 3
  // });
  //
  // if (searchResults.length > 0) {
  //   const detailUrl = searchResults[0].url;
  //   const pageData = await firecrawl_scrape({
  //     url: detailUrl,
  //     formats: ['links']
  //   });
  //   return extractPhotosFromLinks(pageData.links);
  // }
  
  // For now, return empty array
  return [];
}

/**
 * Update community photos in Supabase
 */
async function updateCommunityPhotos(
  communityId: string,
  imageUrls: string[]
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('Community')
      .update({
        image_urls: imageUrls,
        photos_source: 'caring.com',
        photos_last_updated: new Date().toISOString(),
        // Update primary image if not set
        ...(imageUrls.length > 0 && { image_url: imageUrls[0] })
      })
      .eq('id', communityId);
    
    if (error) {
      console.error(`❌ Error updating ${communityId}:`, error.message);
      return false;
    }
    
    console.log(`✅ Updated ${imageUrls.length} photos from Caring.com`);
    return true;
  } catch (error) {
    console.error(`❌ Exception updating ${communityId}:`, error);
    return false;
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 Starting Caring.com photo scraping (fallback for communities without photos)...\n');
  
  // Fetch assisted living/memory care communities with no photos or very few
  const { data: communities, error } = await supabase
    .from('Community')
    .select('id, name, city, state, image_urls')
    .or('state.eq.Ohio,state.eq.OH')
    .or('services.ilike.%Assisted Living%,services.ilike.%Memory Care%')
    .order('city', { ascending: true });
  
  if (error) {
    console.error('❌ Error fetching communities:', error);
    process.exit(1);
  }
  
  if (!communities || communities.length === 0) {
    console.log('ℹ️  No communities found');
    return;
  }
  
  // Filter to communities with no photos or less than 2 photos
  const needsPhotos = communities.filter(c => 
    !c.image_urls || c.image_urls.length < 2
  );
  
  console.log(`📊 Total Ohio AL/MC communities: ${communities.length}`);
  console.log(`📊 Communities needing photos: ${needsPhotos.length}\n`);
  
  if (needsPhotos.length === 0) {
    console.log('✅ All communities have sufficient photos!');
    return;
  }
  
  let scraped = 0;
  let failed = 0;
  let notFound = 0;
  
  for (let i = 0; i < needsPhotos.length; i++) {
    const community = needsPhotos[i];
    console.log(`\n[${i + 1}/${needsPhotos.length}] Processing: ${community.name}`);
    console.log(`   Location: ${community.city}, ${community.state}`);
    console.log(`   Current photos: ${community.image_urls?.length || 0}`);
    
    try {
      // Search Caring.com and scrape photos
      const photos = await scrapeCaringPhotos(community);
      
      if (photos.length > 0) {
        const success = await updateCommunityPhotos(community.id, photos);
        if (success) {
          scraped++;
          console.log(`   ✅ Scraped ${photos.length} photos from Caring.com`);
        } else {
          failed++;
        }
      } else {
        notFound++;
        console.log(`   ⚠️  No photos found on Caring.com`);
      }
    } catch (error) {
      failed++;
      console.error(`   ❌ Error:`, error);
    }
    
    // Rate limiting - wait 3 seconds between requests
    if (i < needsPhotos.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 Caring.com Photo Scraping Summary:');
  console.log('='.repeat(60));
  console.log(`Total communities checked: ${needsPhotos.length}`);
  console.log(`Successfully scraped: ${scraped}`);
  console.log(`Not found on Caring.com: ${notFound}`);
  console.log(`Failed: ${failed}`);
  console.log('='.repeat(60));
  
  // Final status check
  const { data: finalCheck } = await supabase
    .from('Community')
    .select('id, name, city, image_urls')
    .or('state.eq.Ohio,state.eq.OH')
    .or('services.ilike.%Assisted Living%,services.ilike.%Memory Care%');
  
  if (finalCheck) {
    const withPhotos = finalCheck.filter(c => c.image_urls && c.image_urls.length > 0).length;
    const withGalleries = finalCheck.filter(c => c.image_urls && c.image_urls.length >= 3).length;
    
    console.log('\n📊 Final Photo Coverage:');
    console.log(`   Communities with at least 1 photo: ${withPhotos}/${finalCheck.length} (${Math.round(withPhotos/finalCheck.length*100)}%)`);
    console.log(`   Communities with galleries (3+ photos): ${withGalleries}/${finalCheck.length} (${Math.round(withGalleries/finalCheck.length*100)}%)`);
  }
}

// Run the script
main().catch(error => {
  console.error('💥 Fatal error:', error);
  process.exit(1);
});

