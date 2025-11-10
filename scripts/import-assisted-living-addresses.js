/**
 * Import addresses for assisted living communities from CSV
 * Run: node scripts/import-assisted-living-addresses.js
 */

const fs = require('fs');
const https = require('https');
const path = require('path');

// Load environment
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=');
  if (key && valueParts.length) {
    env[key.trim()] = valueParts.join('=').replace(/"/g, '').trim();
  }
});

const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;

// Read CSV
const csvPath = path.join(__dirname, '..', '..', 'uploads', 'NE_Ohio_-_Sheet1.csv');
const csvContent = fs.readFileSync(csvPath, 'utf8');
const lines = csvContent.split('\n').slice(1); // Skip header

console.log('📊 Importing Assisted Living Addresses');
console.log('='.repeat(60));
console.log(`Found ${lines.length} lines in CSV\\n`);

function parseCSVLine(line) {
  if (!line.trim()) return null;
  
  // Extract name (first quoted field)
  const nameMatch = line.match(/^"([^"]+)"/);
  if (!nameMatch) return null;
  
  const fullName = nameMatch[1];
  const cleanName = fullName.split(',')[0].trim(); // Just the facility name
  
  // Extract address (second quoted field or after first comma)
  const afterName = line.substring(nameMatch[0].length);
  const addressMatch = afterName.match(/"([^"]+)"/);
  if (!addressMatch) return null;
  
  let address = addressMatch[1];
  
  // Clean up address
  address = address.replace(/^Location:\s*/i, '').trim();
  address = address.replace(/\(main campus\)/i, '').trim();
  
  // Extract ZIP
  const zipMatch = address.match(/\b(\d{5})\b/);
  const zip = zipMatch ? zipMatch[1] : null;
  
  return {
    name: cleanName,
    address,
    zip
  };
}

function httpsRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(`${SUPABASE_URL}${path}`);
    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method,
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      }
    };
    
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ status: res.statusCode, data });
      });
    });
    
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function main() {
  const parsed = [];
  
  for (const line of lines) {
    const data = parseCSVLine(line);
    if (data) parsed.push(data);
  }
  
  console.log(`✅ Parsed ${parsed.length} communities\\n`);
  
  let updated = 0;
  let notFound = 0;
  let alreadyHad = 0;
  
  for (const community of parsed) {
    try {
      // Find matching community
      const searchName = encodeURIComponent(community.name);
      const { status, data } = await httpsRequest(
        'GET',
        `/rest/v1/Community?select=id,name,address&ccn=is.null&name=ilike.*${searchName}*&limit=1`
      );
      
      if (status === 200 && data) {
        const matches = JSON.parse(data || '[]');
        
        if (matches.length > 0) {
          const match = matches[0];
          
          if (match.address && match.address.trim()) {
            console.log(`  - ${community.name}: Already has address`);
            alreadyHad++;
          } else {
            // Update address
            const result = await httpsRequest(
              'PATCH',
              `/rest/v1/Community?id=eq.${match.id}`,
              { address: community.address, zip: community.zip }
            );
            
            if (result.status === 204 || result.status === 200) {
              console.log(`  ✓ ${community.name}`);
              console.log(`    ${community.address}`);
              updated++;
            } else {
              console.log(`  ✗ ${community.name}: Update failed (${result.status})`);
              notFound++;
            }
          }
        } else {
          console.log(`  ✗ ${community.name}: Not found in database`);
          notFound++;
        }
      }
      
      // Rate limit
      await new Promise(r => setTimeout(r, 100));
      
    } catch (error) {
      console.log(`  ✗ ${community.name}: Error - ${error.message}`);
      notFound++;
    }
  }
  
  console.log('\\n' + '='.repeat(60));
  console.log('📊 Summary:');
  console.log('='.repeat(60));
  console.log(`Parsed: ${parsed.length}`);
  console.log(`✅ Updated: ${updated}`);
  console.log(`Already had address: ${alreadyHad}`);
  console.log(`❌ Not found/failed: ${notFound}`);
  
  if (updated > 0) {
    console.log('\\n🎉 Addresses imported! Now run:');
    console.log('   Visit: https://seniorstay.vercel.app/api/fetch-assisted-living-photos');
    console.log('   Or wait, I will do it automatically...\\n');
    
    // Auto-fetch photos
    setTimeout(() => {
      console.log('📸 Fetching photos from Google Places...\\n');
      https.get('https://seniorstay.vercel.app/api/fetch-assisted-living-photos', (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const json = JSON.parse(data);
            console.log('\\n📊 Photo Fetch Results:');
            console.log('='.repeat(60));
            console.log(`✅ Got Real Photos: ${json.successful}`);
            console.log(`❌ No Photos: ${json.failed}`);
            console.log(`📸 Total Photos: ${json.totalPhotos}`);
            console.log(`💰 Cost: ${json.estimatedCost}`);
            
            if (json.successful > 0) {
              console.log('\\n🎉 SUCCESS! Your assisted living communities have real photos!');
              console.log('👉 Visit: https://seniorstay.vercel.app');
            }
          } catch (e) {
            console.log('Error:', e.message);
          }
        });
      });
    }, 5000);
  }
}

main().catch(console.error);

