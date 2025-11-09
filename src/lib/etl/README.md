# ETL Implementation Guide

## Overview

This directory contains ETL (Extract, Transform, Load) implementations for importing CMS nursing home data into Supabase.

## Completed ETL Implementations

### ✅ CMS Provider Info (`cms-provider-info.ts`)
**Status**: Fully implemented and production-ready

**What it does**:
- Fetches nursing home provider information from CMS Provider Data Catalog API
- Filters by Cleveland 6-county area
- Imports: CCN, name, address, bed count, star ratings, quality flags
- Updates Community table with official CMS data

**How to run**:
```bash
# Manual trigger
curl -X POST "https://your-domain.com/api/etl/import-cms-provider-info?secret=YOUR_CRON_SECRET"

# Automated (Vercel Cron)
Runs every Sunday at 2 AM UTC
```

## Scaffold ETL Implementations

These have the data processing logic implemented but require CMS data source integration:

### ⚠️ PBJ Staffing (`cms-pbj-staffing.ts`)
**Status**: Scaffold - requires CSV data download

**What it needs**:
1. Download PBJ Daily Nurse Staffing CSV from https://data.cms.gov/quality-of-care/payroll-based-journal-daily-nurse-staffing
2. Filter to Cleveland facilities (match CCNs from Community table)
3. Parse CSV rows into `PBJDailyRecord` format
4. Add weekend flag based on work_date
5. Pass records to `importPBJStaffing(records)`

**Processing logic**: ✅ Complete
- Computes 90-day rolling averages per facility
- Calculates HPRD (hours per resident day) for RN/LPN/CNA
- Computes weekend vs weekday staffing deltas
- Upserts to CommunityStaffing table

### ⚠️ QRP Quality Measures (`cms-qrp-quality.ts`)
**Status**: Scaffold - requires API endpoint configuration

**What it needs**:
1. Configure CMS QRP API endpoint
2. Fetch quality measures for our facilities
3. Parse response into `QRPMeasureRecord` format
4. Pass records to `importQRPQuality(records)`

**Processing logic**: ✅ Complete
- Maps CMS measure codes to database fields
- Transforms percentages and rates
- Upserts to CommunityQualityMeasures table

## Pending ETL Implementations

### 📋 Deficiencies (`cms-deficiencies.ts`)
**Data source**: CMS Provider Data Catalog - Health Deficiencies
**API**: https://data.cms.gov/provider-data/api/1/datastore/query/r5xi-yzqa/0

**Implementation notes**:
- Parse scope/severity codes (A-L scale)
- Filter by survey date (recent 3 years)
- Link to inspection PDFs
- Group deficiencies by survey_date + CCN

### 📋 Ownership (`cms-ownership.ts`)
**Data source**: CMS Provider Data Catalog - Ownership
**API**: https://data.cms.gov/provider-data/api/1/datastore/query/q5iq-5g6h/0

**Implementation notes**:
- Track operator, owner, chain names
- Handle ownership changes over time (effective_date)
- Normalize names for chain matching

### 📋 Inspection PDFs (`cms-inspection-pdfs.ts`)
**Data source**: Care Compare facility pages + PDF URLs

**Implementation notes**:
- Scrape Care Compare pages for each CCN
- Extract CMS-2567 PDF URLs
- Store by survey_date + survey_type
- Respect rate limits (1 request/second)
- Cache PDF URLs (they're stable once posted)

**PDF URL pattern**: `https://www.medicare.gov/care-compare/profile/nursing-home/{CCN}/inspection-reports`

### 📋 VBP (`cms-vbp.ts`)
**Data source**: SNF Value-Based Purchasing Program
**File**: Annual CSV release from CMS

**Implementation notes**:
- Import once per program year
- Parse payment adjustment percentage (-2% to +2%)
- Link to facility readmission/HAI performance scores
- Many facilities don't participate (too few Medicare patients)

### 📋 Cost Reports (`cms-cost-reports.ts`)
**Data source**: Medicare Cost Reports (HCRIS) - SNF PUF
**File**: Large annual CSV (~500MB)

**Implementation notes**:
- Extract payer mix (Medicare/Medicaid/private days)
- Calculate medicaid_percentage for Community table
- Parse selected worksheets (S-3 for utilization)
- Very complex data structure - use data dictionary
- Consider pre-processing offline to extract relevant fields

## Creating New ETL Implementations

1. **Create ETL file** in `src/lib/etl/cms-{name}.ts`
2. **Import base utilities** from `./utils` and `./config`
3. **Define interfaces** for raw data and transformed data
4. **Implement transform function** to normalize data
5. **Implement upsert function** to update Supabase
6. **Create main import function** that returns `ETLResult`
7. **Add error handling** and logging
8. **Create API route** in `src/app/api/etl/import-{name}/route.ts`
9. **Add to vercel.json** cron schedule
10. **Test manually** before enabling cron

## Common Patterns

### Error Handling
```typescript
try {
  // ... processing
} catch (error) {
  errors.push({
    record: data,
    message: `Error: ${(error as Error).message}`,
    timestamp: new Date(),
  });
}
```

### Batch Processing
```typescript
const batches = chunkArray(records, 50);
for (const batch of batches) {
  // Process batch
}
```

### Upsert Pattern
```typescript
// 1. Find community by CCN
const { data: community } = await supabaseAdmin
  .from('Community')
  .select('id')
  .eq('ccn', ccn)
  .single();

// 2. Check if record exists
const { data: existing } = await supabaseAdmin
  .from('Table')
  .select('id')
  .eq('ccn', ccn)
  .single();

// 3. Update or insert
if (existing) {
  await supabaseAdmin.from('Table').update(data).eq('id', existing.id);
} else {
  await supabaseAdmin.from('Table').insert(data);
}
```

## Testing

```typescript
// Test with sample data
import { importFunction } from './cms-something';

const sampleData = [/* ... */];
const result = await importFunction(sampleData);

console.log(result);
// Check: success, recordsInserted, recordsUpdated, errors
```

## Data Refresh Schedule

| Data Source | Frequency | CMS Update | Our Refresh |
|-------------|-----------|------------|-------------|
| Provider Info | Monthly | ~15th | Weekly (Sun 2am) |
| Deficiencies | Weekly | Real-time | Weekly (Sun 3am) |
| Ownership | Monthly | ~15th | Weekly (Sun 4am) |
| PBJ Staffing | Quarterly | Qtr end +45d | Quarterly |
| QRP | Quarterly | Qtr end +60d | Quarterly |
| VBP | Annual | Oct | Annually |
| Cost Reports | Annual | Various | Annually |

## Monitoring

Check `/api/etl/health-check` to view:
- Last successful import by source
- Data freshness (days since last update)
- Error counts
- Row counts per table

## Support

- CMS Provider Data Catalog: https://data.cms.gov/provider-data/
- CMS Data Dictionary: https://data.cms.gov/provider-data/sites/default/files/data_dictionaries/
- PBJ Data Dictionary: https://data.cms.gov/quality-of-care/pbj-data-dictionary
- HCRIS Documentation: https://www.cms.gov/research-statistics-data-and-systems/downloadable-public-use-files/cost-reports


