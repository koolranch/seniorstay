/**
 * Senior Events Type Definitions
 * Updated for Lead-Gen Events Hub
 */

export type EventType = 'community_hub' | 'medical_wellness' | 'luxury_showcase';

export interface SeniorEvent {
  id: string;
  title: string;
  slug: string | null; // URL-friendly slug for routing
  description: string | null;
  start_date: string;
  end_date: string | null;
  neighborhood: string | null;
  event_type: EventType;
  location_name: string | null;
  location_url: string | null;
  registration_url: string | null; // Primary URL for event details/registration
  is_virtual: boolean;
  image_url: string | null;
  schema_json: object | null;
  source_url: string | null;
  source_name: string | null;
  region_slug: string | null; // SEO: Region for proper link generation
  created_at: string;
  updated_at: string;
}

export interface EventsResponse {
  events: SeniorEvent[];
  total: number;
  pagination: {
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

// Cleveland neighborhoods for filtering
export const CLEVELAND_NEIGHBORHOODS = [
  'Beachwood',
  'Brecksville',
  'Broadview Heights',
  'Brooklyn',
  'Chagrin Falls',
  'Cleveland',
  'Cleveland Heights',
  'Euclid',
  'Fairview Park',
  'Independence',
  'Lakewood',
  'Lyndhurst',
  'Mayfield Heights',
  'Mentor',
  'North Olmsted',
  'North Royalton',
  'Parma',
  'Rocky River',
  'Shaker Heights',
  'Solon',
  'Strongsville',
  'Westlake',
  'Willoughby',
] as const;

export type ClevelandNeighborhood = typeof CLEVELAND_NEIGHBORHOODS[number];
