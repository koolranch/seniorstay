/**
 * Discover Facility Websites Script
 * 
 * Uses Firecrawl to search for official facility websites for assisted living
 * and memory care communities in Ohio that don't yet have website URLs.
 * 
 * Usage: npx tsx scripts/discover-facility-websites.ts
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
  website: string | null;
  services: string | null;
}

/**
 * Extract domain from URL
 */
function extractDomain(url: string): string {
  try {
    const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
    return urlObj.hostname.replace('www.', '');
  } catch {
    return url;
  }
}

/**
 * Search for facility website using Firecrawl MCP
 */
async function searchForWebsite(community: Community): Promise<string | null> {
  const cleanName = community.name.replace(/,.*$/, '').replace(/\s+-\s+.*$/, '').trim();
  const searchQuery = `${cleanName} ${community.city} Ohio assisted living official website`;
  
  console.log(`🔍 Searching for: ${searchQuery}`);
  
  try {
    // Note: This function will be called from a Cursor environment with Firecrawl MCP
    // The actual MCP call will be made by the AI assistant
    // For now, this is a placeholder that will be executed via MCP
    return null;
  } catch (error) {
    console.error('Search error:', error);
    return null;
  }
}

/**
 * Update community website in Supabase
 */
async function updateCommunityWebsite(communityId: string, website: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('Community')
      .update({ website })
      .eq('id', communityId);
    
    if (error) {
      console.error(`❌ Error updating ${communityId}:`, error.message);
      return false;
    }
    
    console.log(`✅ Updated website for community ${communityId}`);
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
  console.log('🚀 Starting website discovery for Assisted Living/Memory Care communities...\n');
  
  // Fetch communities without websites that offer assisted living or memory care
  const { data: communities, error } = await supabase
    .from('Community')
    .select('id, name, city, state, website, services')
    .or('state.eq.Ohio,state.eq.OH')
    .or('services.ilike.%Assisted Living%,services.ilike.%Memory Care%')
    .is('website', null)
    .order('city', { ascending: true });
  
  if (error) {
    console.error('❌ Error fetching communities:', error);
    process.exit(1);
  }
  
  if (!communities || communities.length === 0) {
    console.log('✅ All assisted living/memory care communities already have websites!');
    return;
  }
  
  console.log(`📊 Found ${communities.length} communities without websites\n`);
  
  let discovered = 0;
  let failed = 0;
  
  for (let i = 0; i < communities.length; i++) {
    const community = communities[i];
    console.log(`\n[${i + 1}/${communities.length}] Processing: ${community.name}`);
    console.log(`   Location: ${community.city}, ${community.state}`);
    console.log(`   Services: ${community.services}`);
    
    // Search for website
    const website = await searchForWebsite(community);
    
    if (website) {
      const success = await updateCommunityWebsite(community.id, website);
      if (success) {
        discovered++;
        console.log(`   ✅ Website found: ${website}`);
      } else {
        failed++;
      }
    } else {
      console.log(`   ⚠️  No website found - may need manual research`);
    }
    
    // Rate limiting - wait 1 second between requests
    if (i < communities.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 Website Discovery Summary:');
  console.log('='.repeat(60));
  console.log(`Total communities processed: ${communities.length}`);
  console.log(`Websites discovered: ${discovered}`);
  console.log(`Failed updates: ${failed}`);
  console.log(`Needs manual research: ${communities.length - discovered - failed}`);
  console.log('='.repeat(60));
  
  // Export CSV for manual research
  console.log('\n📄 Exporting communities needing manual research...');
  const needsResearch = communities.filter((c, i) => i >= discovered);
  
  if (needsResearch.length > 0) {
    console.log('\nCommunities needing manual website discovery:');
    console.log('name,city,services');
    needsResearch.forEach(c => {
      console.log(`"${c.name}","${c.city}","${c.services}"`);
    });
  }
}

// Run the script
main().catch(error => {
  console.error('💥 Fatal error:', error);
  process.exit(1);
});

