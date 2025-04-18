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

  if (providerIds.length === 0) {
    return NextResponse.json({ communities: [], count: 0 }); // Return empty if no valid IDs provided
  }

  try {
    // Fetch communities from the database based on the provided IDs
    const communities: Community[] = await prisma.community.findMany({
      where: {
        id: {
          in: providerIds,
        },
      },
       // Select specific fields if needed to optimize, otherwise fetches all
      // select: { ... } 
    });

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