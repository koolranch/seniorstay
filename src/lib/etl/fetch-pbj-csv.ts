/**
 * PBJ CSV Fetcher
 * Automated discovery, download, and parsing of PBJ Daily Nurse Staffing CSVs
 */

import { parse } from 'csv-parse';

// Cleveland county names for filtering
const CLEVELAND_COUNTIES_NAMES = [
  'CUYAHOGA',
  'LAKE',
  'LORAIN',
  'GEAUGA',
  'MEDINA',
  'SUMMIT'
];

export interface PBJDailyRecord {
  provnum: string; // CCN
  work_date: string;
  mdscensus: number; // Resident census
  hrs_rndir: number; // RN hours (direct care)
  hrs_rnoth: number; // RN hours (other)
  hrs_lpndir: number; // LPN hours (direct care)
  hrs_lpnoth: number; // LPN hours (other)
  hrs_cnadir: number; // CNA hours (direct care)
  hrs_cnaoth: number; // CNA hours (other)
  is_weekend?: boolean; // Weekend flag
}

/**
 * Check if a county is in Cleveland area
 */
function isClevelandCounty(countyName: string): boolean {
  if (!countyName) return false;
  return CLEVELAND_COUNTIES_NAMES.includes(countyName.toUpperCase().trim());
}

/**
 * Check if a date is a weekend
 */
function isWeekend(dateString: string): boolean {
  const date = new Date(dateString);
  const day = date.getDay();
  return day === 0 || day === 6; // Sunday or Saturday
}

/**
 * Discover latest PBJ quarter CSV URLs from CMS data catalog
 */
export async function discoverLatestPBJQuarters(): Promise<string[]> {
  try {
    console.log('Discovering latest PBJ quarters from CMS catalog...');
    
    const response = await fetch('https://data.cms.gov/data.json');
    const catalog = await response.json();
    
    if (!catalog.dataset || !Array.isArray(catalog.dataset)) {
      console.error('Invalid catalog format');
      return [];
    }

    // Find PBJ Daily Nurse Staffing datasets
    const pbjDatasets = catalog.dataset.filter((d: any) => {
      const title = d.title || '';
      return title.includes('PBJ') && 
             title.includes('Daily Nurse Staffing') &&
             !title.includes('Employee'); // Exclude employee-level data
    });

    console.log(`Found ${pbjDatasets.length} PBJ datasets in catalog`);

    // Sort by modified date (newest first) and get latest 2 quarters
    const sorted = pbjDatasets
      .sort((a: any, b: any) => {
        const dateA = a.modified || a.issued || '';
        const dateB = b.modified || b.issued || '';
        return dateB.localeCompare(dateA);
      })
      .slice(0, 2);

    // Extract CSV download URLs
    const csvUrls: string[] = [];
    
    for (const dataset of sorted) {
      if (!dataset.distribution || !Array.isArray(dataset.distribution)) continue;
      
      const csvDist = dataset.distribution.find((dist: any) => 
        dist.mediaType === 'text/csv' || 
        dist.format === 'CSV' ||
        dist.downloadURL?.toLowerCase().endsWith('.csv')
      );
      
      if (csvDist && csvDist.downloadURL) {
        csvUrls.push(csvDist.downloadURL);
        console.log(`Found CSV: ${dataset.title} - ${csvDist.downloadURL.substring(0, 100)}...`);
      }
    }

    console.log(`Discovered ${csvUrls.length} PBJ quarter CSV URLs`);
    return csvUrls;
  } catch (error) {
    console.error('Error discovering PBJ quarters:', error);
    throw error;
  }
}

/**
 * Download and parse PBJ CSV with streaming for memory efficiency
 */
export async function downloadAndParsePBJCSV(url: string): Promise<PBJDailyRecord[]> {
  console.log(`Downloading PBJ CSV from: ${url.substring(0, 100)}...`);
  
  const records: PBJDailyRecord[] = [];
  let processedRows = 0;
  let filteredRows = 0;

  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    if (!response.body) {
      throw new Error('Response body is null');
    }

    const parser = parse({
      columns: true, // Use first row as column names
      skip_empty_lines: true,
      trim: true,
      relax_column_count: true, // Handle inconsistent column counts
    });

    // Process records as they're parsed
    parser.on('readable', function() {
      let record;
      while ((record = parser.read()) !== null) {
        processedRows++;

        // Log progress every 10000 rows
        if (processedRows % 10000 === 0) {
          console.log(`Processed ${processedRows} rows, filtered ${filteredRows} Cleveland records...`);
        }

        // Filter: Only Ohio, only Cleveland counties
        if (record.STATE !== 'OH') continue;
        if (!isClevelandCounty(record.COUNTY_NAME)) continue;

        // Transform to our format
        const pbjRecord: PBJDailyRecord = {
          provnum: record.PROVNUM,
          work_date: record.WorkDate,
          mdscensus: parseFloat(record.MDScensus) || 0,
          hrs_rndir: parseFloat(record.Hrs_RNDIR) || 0,
          hrs_rnoth: parseFloat(record.Hrs_RNOTH) || 0,
          hrs_lpndir: parseFloat(record.Hrs_LPNDIR) || 0,
          hrs_lpnoth: parseFloat(record.Hrs_LPNOTH) || 0,
          hrs_cnadir: parseFloat(record.Hrs_CNADIR) || 0,
          hrs_cnaoth: parseFloat(record.Hrs_CNAOTH) || 0,
          is_weekend: isWeekend(record.WorkDate),
        };

        records.push(pbjRecord);
        filteredRows++;
      }
    });

    // Read response body and pipe to parser
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    
    let buffer = '';
    let done = false;
    
    while (!done) {
      const { value, done: streamDone } = await reader.read();
      done = streamDone;
      
      if (value) {
        buffer += decoder.decode(value, { stream: !done });
        
        // Process complete lines
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // Keep incomplete line in buffer
        
        for (const line of lines) {
          if (line.trim()) {
            parser.write(line + '\n');
          }
        }
      }
    }
    
    // Process remaining buffer
    if (buffer.trim()) {
      parser.write(buffer + '\n');
    }
    
    parser.end();

    // Wait for parser to finish
    await new Promise((resolve, reject) => {
      parser.on('end', resolve);
      parser.on('error', reject);
    });

    console.log(`Completed parsing: ${processedRows} total rows, ${records.length} Cleveland records`);
    return records;
  } catch (error) {
    console.error('Error downloading/parsing PBJ CSV:', error);
    throw error;
  }
}

/**
 * Fetch latest 2 quarters of PBJ data (automated)
 */
export async function fetchLatestPBJData(): Promise<PBJDailyRecord[]> {
  try {
    // Discover latest quarter URLs
    const quarterUrls = await discoverLatestPBJQuarters();

    if (quarterUrls.length === 0) {
      console.warn('No PBJ quarter URLs discovered');
      return [];
    }

    console.log(`Will download and parse ${quarterUrls.length} quarters`);

    // Download and parse each quarter
    const allRecords: PBJDailyRecord[] = [];
    
    for (let i = 0; i < quarterUrls.length; i++) {
      const url = quarterUrls[i];
      console.log(`\nProcessing quarter ${i + 1}/${quarterUrls.length}...`);
      
      const records = await downloadAndParsePBJCSV(url);
      allRecords.push(...records);
      
      console.log(`Quarter ${i + 1} complete: ${records.length} Cleveland records`);
    }

    console.log(`\nTotal PBJ records fetched: ${allRecords.length}`);
    return allRecords;
  } catch (error) {
    console.error('Error fetching PBJ data:', error);
    throw error;
  }
}

