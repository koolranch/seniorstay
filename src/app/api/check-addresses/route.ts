/**
 * Diagnostic: Check which communities have addresses
 * GET /api/check-addresses
 */

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    // Check assisted living (no CCN)
    const { data: assistedLiving, error: alError } = await supabase
      .from('Community')
      .select('id, name, address, city, state, ccn')
      .is('ccn', null);

    // Check nursing homes (with CCN)
    const { data: nursingHomes, error: nhError } = await supabase
      .from('Community')
      .select('id, name, address, city, state, ccn')
      .not('ccn', 'is', null);

    if (alError || nhError) {
      return NextResponse.json({ error: 'Database query failed' }, { status: 500 });
    }

    // Count addresses
    const alWithAddress = assistedLiving?.filter(c => c.address && c.address.trim()) || [];
    const alWithoutAddress = assistedLiving?.filter(c => !c.address || !c.address.trim()) || [];
    
    const nhWithAddress = nursingHomes?.filter(c => c.address && c.address.trim()) || [];
    const nhWithoutAddress = nursingHomes?.filter(c => !c.address || !c.address.trim()) || [];

    return NextResponse.json({
      assistedLiving: {
        total: assistedLiving?.length || 0,
        withAddress: alWithAddress.length,
        withoutAddress: alWithoutAddress.length,
        percentWithAddress: ((alWithAddress.length / (assistedLiving?.length || 1)) * 100).toFixed(1),
        samples: {
          withAddress: alWithAddress.slice(0, 3).map(c => ({ name: c.name, address: c.address })),
          withoutAddress: alWithoutAddress.slice(0, 3).map(c => ({ name: c.name, city: c.city }))
        }
      },
      nursingHomes: {
        total: nursingHomes?.length || 0,
        withAddress: nhWithAddress.length,
        withoutAddress: nhWithoutAddress.length,
        percentWithAddress: ((nhWithAddress.length / (nursingHomes?.length || 1)) * 100).toFixed(1),
        samples: {
          withAddress: nhWithAddress.slice(0, 3).map(c => ({ name: c.name, address: c.address, ccn: c.ccn })),
          withoutAddress: nhWithoutAddress.slice(0, 3).map(c => ({ name: c.name, city: c.city, ccn: c.ccn }))
        }
      },
      summary: {
        totalCommunities: (assistedLiving?.length || 0) + (nursingHomes?.length || 0),
        totalWithAddress: alWithAddress.length + nhWithAddress.length,
        totalWithoutAddress: alWithoutAddress.length + nhWithoutAddress.length
      }
    });
  } catch (error) {
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}

