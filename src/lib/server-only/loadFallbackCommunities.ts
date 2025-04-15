import fs from 'fs'
import path from 'path'
import { InternalCommunity } from '@/lib/types/community'

// Helper to generate slug if missing in fallback
function generateSlug(name: string, city: string, state: string): string {
  return `${name}-${city}-${state}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function loadFallbackCommunities(): InternalCommunity[] {
  const filePath = path.join(process.cwd(), 'src/lib/data/fallback-communities.json')
  try {
    // Check if file exists before attempting to read
    if (!fs.existsSync(filePath)) {
      console.error('Fallback communities file not found:', filePath);
      return [];
    }
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const data = JSON.parse(fileContents)

    if (!Array.isArray(data)) {
      console.error('Fallback communities data is not an array.');
      return [];
    }
    
    // Map and validate the raw data to InternalCommunity
    return data.map((item: any): InternalCommunity | null => {
      const name = item.name || "Unknown Community";
      const city = item.city || "Unknown City";
      const state = item.state || "OH";
      const slug = item.slug || generateSlug(name, city, state);
      const id = item.id ? String(item.id) : `fallback-${slug}-${Math.random().toString(36).substring(2, 5)}`;
      const type = item.type || "Senior Living"; // Default type
      let services: string[] = [];
      if (Array.isArray(item.services)) {
          services = item.services.map((s: any) => String(s).trim()).filter((s: string) => s);
      } else if (typeof item.services === 'string') {
          services = item.services.split(',').map((s: string) => s.trim()).filter((s: string) => s);
      }

      // Basic validation check
      if (!name || !city || !state || !slug || !id) {
         console.warn(`Skipping invalid fallback item: ${JSON.stringify(item)}`);
         return null; 
      }
      
      return {
        id: id,
        name: name,
        slug: slug,
        city: city,
        state: state,
        services: services, // Ensure services is always an array
        type: type,
        imageUrl: item.imageUrl || undefined, // Pass through the imageUrl if it exists
      };
    }).filter((c): c is InternalCommunity => c !== null); // Filter out null values and assert type

  } catch (error) {
      console.error(`Error loading or parsing fallback communities from ${filePath}:`, error);
      return []; // Return empty array on any error
  }
} 