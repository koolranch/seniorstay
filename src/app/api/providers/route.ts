import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { Community } from '@/types/community'; // Assuming this type definition exists and is correct

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
  const providerIds = idsParam.split(',').map(id => id.trim()).filter(id => id); // Filter out empty strings
  
  console.log("API: Requested provider IDs:", providerIds);

  if (providerIds.length === 0) {
    console.log("API: No valid IDs provided");
    return NextResponse.json({ communities: [], count: 0 }); // Return empty if no valid IDs provided
  }

  try {
    // Log detailed info about each ID for debugging
    console.log("API: ID debug information:");
    providerIds.forEach((id, index) => {
      console.log(`ID ${index + 1}: "${id}" (type: ${typeof id}, length: ${id.length})`);
    });
    
    // Fetch communities from the database based on the provided IDs
    console.log("API: Attempting database query with IDs:", providerIds);
    const communities: Community[] = await prisma.community.findMany({
      where: {
        id: {
          in: providerIds,
        },
      },
       // Select specific fields if needed to optimize, otherwise fetches all
      // select: { ... } 
    });
    
    console.log(`API: Query returned ${communities.length} communities`);
    // Log the first community ID and name if available (for debugging)
    if (communities.length > 0) {
      console.log("API: First community:", { id: communities[0].id, name: communities[0].name });
    } else {
      // Log more details about why no communities were found
      console.log("API: No communities found. Trying to determine why...");
      
      // Check if IDs exist in the database (one by one for detailed debugging)
      for (const id of providerIds) {
        const community = await prisma.community.findUnique({
          where: { id },
          select: { id: true, name: true }
        });
        
        console.log(`API: Checking ID "${id}" directly: ${community ? 'Found' : 'Not found'}`);
      }
    }

    return NextResponse.json({
      communities,
      count: communities.length,
    });
  } catch (error) {
    console.error('Error fetching providers by IDs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch providers' },
      { status: 500 }
    );
  }
} 