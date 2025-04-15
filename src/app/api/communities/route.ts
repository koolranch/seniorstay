import { NextResponse } from 'next/server';
import { loadFallbackCommunities } from '@/lib/server-only/loadFallbackCommunities';

export async function GET() {
  try {
    const communities = loadFallbackCommunities();
    
    return NextResponse.json({ 
      communities,
      count: communities.length
    });
  } catch (error) {
    console.error('Error in communities API:', error);
    return NextResponse.json(
      { error: 'Failed to load communities' },
      { status: 500 }
    );
  }
} 