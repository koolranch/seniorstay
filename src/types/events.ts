/**
 * Senior Events Type Definitions
 */

export type EventType = 'expert_webinar' | 'community_event';

export interface SeniorEvent {
  id: string;
  title: string;
  description: string | null;
  start_date: string;
  end_date: string | null;
  neighborhood: string | null;
  event_type: EventType;
  location_name: string | null;
  location_url: string | null;
  is_virtual: boolean;
  image_url: string | null;
  schema_json: object | null;
  source_url: string | null;
  source_name: string | null;
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
