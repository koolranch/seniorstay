/**
 * API Route: Fetch Real Community Photos from Google Places
 * 
 * GET /api/fetch-community-photos
 * 
 * Fetches ALL available photos for each community from Google Places API
 * and updates the imageUrl field with the primary photo.
 * 
 * Protected: Set ADMIN_API_TOKEN in environment to protect this endpoint
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const maxDuration = 300; // 5 minutes for processing all communities

async function fetchGooglePlacesPhotos(
  placeName: string,
  address: string,
  maxPhotos: number = 10
): Promise<string[]> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  
  if (!apiKey) {
    return [];
  }

  try {
    const searchQuery = encodeURIComponent(`${placeName} ${address}`);
    const searchUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?` +
      `input=${searchQuery}&` +
      `inputtype=textquery&` +
      `fields=place_id,photos&` +
      `key=${apiKey}`;

    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();

    if (searchData.status !== 'OK' || !searchData.candidates?.length) {
      return [];
    }

    const place = searchData.candidates[0];
    
    if (!place.photos || place.photos.length === 0) {
      return [];
    }

    const photosToFetch = place.photos.slice(0, maxPhotos);
    const photoUrls = photosToFetch.map((photo: any) => {
      return `https://maps.googleapis.com/maps/api/place/photo?` +
        `maxwidth=1200&` +
        `photoreference=${photo.photo_reference}&` +
        `key=${apiKey}`;
    });

    return photoUrls;
  } catch (error) {
    console.error(`Error fetching photos for ${placeName}:`, error);
    return [];
  }
}

export async function GET(request: NextRequest) {
  try {
    // Optional: Check for admin token
    const authHeader = request.headers.get('authorization');
    const adminToken = process.env.ADMIN_API_TOKEN;
    
    if (adminToken && authHeader !== `Bearer ${adminToken}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('🏥 Starting Google Places image fetch for all communities...');

    // Check API key
    if (!process.env.GOOGLE_PLACES_API_KEY) {
      return NextResponse.json(
        { error: 'Google Places API key not configured in environment' },
        { status: 500 }
      );
    }

    // Fetch all communities
    const { data: communities, error } = await supabase
      .from('Community')
      .select('id, name, address, city, state')
      .order('name');

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch communities', details: error.message },
        { status: 500 }
      );
    }

    if (!communities || communities.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No communities found',
        processed: 0
      });
    }

    const results = {
      processed: communities.length,
      successful: 0,
      failed: 0,
      totalPhotos: 0,
      details: [] as Array<{ 
        name: string; 
        status: string; 
        photoCount: number;
        primaryPhoto?: string;
      }>
    };

    // Process each community
    for (const community of communities) {
      try {
        const fullAddress = community.address 
          ? `${community.address}, ${community.city}, ${community.state}`
          : `${community.city}, ${community.state}`;

        console.log(`Fetching photos for: ${community.name}`);

        // Fetch ALL photos (up to 10)
        const photoUrls = await fetchGooglePlacesPhotos(community.name, fullAddress, 10);

        if (photoUrls.length > 0) {
          // Update with primary photo
          const { error: updateError } = await supabase
            .from('Community')
            .update({ 
              imageUrl: photoUrls[0]
            })
            .eq('id', community.id);

          if (updateError) {
            console.error(`Failed to update ${community.name}:`, updateError);
            results.failed++;
            results.details.push({
              name: community.name,
              status: 'update_failed',
              photoCount: 0
            });
          } else {
            results.successful++;
            results.totalPhotos += photoUrls.length;
            results.details.push({
              name: community.name,
              status: 'success',
              photoCount: photoUrls.length,
              primaryPhoto: photoUrls[0]
            });
            console.log(`✓ Updated ${community.name} with ${photoUrls.length} photo(s)`);
          }
        } else {
          results.failed++;
          results.details.push({
            name: community.name,
            status: 'no_photos_found',
            photoCount: 0
          });
          console.log(`✗ No photos found for ${community.name}`);
        }

        // Rate limiting: 5 requests per second
        await new Promise(resolve => setTimeout(resolve, 200));

      } catch (error) {
        results.failed++;
        results.details.push({
          name: community.name,
          status: 'error',
          photoCount: 0
        });
      }
    }

    const estimatedCost = results.processed * 0.017;

    return NextResponse.json({
      success: true,
      ...results,
      averagePhotos: (results.totalPhotos / Math.max(results.successful, 1)).toFixed(1),
      estimatedCost: `$${estimatedCost.toFixed(2)}`,
      message: `Processed ${results.processed} communities. Successfully updated ${results.successful} with real photos.`
    });

  } catch (error) {
    console.error('Error in fetch-community-photos:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

