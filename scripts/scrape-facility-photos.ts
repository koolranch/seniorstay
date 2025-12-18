/**
 * Scrape Facility Photos Script
 * 
 * Uses Firecrawl to scrape photo galleries from facility websites for
 * assisted living and memory care communities in Ohio.
 * 
 * Usage: npx tsx scripts/scrape-facility-photos.ts
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
  website: string;
  image_url: string | null;
  image_urls: string[];
}

interface ImageInfo {
  url: string;
  width?: number;
  height?: number;
}

/**
 * Filter and validate images
 * - Remove logos, icons, small images
 * - Prefer large images (400px+)
 * - Remove duplicates
 */
function filterImages(images: ImageInfo[], minWidth: number = 400, maxImages: number = 15): string[] {
  const filtered = images
    .filter(img => {
      // Filter out common logo/icon patterns
      const url = img.url.toLowerCase();
      if (url.includes('logo') || url.includes('icon') || url.includes('sprite')) {
        return false;
      }
      
      // Filter by size if dimensions available
      if (img.width && img.width < minWidth) {
        return false;
      }
      
      return true;
    })
    .map(img => img.url);
  
  // Remove duplicates
  const unique = Array.from(new Set(filtered));
  
  // Limit to max images
  return unique.slice(0, maxImages);
}

/**
 * Scrape photos from facility website
 * Note: This would use Firecrawl MCP in production
 */
async function scrapeWebsitePhotos(community: Community): Promise<string[]> {
  console.log(`🔍 Scraping: ${community.website}`);
  
  // In production, this would call:
  // const result = await firecrawl_scrape({
  //   url: community.website,
  //   formats: ['links', 'screenshot'],
  //   maxAge: 172800000 // 48 hours cache
  // });
  //
  // Then extract images from the links data
  // const images = extractImagesFromLinks(result.links);
  // return filterImages(images);
  
  // For now, return empty array
  // Actual implementation will use Firecrawl MCP tools
  return [];
}

/**
 * Update community photos in Supabase
 */
async function updateCommunityPhotos(
  communityId: string,
  imageUrls: string[],
  source: string = 'facility_website'
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('Community')
      .update({
        image_urls: imageUrls,
        photos_source: source,
        photos_last_updated: new Date().toISOString(),
        // Update primary image if not set
        ...(imageUrls.length > 0 && { image_url: imageUrls[0] })
      })
      .eq('id', communityId);
    
    if (error) {
      console.error(`❌ Error updating ${communityId}:`, error.message);
      return false;
    }
    
    console.log(`✅ Updated ${imageUrls.length} photos for community ${communityId}`);
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
  console.log('🚀 Starting photo scraping for Assisted Living/Memory Care communities...\n');
  
  // Fetch communities with websites but few/no photos
  const { data: communities, error } = await supabase
    .from('Community')
    .select('id, name, city, state, website, image_url, image_urls')
    .or('state.eq.Ohio,state.eq.OH')
    .or('services.ilike.%Assisted Living%,services.ilike.%Memory Care%')
    .not('website', 'is', null)
    .order('city', { ascending: true });
  
  if (error) {
    console.error('❌ Error fetching communities:', error);
    process.exit(1);
  }
  
  if (!communities || communities.length === 0) {
    console.log('ℹ️  No communities with websites found to scrape');
    return;
  }
  
  // Filter to communities that need photos (less than 3 images)
  const needsPhotos = communities.filter(c => 
    !c.image_urls || c.image_urls.length < 3
  );
  
  console.log(`📊 Found ${communities.length} communities with websites`);
  console.log(`📊 ${needsPhotos.length} need photo enrichment (< 3 photos)\n`);
  
  let scraped = 0;
  let failed = 0;
  let skipped = 0;
  
  for (let i = 0; i < needsPhotos.length; i++) {
    const community = needsPhotos[i];
    console.log(`\n[${i + 1}/${needsPhotos.length}] Processing: ${community.name}`);
    console.log(`   Location: ${community.city}, ${community.state}`);
    console.log(`   Website: ${community.website}`);
    console.log(`   Current photos: ${community.image_urls?.length || 0}`);
    
    try {
      // Scrape photos from website
      const photos = await scrapeWebsitePhotos(community);
      
      if (photos.length > 0) {
        const success = await updateCommunityPhotos(community.id, photos, 'facility_website');
        if (success) {
          scraped++;
          console.log(`   ✅ Scraped ${photos.length} photos`);
        } else {
          failed++;
        }
      } else {
        skipped++;
        console.log(`   ⚠️  No suitable photos found on website`);
      }
    } catch (error) {
      failed++;
      console.error(`   ❌ Error scraping website:`, error);
    }
    
    // Rate limiting - wait 2 seconds between requests
    if (i < needsPhotos.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 Photo Scraping Summary:');
  console.log('='.repeat(60));
  console.log(`Total communities checked: ${needsPhotos.length}`);
  console.log(`Successfully scraped: ${scraped}`);
  console.log(`Failed: ${failed}`);
  console.log(`Skipped (no photos found): ${skipped}`);
  console.log('='.repeat(60));
  
  // List communities that still need photos
  if (skipped > 0) {
    console.log('\n📄 Communities still needing photos (try Caring.com fallback):');
    const { data: stillNeedPhotos } = await supabase
      .from('Community')
      .select('name, city, website')
      .or('state.eq.Ohio,state.eq.OH')
      .or('services.ilike.%Assisted Living%,services.ilike.%Memory Care%')
      .or('image_urls.is.null,image_urls.eq.{}');
    
    if (stillNeedPhotos) {
      stillNeedPhotos.slice(0, 10).forEach(c => {
        console.log(`   - ${c.name}, ${c.city}`);
      });
      
      if (stillNeedPhotos.length > 10) {
        console.log(`   ... and ${stillNeedPhotos.length - 10} more`);
      }
    }
  }
}

// Run the script
main().catch(error => {
  console.error('💥 Fatal error:', error);
  process.exit(1);
});

