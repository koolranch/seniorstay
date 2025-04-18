import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Fetch at most 20 communities to keep the response reasonable
    const communities = await prisma.community.findMany({
      take: 20, // Limit to 20 communities
      select: {
        id: true,
        name: true,
        slug: true,
        city: true,
        state: true,
      }
    });
    
    return NextResponse.json({ 
      count: communities.length,
      communities,
    });
  } catch (error) {
    console.error('Error in test-communities API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch communities' },
      { status: 500 }
    );
  }
} 