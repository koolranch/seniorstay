/**
 * Import addresses for assisted living communities from CSV
 * GET /api/import-assisted-living-addresses
 */

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Parse the CSV data
const csvData = `Westwood Place, Cleveland, OH - Assisted Living,1375 W 25th St\\, Cleveland\\, OH 44113
Summit Point, Macedonia, OH - Assisted Living,9633 Valley View Rd\\, Macedonia\\, OH 44056
Mount Alverna Village, Parma, OH - Assisted Living, Memory Care,6765 State Rd\\, Parma\\, OH 44134
Rose Senior Living at Beachwood, Beachwood, OH - Independent Living, Assisted Living,23611 Harvard Rd\\, Beachwood\\, OH 44122
Vitalia Rockside, Seven Hills, OH - Independent Living, Assisted Living, Memory Care,6101 Lombardo Center\\, Seven Hills\\, OH 44131
StoryPoint Shaker Heights, Shaker Heights, OH - Independent Living, Assisted Living, Memory Care,16300 Chagrin Blvd\\, Shaker Heights\\, OH 44120
The Woodlands by Heritage Retirement Communities, Shaker Heights, OH - Independent Living,16333 Chagrin Blvd\\, Shaker Heights\\, OH 44120
Forest Hills Place, Cleveland, OH - Assisted Living,3151 Mayfield Rd\\, Cleveland Heights\\, OH 44118
Woodside Senior Living, Bedford, OH - Assisted Living,19455 Rockside Rd\\, Bedford\\, OH 44146
Eliza Jennings, Cleveland, OH - Independent Living, Assisted Living,10603 Detroit Ave\\, Cleveland\\, OH 44102
Brooklyn Pointe Assisted Living and Memory Care, Brooklyn, OH - Assisted Living, Memory Care,4800 Idlewood Dr\\, Brooklyn\\, OH 44144
HarborChase of Shaker Heights, Shaker Heights, OH - Assisted Living, Memory Care,17050 Van Aken Blvd\\, Shaker Heights\\, OH 44120
Marymount Place, Garfield Heights, OH - Assisted Living,5100 Marymount Village Dr\\, Garfield Heights\\, OH 44125
Vista Springs Ravinia, Independence, OH - Assisted Living, Memory Care,6046 Brecksville Rd\\, Independence\\, OH 44131
Haven at Lakewood, Lakewood, OH - Assisted Living,1341 Marlowe Ave\\, Lakewood\\, OH 44107
American House Macedonia, Macedonia, OH - Independent Living, Assisted Living,8401 S Bedford Rd\\, Macedonia\\, OH 44056
Arden Courts of Parma, Parma, OH - Memory Care (Assisted Living),9205 W Sprague Rd\\, Parma\\, OH 44133
Berea Alzheimer's Care Center, Berea, OH - Memory Care (Assisted Living),255 Front St\\, Berea\\, OH 44017
Bickford of Rocky River, Rocky River, OH - Assisted Living, Memory Care,21600 Detroit Rd\\, Rocky River\\, OH 44116`;

interface CommunityData {
  name: string;
  address: string;
  city: string;
  state: string;
  zip?: string;
}

function parseCSVLine(line: string): CommunityData | null {
  // Extract name (before first comma with city)
  const nameMatch = line.match(/^([^,]+?),\s*([^,]+?),\s*OH/);
  if (!nameMatch) return null;
  
  const fullName = nameMatch[1].trim();
  const city = nameMatch[2].trim();
  
  // Extract address (everything after the full name pattern)
  const addressMatch = line.match(/,(\d+[^,]+(?:Ave|St|Rd|Blvd|Dr|Ln|Way|Ct|Pl|Cir)[^,]*),/i);
  if (!addressMatch) return null;
  
  const address = addressMatch[1].trim().replace(/\\,/g, ',');
  
  // Extract ZIP
  const zipMatch = address.match(/\b(\d{5})\b/);
  const zip = zipMatch ? zipMatch[1] : undefined;
  
  return {
    name: fullName,
    address,
    city,
    state: 'OH',
    zip
  };
}

export async function GET() {
  try {
    const lines = csvData.split('\\n').filter(l => l.trim());
    const parsed: CommunityData[] = [];
    
    for (const line of lines) {
      const data = parseCSVLine(line);
      if (data) parsed.push(data);
    }
    
    console.log(`Parsed ${parsed.length} communities with addresses`);
    
    // Update database
    let updated = 0;
    let notFound = 0;
    
    for (const community of parsed) {
      // Find matching community by name (fuzzy match)
      const { data: matches } = await supabase
        .from('Community')
        .select('id, name, address')
        .ilike('name', `%${community.name.split(',')[0].trim()}%`)
        .is('ccn', null);  // Only assisted living (no CCN)
        
      if (matches && matches.length > 0) {
        const match = matches[0];
        
        // Update address if missing
        if (!match.address || !match.address.trim()) {
          const { error } = await supabase
            .from('Community')
            .update({
              address: community.address,
              zip: community.zip
            })
            .eq('id', match.id);
            
          if (!error) {
            console.log(`✓ Updated ${community.name}: ${community.address}`);
            updated++;
          }
        } else {
          console.log(`- ${community.name} already has address`);
        }
      } else {
        console.log(`✗ No match found for: ${community.name}`);
        notFound++;
      }
    }
    
    return NextResponse.json({
      success: true,
      parsed: parsed.length,
      updated,
      notFound,
      message: `Updated ${updated} assisted living communities with addresses`
    });
    
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

