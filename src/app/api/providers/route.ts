import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { Community } from '@/types/community';
import { communities as staticCommunities } from '@/lib/data/staticCommunities'; // Import static communities

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const idsParam = searchParams.get('ids');

  if (!idsParam) {
    return NextResponse.json(
      { error: 'Provider IDs are required' },
      { status: 400 }
    );
  }

  // Split the comma-separated string into an array of IDs
  const providerIds = idsParam.split(',').map(id => id.trim()).filter(id => id);
  
  console.log("API: Requested provider IDs:", providerIds);

  if (providerIds.length === 0) {
    console.log("API: No valid IDs provided");
    return NextResponse.json({ communities: [], count: 0 });
  }

  try {
    // Log detailed info about each ID for debugging
    console.log("API: ID debug information:");
    providerIds.forEach((id, index) => {
      console.log(`ID ${index + 1}: "${id}" (type: ${typeof id}, length: ${id.length})`);
    });
    
    // Step 1: Separate IDs into potential static IDs and database IDs based on format
    // Static IDs are likely numeric or simple strings, database IDs are likely UUIDs
    const potentialStaticIds = providerIds.filter(id => /^\d+$/.test(id) || id.length < 10);
    const databaseIds = providerIds.filter(id => !/^\d+$/.test(id) || id.length >= 10);
    
    console.log("API: Potential static IDs:", potentialStaticIds);
    console.log("API: Database IDs:", databaseIds);
    
    // Step 2: Get communities from static data
    const staticResults = staticCommunities.filter(community => 
      potentialStaticIds.includes(community.id)
    );
    
    console.log(`API: Found ${staticResults.length} communities from static data`);
    
    // Step 3: Get communities from database
    let dbResults: Community[] = [];
    if (databaseIds.length > 0) {
      console.log("API: Attempting database query with IDs:", databaseIds);
      dbResults = await prisma.community.findMany({
        where: {
          id: {
            in: databaseIds,
          },
        },
      });
      console.log(`API: Database query returned ${dbResults.length} communities`);
    }
    
    // Step 4: Search remaining IDs (static IDs not found in static communities)
    const foundStaticIds = staticResults.map(c => c.id);
    const remainingIds = potentialStaticIds.filter(id => !foundStaticIds.includes(id));
    
    if (remainingIds.length > 0) {
      console.log("API: Checking remaining IDs in database:", remainingIds);
      const remainingResults = await prisma.community.findMany({
        where: {
          id: {
            in: remainingIds,
          },
        },
      });
      console.log(`API: Found ${remainingResults.length} additional communities in database`);
      dbResults = [...dbResults, ...remainingResults];
    }
    
    // Step 5: Combine results
    const allCommunities = [...staticResults, ...dbResults];
    
    if (allCommunities.length > 0) {
      console.log("API: First community:", { 
        id: allCommunities[0].id, 
        name: allCommunities[0].name,
        source: staticResults.some(c => c.id === allCommunities[0].id) ? 'static' : 'database' 
      });
    } else {
      console.log("API: No communities found from either source");
      
      // Individual ID checking for debugging
      for (const id of providerIds) {
        // Check in static data
        const staticCommunity = staticCommunities.find(c => c.id === id);
        if (staticCommunity) {
          console.log(`API: ID "${id}" found in static communities as: ${staticCommunity.name}`);
          continue;
        }
        
        // Check in database
        try {
          const dbCommunity = await prisma.community.findUnique({
            where: { id },
            select: { id: true, name: true }
          });
          
          console.log(`API: Checking ID "${id}" in database: ${dbCommunity ? 'Found as: ' + dbCommunity.name : 'Not found'}`);
        } catch (error) {
          console.log(`API: Error checking ID "${id}" in database:`, error);
        }
      }
    }

    return NextResponse.json({
      communities: allCommunities,
      count: allCommunities.length,
    });
  } catch (error) {
    console.error('Error fetching providers by IDs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch providers' },
      { status: 500 }
    );
  }
} 