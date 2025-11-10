/**
 * Bulk update addresses for assisted living communities
 * This uses a complete mapping of community names to addresses
 * GET /api/bulk-update-addresses
 */

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Complete address mapping from CSV
const ADDRESS_MAP: Record<string, string> = {
  "Westwood Place": "1375 W 25th St, Cleveland, OH 44113",
  "Summit Point": "9633 Valley View Rd, Macedonia, OH 44056",
  "Mount Alverna Village": "6765 State Rd, Parma, OH 44134",
  "Rose Senior Living at Beachwood": "23611 Harvard Rd, Beachwood, OH 44122",
  "Vitalia Rockside": "6101 Lombardo Center, Seven Hills, OH 44131",
  "StoryPoint Shaker Heights": "16300 Chagrin Blvd, Shaker Heights, OH 44120",
  "The Woodlands": "16333 Chagrin Blvd, Shaker Heights, OH 44120",
  "Forest Hills Place": "3151 Mayfield Rd, Cleveland Heights, OH 44118",
  "Woodside Senior Living": "19455 Rockside Rd, Bedford, OH 44146",
  "Eliza Jennings": "10603 Detroit Ave, Cleveland, OH 44102",
  "Brooklyn Pointe": "4800 Idlewood Dr, Brooklyn, OH 44144",
  "HarborChase of Shaker Heights": "17050 Van Aken Blvd, Shaker Heights, OH 44120",
  "Marymount Place": "5100 Marymount Village Dr, Garfield Heights, OH 44125",
  "Vista Springs Ravinia": "6046 Brecksville Rd, Independence, OH 44131",
  "Haven at Lakewood": "1341 Marlowe Ave, Lakewood, OH 44107",
  "American House Macedonia": "8401 S Bedford Rd, Macedonia, OH 44056",
  "Arden Courts of Parma": "9205 W Sprague Rd, Parma, OH 44133",
  "Berea Alzheimer's Care Center": "255 Front St, Berea, OH 44017",
  "Bickford of Rocky River": "21600 Detroit Rd, Rocky River, OH 44116",
  "Cardinal Court": "18719 Drake Rd, Strongsville, OH 44136",
  "Danbury Senior Living Brunswick": "3430 Brunswick Lake Pkwy, Brunswick, OH 44212",
  "Elmcroft of Sagamore Hills": "997 W Aurora Rd, Northfield, OH 44067",
  "Kemper House Strongsville": "10890 Prospect Rd, Strongsville, OH 44149",
  "Paramount Senior Living": "15435 Bagley Rd, Middleburg Heights, OH 44130",
  "Sunrise of Westlake": "27819 Center Ridge Rd, Westlake, OH 44145",
  "The Grande at Middleburg Heights": "7510 Pearl Rd, Middleburg Heights, OH 44130",
  "The Grande at Westlake": "28777 Detroit Rd, Westlake, OH 44145",
  "Sunrise At Parma": "7766 Broadview Rd, Parma, OH 44134",
  "Legacy Place Parma": "7377 Ridge Rd, Parma, OH 44129",
  "SHEVCHENKO MANOR": "2222 Westbrook Dr, Parma, OH 44134",
  "StoryPoint Strongsville": "19205 Pearl Rd, Strongsville, OH 44136",
  "Brookdale Westlake Village": "28460 Westlake Village Dr, Westlake, OH 44145",
  "Brookdale Gardens at Westlake": "27569 Detroit Rd, Westlake, OH 44145",
  "Fairmont of Westlake": "27819 Center Ridge Rd, Westlake, OH 44145",
  "Light of Hearts Villa": "283 Union St, Bedford, OH 44146",
  "Arden Courts of Westlake": "28400 Center Ridge Rd, Westlake, OH 44145",
  "Vitalia North Royalton": "8239 York Rd, North Royalton, OH 44133",
  "Vitalia Active Adult Community North Olmsted": "29801 Lorain Rd, North Olmsted, OH 44070",
  "The Ganzhorn Suites of Avon": "33350 Colorado Ave, Avon, OH 44011",
  "Maplewood at Cuyahoga Falls": "190 W Bath Rd, Cuyahoga Falls, OH 44223",
  "Danbury Woods in Cuyahoga Falls": "1691 Queens Gate Cir, Cuyahoga Falls, OH 44221",
  "StoryPoint Medina": "100 High Point Dr, Medina, OH 44256",
  "Brookdale Richmond Heights": "3 Homewood Way, Richmond Heights, OH 44143",
  "Waterford At Richmond Heights": "261 Richmond Rd, Richmond Heights, OH 44143",
  "South Franklin Circle": "16575 S Franklin St, Chagrin Falls, OH 44023",
  "Maplewood at Chardon": "12350 Bass Lake Rd, Chardon, OH 44024",
  "The Winfield at Richmond Heights": "261 Richmond Rd, Richmond Heights, OH 44143",
  "Saint Augustine Towers": "7821 Lake Ave, Cleveland, OH 44102",
  "Judson Manor": "1890 E 107th St, Cleveland, OH 44106",
  "Rely's Adult Family Home": "7500 Big Creek Pkwy, Parma, OH 44130",
  "Your Second Family": "4667 Tiedeman Rd, Brooklyn, OH 44144",
  "O'Neill Healthcare Lakewood": "13900 Detroit Ave, Lakewood, OH 44107",
  "Danbury Senior Living Cuyahoga Falls": "2645 Sackett Ave, Cuyahoga Falls, OH 44223",
  "Danbury Senior Living Mentor": "9150 Lakeshore Blvd, Mentor, OH 44060",
  "Danbury Senior Living North Ridgeville": "33770 Bagley Rd, North Ridgeville, OH 44039",
  "Danbury Senior Living Wooster": "939 Portage Rd, Wooster, OH 44691",
  "Brookdale Bath": "101 N Cleveland Massillon Rd, Akron, OH 44333",
  "Brookdale Montrose": "4050 Jaclyns Way, Akron, OH 44333",
  "Brookdale Medina South": "100 High Point Dr, Medina, OH 44256",
  "Brookdale Wickliffe": "30630 Ridge Rd, Wickliffe, OH 44092",
  "Vitalia Mentor": "8180 Mentor Hills Dr, Mentor, OH 44060",
  "Vitalia Montrose": "4041 Heritage Center Dr, Akron, OH 44321",
  "Vitalia Solon": "6050 Kruse Dr, Solon, OH 44139",
  "Vitalia Stow": "4291 Allen Rd, Stow, OH 44224",
  "StoryPoint Rockside": "6100 Lombardo Center, Seven Hills, OH 44131",
  "StoryPoint Troy": "1840 Towne Park Dr, Troy, OH 45373",
  "Sunrise of Cuyahoga Falls": "1500 State Rd, Cuyahoga Falls, OH 44223",
  "Sunrise of Rocky River": "21600 Detroit Rd, Rocky River, OH 44116",
  "Sunrise of Shaker Heights": "16333 Chagrin Blvd, Shaker Heights, OH 44120",
  "Sunrise of Poland": "335 W McKinley Way, Poland, OH 44514"
};

export async function GET() {
  try {
    console.log('📍 Bulk Address Update Starting...');
    
    // Get all assisted living communities (no CCN)
    const { data: communities, error } = await supabase
      .from('Community')
      .select('id, name, address')
      .is('ccn', null);

    if (error || !communities) {
      return NextResponse.json({ error: 'Failed to fetch communities' }, { status: 500 });
    }

    let updated = 0;
    let alreadyHad = 0;
    let notFound = 0;
    const updates: any[] = [];

    for (const community of communities) {
      // Skip if already has address
      if (community.address && community.address.trim()) {
        alreadyHad++;
        continue;
      }

      // Find matching address
      let matchedAddress = null;
      for (const [key, address] of Object.entries(ADDRESS_MAP)) {
        if (community.name.toLowerCase().includes(key.toLowerCase())) {
          matchedAddress = address;
          break;
        }
      }

      if (matchedAddress) {
        const { error: updateError } = await supabase
          .from('Community')
          .update({ address: matchedAddress })
          .eq('id', community.id);

        if (!updateError) {
          console.log(`✓ ${community.name}: ${matchedAddress}`);
          updated++;
          updates.push({ name: community.name, address: matchedAddress });
        } else {
          notFound++;
        }
      } else {
        console.log(`✗ No match: ${community.name}`);
        notFound++;
      }
    }

    return NextResponse.json({
      success: true,
      total: communities.length,
      updated,
      alreadyHad,
      notFound,
      message: `Updated ${updated} communities with addresses. ${alreadyHad} already had addresses.`,
      updates: updates.slice(0, 10) // Show first 10
    });

  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

