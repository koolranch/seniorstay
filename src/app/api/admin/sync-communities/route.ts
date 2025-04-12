import { NextRequest, NextResponse } from 'next/server';
import { syncCommunitiesData } from '@/lib/admin/syncCommunitiesData';

// This should be secured in production with proper authentication/authorization
export async function POST(request: NextRequest) {
  try {
    // In a production environment, you would verify admin access here
    // const session = await getServerSession(authOptions);
    // if (!session?.user?.isAdmin) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    // Trigger the synchronization process
    const result = await syncCommunitiesData();
    
    // Return the results
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error synchronizing community data:', error);
    return NextResponse.json(
      { error: 'Failed to synchronize community data', details: error },
      { status: 500 }
    );
  }
} 