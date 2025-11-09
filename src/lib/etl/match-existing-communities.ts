/**
 * CCN Matching Utility
 * Suggests CCN matches for existing communities in the database
 * based on name and address similarity
 */

import { supabaseAdmin } from './supabase-client';

interface Community {
  id: string;
  name: string;
  address?: string;
  city: string;
  state: string;
  ccn?: string;
}

interface CMSFacility {
  ccn: string;
  name: string;
  address: string;
  city: string;
  state: string;
}

interface MatchSuggestion {
  communityId: string;
  communityName: string;
  communityAddress: string;
  suggestedCCN: string;
  cmsFacilityName: string;
  cmsFacilityAddress: string;
  matchScore: number;
  matchReason: string;
}

/**
 * Calculate Levenshtein distance between two strings
 */
function levenshteinDistance(str1: string, str2: string): number {
  const m = str1.length;
  const n = str2.length;
  const dp: number[][] = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1,
          dp[i][j - 1] + 1,
          dp[i - 1][j - 1] + 1
        );
      }
    }
  }

  return dp[m][n];
}

/**
 * Calculate similarity score (0-1)
 */
function calculateSimilarity(str1: string, str2: string): number {
  const normalized1 = str1.toLowerCase().trim();
  const normalized2 = str2.toLowerCase().trim();

  if (normalized1 === normalized2) return 1.0;

  const distance = levenshteinDistance(normalized1, normalized2);
  const maxLength = Math.max(normalized1.length, normalized2.length);

  return maxLength > 0 ? 1 - distance / maxLength : 0;
}

/**
 * Normalize facility name for comparison
 */
function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/\b(inc|llc|ltd|corp|corporation|the)\b/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Normalize address for comparison
 */
function normalizeAddress(address: string): string {
  return address
    .toLowerCase()
    .replace(/\b(street|st|avenue|ave|road|rd|drive|dr|lane|ln|boulevard|blvd)\b/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Find potential CCN matches for a community
 */
async function findMatches(community: Community): Promise<MatchSuggestion[]> {
  // Fetch CMS facilities in the same city
  const { data: cmsFacilities, error } = await supabaseAdmin
    .from('Community')
    .select('ccn, name, address, city, state')
    .not('ccn', 'is', null)
    .eq('city', community.city)
    .eq('state', community.state);

  if (error || !cmsFacilities) {
    console.error('Error fetching CMS facilities:', error);
    return [];
  }

  const suggestions: MatchSuggestion[] = [];

  for (const cms of cmsFacilities) {
    const normalizedCommunityName = normalizeName(community.name);
    const normalizedCMSName = normalizeName(cms.name);

    const nameSimilarity = calculateSimilarity(normalizedCommunityName, normalizedCMSName);

    // Check address similarity if both have addresses
    let addressSimilarity = 0;
    if (community.address && cms.address) {
      const normalizedCommunityAddress = normalizeAddress(community.address);
      const normalizedCMSAddress = normalizeAddress(cms.address);
      addressSimilarity = calculateSimilarity(normalizedCommunityAddress, normalizedCMSAddress);
    }

    // Calculate overall match score (weighted average)
    const matchScore = community.address
      ? nameSimilarity * 0.6 + addressSimilarity * 0.4
      : nameSimilarity;

    // Only suggest matches with score > 0.6
    if (matchScore > 0.6) {
      let matchReason = `Name similarity: ${(nameSimilarity * 100).toFixed(0)}%`;
      if (addressSimilarity > 0) {
        matchReason += `, Address similarity: ${(addressSimilarity * 100).toFixed(0)}%`;
      }

      suggestions.push({
        communityId: community.id,
        communityName: community.name,
        communityAddress: community.address || '',
        suggestedCCN: cms.ccn!,
        cmsFacilityName: cms.name,
        cmsFacilityAddress: cms.address || '',
        matchScore: Math.round(matchScore * 100) / 100,
        matchReason,
      });
    }
  }

  return suggestions.sort((a, b) => b.matchScore - a.matchScore);
}

/**
 * Main function to suggest CCN matches for all communities without CCNs
 */
export async function suggestCCNMatches(): Promise<MatchSuggestion[]> {
  console.log('Starting CCN matching process...');

  // Fetch all communities without CCNs
  const { data: communities, error } = await supabaseAdmin
    .from('Community')
    .select('id, name, address, city, state, ccn')
    .is('ccn', null);

  if (error) {
    console.error('Error fetching communities:', error);
    return [];
  }

  if (!communities || communities.length === 0) {
    console.log('No communities without CCNs found');
    return [];
  }

  console.log(`Found ${communities.length} communities without CCNs`);

  const allSuggestions: MatchSuggestion[] = [];

  for (const community of communities) {
    const suggestions = await findMatches(community);
    allSuggestions.push(...suggestions);
  }

  console.log(`Generated ${allSuggestions.length} match suggestions`);

  return allSuggestions;
}

/**
 * Export matches to CSV format
 */
export function exportMatchesToCSV(matches: MatchSuggestion[]): string {
  const headers = [
    'Community ID',
    'Community Name',
    'Community Address',
    'Suggested CCN',
    'CMS Facility Name',
    'CMS Facility Address',
    'Match Score',
    'Match Reason',
  ].join(',');

  const rows = matches.map(m =>
    [
      m.communityId,
      `"${m.communityName}"`,
      `"${m.communityAddress}"`,
      m.suggestedCCN,
      `"${m.cmsFacilityName}"`,
      `"${m.cmsFacilityAddress}"`,
      m.matchScore,
      `"${m.matchReason}"`,
    ].join(',')
  );

  return [headers, ...rows].join('\n');
}

// CLI usage
if (require.main === module) {
  suggestCCNMatches()
    .then(matches => {
      if (matches.length > 0) {
        const csv = exportMatchesToCSV(matches);
        console.log('\n=== CCN Match Suggestions (CSV) ===\n');
        console.log(csv);
        console.log(`\n=== ${matches.length} suggestions generated ===`);
      } else {
        console.log('No match suggestions found');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      process.exit(1);
    });
}

