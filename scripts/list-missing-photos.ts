
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

function loadEnv() {
  const envPath = path.resolve(__dirname, '../.env.local');
  if (fs.existsSync(envPath)) {
    const envFile = fs.readFileSync(envPath, 'utf8');
    envFile.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) {
        process.env[key.trim()] = valueParts.join('=').trim().replace(/^"(.*)"$/, '$1');
      }
    });
  }
}

// Hardcode Supabase configuration to ensure it works
const supabaseUrl = 'https://hncgnxbooghjhpncujzx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhuY2dueGJvb2doamhwbmN1anp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyMTI0ODIsImV4cCI6MjA1OTc4ODQ4Mn0.mdAL87W0h4PN7Xu8ESjjDxzjW_H3YH55i-FqAE5SXcs';

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const PLACEHOLDER_IMAGES = [
  "https://images.unsplash.com/photo-1519974719765-e6559eac2575?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1582407947304-fd86f028f716?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1564731071754-8f8cd0ba8f30?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1538108149393-fbbd81895907?q=80&w=800&auto=format&fit=crop",
];

async function listMissingPhotos() {
  const { data: allCommunities, error } = await supabase
    .from('Community')
    .select('id, name, city, website, image_url, image_urls, services')
    .or('state.eq.Ohio,state.eq.OH');

  if (error) {
    console.error('Error fetching communities:', error);
    return;
  }

  const clevelandCities = ['Cleveland', 'Shaker Heights', 'Beachwood', 'Parma', 'Lakewood', 'Strongsville', 'Westlake', 'North Olmsted', 'Richmond Heights', 'Seven Hills', 'Rocky River', 'Independence', 'Beachwood', 'Macedonia', 'Northfield', 'Strongsville'];

  const missing = allCommunities?.filter(c => {
    const services = c.services?.toLowerCase() || '';
    const isAlOrMc = services.includes('assisted living') || services.includes('memory care');
    const isInClevelandArea = clevelandCities.some(city => c.city.toLowerCase().includes(city.toLowerCase()));
    
    // For now, let's say "missing" means it has no gallery (image_urls is empty)
    // and we want to enrich it with more photos.
    // OR if it has no image_url at all.
    const needsEnrichment = !c.image_urls || c.image_urls.length === 0;
    
    return isAlOrMc && isInClevelandArea && needsEnrichment;
  });

  console.log(JSON.stringify(missing, null, 2));
}

listMissingPhotos();

