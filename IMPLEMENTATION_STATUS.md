# CMS Data Integration - Implementation Status

## Overview

This document tracks the implementation status of the Cleveland Nursing Home Finder CMS data integration project.

## Dependencies Required

Before running the ETL jobs, install the Supabase client:

```bash
npm install @supabase/supabase-js
```

## Environment Variables

Add to your `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
CRON_SECRET=your_random_secret_string
```

## Phase 1: Infrastructure & Core CMS Data (Provider Info) ✅ COMPLETE

### Database Schema ✅
- [x] Added CMS fields to Community table (CCN, ratings, flags, bed count, insurance)
- [x] Created indexes for performance (ccn, city/state, overall_rating)

### ETL Implementation ✅
- [x] Created ETL configuration (`src/lib/etl/config.ts`)
- [x] Built Supabase admin client (`src/lib/etl/supabase-client.ts`)
- [x] Created ETL types (`src/lib/etl/types.ts`)
- [x] Built ETL utilities (`src/lib/etl/utils.ts`)
- [x] Implemented CMS Provider Info import (`src/lib/etl/cms-provider-info.ts`)

### API Routes ✅
- [x] Created `/api/etl/import-cms-provider-info` endpoint
- [x] Added cron secret protection
- [x] Configured Vercel cron job (weekly)

### TypeScript Types ✅
- [x] Updated Community interface with CMS fields

### UI Components ✅
- [x] CommunityQualityMetrics - displays star ratings
- [x] CommunityInsurance - shows Medicare/Medicaid acceptance
- [x] Integrated components into community page

## Phase 2: Staffing & Quality Data ✅ IN PROGRESS

### Database Schema ✅
- [x] Created CommunityStaffing table (PBJ 90-day averages)
- [x] Created CommunityQualityMeasures table (SNF QRP)

### ETL Implementation ✅
- [x] PBJ staffing ETL scaffold (`src/lib/etl/cms-pbj-staffing.ts`)
  - Note: Requires PBJ CSV data download and parsing
  - Computes 90-day rolling averages
  - Calculates weekend staffing deltas
- [x] QRP quality ETL scaffold (`src/lib/etl/cms-qrp-quality.ts`)
  - Note: Requires CMS QRP API integration
  - Maps measure codes to database fields

### UI Components (Remaining)
- [ ] CommunityStaffingMetrics - display HPRD with weekend deltas
- [ ] CommunityQualityHighlights - consumer-friendly quality measures

## Phase 3: Inspections, Ownership & Transparency 📋 PENDING

### Database Schema (Remaining)
- [ ] CommunityDeficiency table
- [ ] CommunityOwnership table  
- [ ] InspectionReport table

### ETL Implementation (Remaining)
- [ ] Deficiencies ETL with scope/severity parsing
- [ ] Ownership ETL
- [ ] Inspection PDF scraper/linker

### UI Components (Remaining)
- [ ] CommunityInspectionHistory
- [ ] CommunityOwnership
- [ ] CommunityHelpResources (ODH complaints, Ombudsman)

## Phase 4: Advanced Features 📋 PENDING

### Database Schema (Remaining)
- [ ] Add VBP fields to Community table
- [ ] Create CommunityCostReport table

### ETL Implementation (Remaining)
- [ ] VBP ETL
- [ ] Cost reports ETL

### UI Components (Remaining)
- [ ] CommunityVBPBadge
- [ ] CommunityCostInsights

### Monitoring & Admin (Remaining)
- [ ] ETL health check endpoint
- [ ] Admin dashboard for ETL status

## Utilities (Remaining)
- [ ] CCN matching script for existing 69 communities

## How to Run ETL Jobs

### Manual Trigger (with secret)
```bash
curl -X POST "http://localhost:3000/api/etl/import-cms-provider-info?secret=your_cron_secret"
```

### Scheduled (Vercel Cron)
Runs automatically every Sunday at 2 AM UTC per `vercel.json` configuration.

## Data Sources

### Implemented
- ✅ CMS Provider Data Catalog - Nursing Homes Provider Information

### Scaffolded (Requires Data Integration)
- ⚠️ PBJ Daily Nurse Staffing (requires CSV download)
- ⚠️ SNF QRP Quality Measures (requires API endpoint configuration)

### Pending
- 📋 CMS Health Deficiencies
- 📋 CMS Ownership Data
- 📋 Care Compare Inspection PDFs (CMS-2567)
- 📋 SNF Value-Based Purchasing
- 📋 Medicare Cost Reports (HCRIS)

## Testing Strategy

1. **Phase 1 Testing (Ready Now)**
   - Run Provider Info import manually
   - Verify data appears in Supabase Community table
   - Check community pages for CMS quality metrics display
   - Confirm star ratings and insurance badges render

2. **Phase 2-4 Testing (After Full Implementation)**
   - Import sample data for staffing/quality
   - Verify UI components display correctly
   - Test with facilities that have various data completeness levels

## Known Limitations

1. **Large File Handling**: PBJ and cost report data are massive CSV files (~100MB+). Consider implementing:
   - Chunked file processing
   - Progress tracking
   - Background job queues for production

2. **Inspection PDF Scraping**: CMS-2567 PDFs require web scraping from Care Compare facility pages. Consider:
   - Rate limiting and respectful crawling
   - Caching PDF URLs
   - Handling PDF availability changes

3. **Data Refresh Cadences**: Different sources update on different schedules:
   - Provider Info: Monthly
   - PBJ: Quarterly
   - QRP: Quarterly
   - VBP: Annually
   - Implement smart refresh logic to avoid unnecessary API calls

## Next Steps

1. Complete remaining Phase 2 UI components
2. Implement Phase 3 database schemas
3. Build Phase 3 ETL infrastructure
4. Create Phase 3 UI components
5. Implement Phase 4 schemas and ETL
6. Build monitoring and admin dashboard
7. Create CCN matching utility
8. Full integration testing with real CMS data

## Contact & Support

For questions about CMS data sources:
- CMS Provider Data Catalog: https://data.cms.gov/provider-data/
- CMS Data Dictionary: https://data.cms.gov/provider-data/sites/default/files/data_dictionaries/
- Care Compare: https://www.medicare.gov/care-compare/


