/**
 * API Route: ETL Health Check
 * Monitor ETL job status, data freshness, and system health
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/etl/supabase-client';

export const dynamic = 'force-dynamic';

interface TableHealth {
  name: string;
  count: number;
  lastUpdated: string | null;
  daysSinceUpdate: number | null;
  status: 'healthy' | 'warning' | 'error';
}

/**
 * GET /api/etl/health-check
 * Returns health status of all ETL data tables
 */
export async function GET(request: NextRequest) {
  try {
    const tables: TableHealth[] = [];

    // Check Community table (CMS Provider Info)
    const { data: communities, error: communitiesError } = await supabaseAdmin
      .from('Community')
      .select('cms_last_updated')
      .not('ccn', 'is', null)
      .order('cms_last_updated', { ascending: false })
      .limit(1);

    if (!communitiesError && communities && communities.length > 0) {
      const lastUpdated = communities[0].cms_last_updated;
      const daysSince = lastUpdated
        ? Math.floor((Date.now() - new Date(lastUpdated).getTime()) / (1000 * 60 * 60 * 24))
        : null;

      const { count } = await supabaseAdmin
        .from('Community')
        .select('*', { count: 'exact', head: true })
        .not('ccn', 'is', null);

      tables.push({
        name: 'CMS Provider Info',
        count: count || 0,
        lastUpdated,
        daysSinceUpdate: daysSince,
        status: daysSince && daysSince > 14 ? 'warning' : 'healthy',
      });
    }

    // Check CommunityStaffing table
    const { data: staffing } = await supabaseAdmin
      .from('CommunityStaffing')
      .select('updated_at')
      .order('updated_at', { ascending: false })
      .limit(1);

    if (staffing && staffing.length > 0) {
      const lastUpdated = staffing[0].updated_at;
      const daysSince = lastUpdated
        ? Math.floor((Date.now() - new Date(lastUpdated).getTime()) / (1000 * 60 * 60 * 24))
        : null;

      const { count } = await supabaseAdmin
        .from('CommunityStaffing')
        .select('*', { count: 'exact', head: true });

      tables.push({
        name: 'PBJ Staffing',
        count: count || 0,
        lastUpdated,
        daysSinceUpdate: daysSince,
        status: daysSince && daysSince > 120 ? 'warning' : 'healthy',
      });
    }

    // Check CommunityQualityMeasures table
    const { data: quality } = await supabaseAdmin
      .from('CommunityQualityMeasures')
      .select('updated_at')
      .order('updated_at', { ascending: false })
      .limit(1);

    if (quality && quality.length > 0) {
      const lastUpdated = quality[0].updated_at;
      const daysSince = lastUpdated
        ? Math.floor((Date.now() - new Date(lastUpdated).getTime()) / (1000 * 60 * 60 * 24))
        : null;

      const { count } = await supabaseAdmin
        .from('CommunityQualityMeasures')
        .select('*', { count: 'exact', head: true });

      tables.push({
        name: 'Quality Measures',
        count: count || 0,
        lastUpdated,
        daysSinceUpdate: daysSince,
        status: daysSince && daysSince > 120 ? 'warning' : 'healthy',
      });
    }

    // Check other tables
    const otherTables = [
      { name: 'CommunityDeficiency', warning: 14 },
      { name: 'CommunityOwnership', warning: 30 },
      { name: 'InspectionReport', warning: 14 },
      { name: 'CommunityCostReport', warning: 365 },
    ];

    for (const table of otherTables) {
      const { data } = await supabaseAdmin
        .from(table.name)
        .select('created_at')
        .order('created_at', { ascending: false })
        .limit(1);

      const { count } = await supabaseAdmin
        .from(table.name)
        .select('*', { count: 'exact', head: true });

      if (data && data.length > 0) {
        const lastUpdated = data[0].created_at;
        const daysSince = lastUpdated
          ? Math.floor((Date.now() - new Date(lastUpdated).getTime()) / (1000 * 60 * 60 * 24))
          : null;

        tables.push({
          name: table.name,
          count: count || 0,
          lastUpdated,
          daysSinceUpdate: daysSince,
          status: daysSince && daysSince > table.warning ? 'warning' : 'healthy',
        });
      } else {
        tables.push({
          name: table.name,
          count: 0,
          lastUpdated: null,
          daysSinceUpdate: null,
          status: 'error',
        });
      }
    }

    // Determine overall status
    const hasErrors = tables.some(t => t.status === 'error');
    const hasWarnings = tables.some(t => t.status === 'warning');
    const overallStatus = hasErrors ? 'error' : hasWarnings ? 'warning' : 'healthy';

    return NextResponse.json({
      status: overallStatus,
      timestamp: new Date().toISOString(),
      tables,
      summary: {
        total: tables.reduce((sum, t) => sum + t.count, 0),
        healthy: tables.filter(t => t.status === 'healthy').length,
        warnings: tables.filter(t => t.status === 'warning').length,
        errors: tables.filter(t => t.status === 'error').length,
      },
    });
  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: (error as Error).message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

