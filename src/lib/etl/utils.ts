/**
 * ETL Utility Functions
 * Helper functions for data transformation and validation
 */

import { ETLError, ETLResult } from './types';
import { RATE_LIMIT } from './config';

/**
 * Convert CMS star rating to number (handles string "1" or number 1)
 */
export function parseStarRating(value: string | number | undefined | null): number | undefined {
  if (value === null || value === undefined || value === '') return undefined;
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num) || num < 1 || num > 5) return undefined;
  return Math.round(num * 10) / 10; // Round to 1 decimal place
}

/**
 * Convert CMS boolean flags (Y/N or true/false)
 */
export function parseCMSBoolean(value: string | boolean | undefined | null): boolean {
  if (value === null || value === undefined || value === '') return false;
  if (typeof value === 'boolean') return value;
  const str = String(value).toUpperCase().trim();
  return str === 'Y' || str === 'YES' || str === 'TRUE' || str === '1';
}

/**
 * Parse CMS date (format: YYYY-MM-DD or MM/DD/YYYY)
 */
export function parseCMSDate(value: string | undefined | null): string | undefined {
  if (!value) return undefined;
  
  try {
    // Handle ISO format (YYYY-MM-DD)
    if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
      return value.split('T')[0]; // Remove time component if present
    }
    
    // Handle US format (MM/DD/YYYY)
    if (/^\d{1,2}\/\d{1,2}\/\d{4}/.test(value)) {
      const [month, day, year] = value.split('/');
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
    
    // Try to parse as Date
    const date = new Date(value);
    if (!isNaN(date.getTime())) {
      return date.toISOString().split('T')[0];
    }
  } catch (error) {
    console.warn(`Failed to parse date: ${value}`, error);
  }
  
  return undefined;
}

/**
 * Clean phone number (remove formatting)
 */
export function cleanPhoneNumber(value: string | undefined | null): string | undefined {
  if (!value) return undefined;
  const cleaned = value.replace(/\D/g, '');
  return cleaned.length >= 10 ? cleaned : undefined;
}

/**
 * Normalize facility name (remove extra whitespace, standardize case)
 */
export function normalizeFacilityName(name: string): string {
  return name
    .trim()
    .replace(/\s+/g, ' ')
    .split(' ')
    .map(word => {
      // Keep acronyms uppercase
      if (word.toUpperCase() === word && word.length <= 4) return word;
      // Title case for normal words
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
}

/**
 * Generate Care Compare URL from CCN
 */
export function generateCareCompareUrl(ccn: string): string {
  return `https://www.medicare.gov/care-compare/details/nursing-home/${ccn}`;
}

/**
 * Create an ETL result object
 */
export function createETLResult(
  startTime: Date,
  processed: number,
  inserted: number,
  updated: number,
  skipped: number,
  errors: ETLError[]
): ETLResult {
  const endTime = new Date();
  return {
    success: errors.length === 0 || (processed > 0 && inserted + updated > 0),
    recordsProcessed: processed,
    recordsInserted: inserted,
    recordsUpdated: updated,
    recordsSkipped: skipped,
    errors,
    startTime,
    endTime,
    duration: endTime.getTime() - startTime.getTime(),
  };
}

/**
 * Log ETL result summary
 */
export function logETLResult(jobName: string, result: ETLResult): void {
  console.log(`\n=== ETL Job: ${jobName} ===`);
  console.log(`Status: ${result.success ? '✓ SUCCESS' : '✗ FAILED'}`);
  console.log(`Duration: ${(result.duration / 1000).toFixed(2)}s`);
  console.log(`Processed: ${result.recordsProcessed}`);
  console.log(`Inserted: ${result.recordsInserted}`);
  console.log(`Updated: ${result.recordsUpdated}`);
  console.log(`Skipped: ${result.recordsSkipped}`);
  console.log(`Errors: ${result.errors.length}`);
  
  if (result.errors.length > 0) {
    console.log('\nErrors:');
    result.errors.slice(0, 10).forEach((error, i) => {
      console.log(`  ${i + 1}. ${error.message}`);
      if (error.field) console.log(`     Field: ${error.field}`);
    });
    if (result.errors.length > 10) {
      console.log(`  ... and ${result.errors.length - 10} more errors`);
    }
  }
  console.log('=========================\n');
}

/**
 * Sleep for rate limiting
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Fetch with retry logic
 */
export async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  retries = RATE_LIMIT.RETRY_ATTEMPTS
): Promise<Response> {
  let lastError: Error | undefined;
  
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      
      if (response.ok) {
        return response;
      }
      
      // Handle rate limiting
      if (response.status === 429) {
        const retryAfter = response.headers.get('Retry-After');
        const delay = retryAfter ? parseInt(retryAfter) * 1000 : RATE_LIMIT.RETRY_DELAY_MS * (i + 1);
        console.warn(`Rate limited. Retrying after ${delay}ms...`);
        await sleep(delay);
        continue;
      }
      
      // Handle server errors with retry
      if (response.status >= 500) {
        console.warn(`Server error ${response.status}. Attempt ${i + 1}/${retries}`);
        await sleep(RATE_LIMIT.RETRY_DELAY_MS * (i + 1));
        continue;
      }
      
      // Client errors don't retry
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    } catch (error) {
      lastError = error as Error;
      if (i < retries - 1) {
        console.warn(`Fetch failed. Attempt ${i + 1}/${retries}. Retrying...`);
        await sleep(RATE_LIMIT.RETRY_DELAY_MS * (i + 1));
      }
    }
  }
  
  throw lastError || new Error('Fetch failed after retries');
}

/**
 * Chunk array into smaller batches
 */
export function chunkArray<T>(array: T[], chunkSize: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
}

