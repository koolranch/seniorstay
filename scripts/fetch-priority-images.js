#!/usr/bin/env node
/**
 * Fetch images for priority communities using Firecrawl
 * Priority: Beachwood, Westlake, Shaker Heights, Rocky River, Lakewood
 */

const FIRECRAWL_API_KEY = 'fc-5dd2b9d0305e41c48fece3e88c47a911';

const priorityCommunities = [
  { name: 'Rose Senior Living at Beachwood', location: 'Beachwood', search: 'Rose Senior Living Beachwood OH' },
  { name: 'HarborChase of Shaker Heights', location: 'Shaker Heights', search: 'HarborChase Shaker Heights OH' },
  { name: 'Sunrise of Westlake', location: 'Westlake', search: 'Sunrise Senior Living Westlake OH' },
  { name: 'The Grande at Westlake', location: 'Westlake', search: 'The Grande Westlake senior living OH' },
  { name: 'Bickford of Rocky River', location: 'Rocky River', search: 'Bickford Senior Living Rocky River OH' },
  { name: 'StoryPoint Shaker Heights', location: 'Shaker Heights', search: 'StoryPoint Shaker Heights OH' },
  { name: 'The Woodlands by Heritage', location: 'Shaker Heights', search: 'Woodlands Heritage Retirement Shaker Heights OH' },
  { name: 'Haven at Lakewood', location: 'Lakewood', search: 'Haven Lakewood senior living OH' },
  { name: 'Brookdale Westlake Village', location: 'Westlake', search: 'Brookdale Westlake Village OH' },
  { name: 'Fairmont of Westlake', location: 'Westlake', search: 'Fairmont Senior Living Westlake OH' },
  { name: 'Vista Springs Ravinia', location: 'Independence', search: 'Vista Springs Ravinia Independence OH' },
  { name: 'Brooklyn Pointe Assisted Living', location: 'Brooklyn', search: 'Brooklyn Pointe Assisted Living Memory Care OH' },
  { name: 'Eliza Jennings', location: 'Cleveland', search: 'Eliza Jennings Cleveland senior living' },
  { name: 'Mount Alverna Village', location: 'Parma', search: 'Mount Alverna Village Parma OH' },
  { name: 'Vitalia Rockside', location: 'Seven Hills', search: 'Vitalia Rockside Seven Hills OH' },
];

// Known website URLs for these communities
const knownWebsites = {
  'Rose Senior Living at Beachwood': 'https://www.rfrseniorliving.com/communities/rose-senior-living-at-beachwood/',
  'HarborChase of Shaker Heights': 'https://www.harborchase.com/harborchase-of-shaker-heights/',
  'Sunrise of Westlake': 'https://www.sunriseseniorliving.com/communities/sunrise-of-westlake/',
  'The Grande at Westlake': 'https://thegrandeseniorliving.com/westlake/',
  'Bickford of Rocky River': 'https://www.bickfordseniorliving.com/communities/rocky-river-oh/',
  'StoryPoint Shaker Heights': 'https://storypoint.com/communities/shaker-heights/',
  'The Woodlands by Heritage': 'https://www.heritageretirement.com/communities/the-woodlands/',
  'Haven at Lakewood': 'https://www.havenatlakewood.com/',
  'Brookdale Westlake Village': 'https://www.brookdale.com/en/communities/brookdale-westlake-village.html',
  'Fairmont of Westlake': 'https://fairmontseniorliving.com/westlake/',
  'Vista Springs Ravinia': 'https://vistasprings.com/locations/ravinia/',
  'Brooklyn Pointe Assisted Living': 'https://www.brooklynpointe.com/',
  'Eliza Jennings': 'https://www.elizajennings.org/',
  'Mount Alverna Village': 'https://www.mountalvernavillage.com/',
  'Vitalia Rockside': 'https://www.vitaliasenior.com/locations/rockside/',
};

async function scrapeImage(url, communityName) {
  try {
    const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${FIRECRAWL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: url,
        formats: ['markdown'],
        onlyMainContent: false,
      }),
    });

    const data = await response.json();
    
    if (data.success && data.data) {
      // Look for og:image or main images
      const ogImage = data.data.metadata?.ogImage;
      const images = data.data.metadata?.images || [];
      
      // Filter for likely hero/main images
      const heroImage = ogImage || images.find(img => 
        img.includes('hero') || 
        img.includes('banner') || 
        img.includes('exterior') ||
        img.includes('building') ||
        (img.includes('.jpg') || img.includes('.webp') || img.includes('.png'))
      );
      
      return {
        community: communityName,
        url: url,
        ogImage: ogImage,
        heroImage: heroImage,
        allImages: images.slice(0, 5),
        success: true,
      };
    }
    
    return { community: communityName, url: url, success: false, error: data.error };
  } catch (error) {
    return { community: communityName, url: url, success: false, error: error.message };
  }
}

async function main() {
  console.log('🔍 Fetching images for priority communities...\n');
  
  const results = [];
  
  for (const community of priorityCommunities) {
    const website = knownWebsites[community.name];
    if (!website) {
      console.log(`⚠️  No website for: ${community.name}`);
      continue;
    }
    
    console.log(`📸 Scraping: ${community.name}`);
    const result = await scrapeImage(website, community.name);
    results.push(result);
    
    if (result.success && result.heroImage) {
      console.log(`   ✅ Found image: ${result.heroImage.substring(0, 60)}...`);
    } else {
      console.log(`   ❌ No image found`);
    }
    
    // Rate limit
    await new Promise(r => setTimeout(r, 1000));
  }
  
  console.log('\n📊 Results Summary:\n');
  console.log(JSON.stringify(results, null, 2));
  
  // Generate update suggestions
  console.log('\n📝 Update Commands:\n');
  for (const r of results) {
    if (r.success && r.heroImage) {
      console.log(`// ${r.community}`);
      console.log(`images: ["${r.heroImage}"],\n`);
    }
  }
}

main().catch(console.error);
