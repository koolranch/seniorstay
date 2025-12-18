/**
 * Photo Enrichment Status API
 * 
 * Returns statistics about photo coverage across communities
 * Useful for monitoring data enrichment progress
 * 
 * GET /api/photo-enrichment-status
 */

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export async function GET() {
  try {
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: 'Supabase configuration missing' },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch all Ohio assisted living/memory care communities
    const { data: communities, error } = await supabase
      .from('Community')
      .select('id, name, city, state, services, image_url, image_urls, photos_source, photos_last_updated')
      .or('state.eq.Ohio,state.eq.OH')
      .or('services.ilike.%Assisted Living%,services.ilike.%Memory Care%')
      .order('city', { ascending: true });

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch communities', details: error.message },
        { status: 500 }
      );
    }

    if (!communities || communities.length === 0) {
      return NextResponse.json({
        total: 0,
        withPhotos: 0,
        withGalleries: 0,
        message: 'No communities found'
      });
    }

    // Calculate statistics
    const total = communities.length;
    const withPhotos = communities.filter(c => 
      (c.image_urls && c.image_urls.length > 0) || c.image_url
    ).length;
    const withGalleries = communities.filter(c => 
      c.image_urls && c.image_urls.length >= 3
    ).length;
    const withOnePhoto = communities.filter(c =>
      (c.image_urls && c.image_urls.length === 1) || 
      (!c.image_urls && c.image_url)
    ).length;
    const noPhotos = total - withPhotos;

    // Group by city
    const byCity: Record<string, {
      total: number;
      withPhotos: number;
      withGalleries: number;
      communities: Array<{ name: string; photoCount: number }>;
    }> = {};

    communities.forEach(c => {
      if (!byCity[c.city]) {
        byCity[c.city] = {
          total: 0,
          withPhotos: 0,
          withGalleries: 0,
          communities: []
        };
      }

      byCity[c.city].total++;
      const photoCount = c.image_urls?.length || (c.image_url ? 1 : 0);
      
      if (photoCount > 0) {
        byCity[c.city].withPhotos++;
      }
      if (photoCount >= 3) {
        byCity[c.city].withGalleries++;
      }

      byCity[c.city].communities.push({
        name: c.name,
        photoCount
      });
    });

    // Photo sources breakdown
    const sources: Record<string, number> = {};
    communities.forEach(c => {
      const source = c.photos_source || 'none';
      sources[source] = (sources[source] || 0) + 1;
    });

    // Communities needing attention
    const needsPhotos = communities
      .filter(c => !c.image_urls || c.image_urls.length < 2)
      .map(c => ({
        id: c.id,
        name: c.name,
        city: c.city,
        photoCount: c.image_urls?.length || (c.image_url ? 1 : 0),
        source: c.photos_source
      }))
      .slice(0, 20); // Limit to 20 for API response size

    // Recently updated
    const recentlyUpdated = communities
      .filter(c => c.photos_last_updated)
      .sort((a, b) => {
        const dateA = new Date(a.photos_last_updated || 0).getTime();
        const dateB = new Date(b.photos_last_updated || 0).getTime();
        return dateB - dateA;
      })
      .slice(0, 10)
      .map(c => ({
        name: c.name,
        city: c.city,
        photoCount: c.image_urls?.length || 0,
        source: c.photos_source,
        lastUpdated: c.photos_last_updated
      }));

    return NextResponse.json({
      summary: {
        total,
        withPhotos,
        withGalleries,
        withOnePhoto,
        noPhotos,
        coverage: {
          anyPhoto: Math.round((withPhotos / total) * 100),
          galleries: Math.round((withGalleries / total) * 100)
        }
      },
      byCity,
      sources,
      needsPhotos,
      recentlyUpdated,
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in photo-enrichment-status API:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

