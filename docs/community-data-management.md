# Community Data Management

This document explains how community data is managed in the SeniorStay application, common issues, and how to use the validation and synchronization tools.

## Overview

The application manages community data in two places:

1. **Static Data Array**: Located in `src/lib/data/communities.ts`, this provides static community data used on the homepage and other listings.

2. **Database Records**: Accessed via Prisma, this is the source of truth for community detail pages.

## Common Issues

The most common issue with community data is **inconsistency between the static array and the database**, which can cause:

- Community cards on the homepage that link to nonexistent community pages
- 404 errors when clicking on community links
- Blank screens or error messages when city/slug values don't match

## Validation Tool

The application includes a validation tool to help identify inconsistencies between the static data and database records.

### How to Use:

1. Make an API request to `/api/debug/validate-communities` (GET request)
2. Review the response for:
   - `missingInDatabase`: Communities that exist in the static array but not in the database
   - `slugMismatches`: Communities where the slug doesn't match between static and DB
   - `cityMismatches`: Communities where the city doesn't match between static and DB

Example response:

```json
{
  "success": true,
  "totalCommunities": 50,
  "validatedSuccessfully": 45,
  "missingInDatabase": 2,
  "slugMismatches": 3,
  "cityMismatches": 0,
  "details": {
    // Full details of each issue...
  }
}
```

## Synchronization Tool

The application includes a tool to synchronize the static data with the database, ensuring consistent slugs and data.

### How to Use:

1. Make an API request to `/api/admin/sync-communities` (POST request)
2. The tool will:
   - Create records for communities that exist in the static array but not in the database
   - Update existing records to ensure slug and city values match
   - Return a summary of the sync process

Example response:

```json
{
  "success": true,
  "totalProcessed": 50,
  "created": 2,
  "updated": 48,
  "failed": 0,
  "errorCount": 0,
  "errors": []
}
```

## Best Practices

1. **After updating static data**: Always run the synchronization tool to ensure database consistency
2. **Before deploying**: Run the validation tool to check for potential issues
3. **When adding new communities**: Add them to both the static array and run the sync tool
4. **If community detail pages show errors**: Run the validation tool to identify data inconsistencies

## Error Handling

The application now includes improved error handling for community pages:

1. **Component Guards**: The `ProviderCard` component includes checks for undefined city/slug values
2. **Error Boundary**: The community detail page includes a custom error boundary with recovery options
3. **Logging**: Console logs provide detailed information about missing or inconsistent data 