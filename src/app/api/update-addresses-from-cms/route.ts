/**
 * Update nursing home addresses from CMS Provider Info API
 * GET /api/update-addresses-from-cms
 * 
 * Fetches addresses for all nursing homes (with CCN) from CMS API
 */

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const maxDuration = 300;

interface CMSProvider {
  federal_provider_number: string;
  provider_name: string;
  provider_address: string;
  provider_city: string;
  provider_state: string;
  provider_zip_code: string;
}

async function fetchCMSProviderInfo(ccns: string[]): Promise<Map<string, CMSProvider>> {
  const providers = new Map<string, CMSProvider>();
  
  // CMS API has limit of 100 per request, so batch
  const batchSize = 100;
  
  for (let i = 0; i < ccns.length; i += batchSize) {
    const batch = ccns.slice(i, i + batchSize);
    const ccnFilter = batch.map(ccn => `'${ccn}'`).join(',');
    
    const url = `https://data.cms.gov/provider-data/api/1/datastore/query/mj5m-pzi6/0` +
      `?conditions[0][property]=federal_provider_number&conditions[0][value][0]=${ccnFilter.replace(/'/g, '')}&conditions[0][operator]=IN` +
      `&limit=${batchSize}`;
    
    try {
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.results) {
        for (const provider of data.results) {
          providers.set(provider.federal_provider_number, provider);
        }
      }
      
      // Rate limit
      await new Promise(resolve => setTimeout(resolve, 200));
    } catch (error) {
      console.error(`Error fetching CMS batch:`, error);
    }
  }
  
  return providers;
}

export async function GET() {
  try {
    console.log('📍 Updating addresses from CMS API...');

    // Get all nursing homes (with CCN)
    const { data: communities, error } = await supabase
      .from('Community')
      .select('id, name, ccn, address, city, state')
      .not('ccn', 'is', null);

    if (error || !communities) {
      return NextResponse.json({ error: 'Failed to fetch communities' }, { status: 500 });
    }

    console.log(`Found ${communities.length} nursing homes with CCN`);

    // Get addresses from CMS
    const ccns = communities.map(c => c.ccn!);
    const cmsProviders = await fetchCMSProviderInfo(ccns);

    console.log(`Found ${cmsProviders.size} providers in CMS API`);

    // Update addresses
    let updated = 0;
    let failed = 0;
    let alreadyHad = 0;

    for (const community of communities) {
      if (community.address && community.address.trim()) {
        alreadyHad++;
        continue; // Skip if already has address
      }

      const cmsProvider = cmsProviders.get(community.ccn!);
      
      if (cmsProvider && cmsProvider.provider_address) {
        const { error: updateError } = await supabase
          .from('Community')
          .update({
            address: cmsProvider.provider_address,
            zip: cmsProvider.provider_zip_code
          })
          .eq('id', community.id);

        if (updateError) {
          console.error(`Failed to update ${community.name}:`, updateError);
          failed++;
        } else {
          console.log(`✓ Updated ${community.name}: ${cmsProvider.provider_address}`);
          updated++;
        }
      } else {
        failed++;
      }
    }

    return NextResponse.json({
      success: true,
      total: communities.length,
      updated,
      alreadyHad,
      failed,
      message: `Updated ${updated} nursing home addresses from CMS API. ${alreadyHad} already had addresses.`
    });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

