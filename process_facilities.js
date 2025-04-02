const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { v4: uuidv4 } = require('uuid');

// Function to generate random coordinates near a given position
function generateNearbyCoordinates(baseLat, baseLng, radiusKm = 0.5) {
  // Earth's radius in kilometers
  const earthRadius = 6371;

  // Convert radius from kilometers to radians
  const radiusInRadian = radiusKm / earthRadius;

  // Generate a random distance within radius
  const distance = Math.random() * radiusInRadian;

  // Generate a random angle
  const angle = Math.random() * 2 * Math.PI;

  // Calculate new position
  const newLat = baseLat + distance * Math.cos(angle);
  const newLng = baseLng + distance * Math.sin(angle);

  return {
    lat: parseFloat(newLat.toFixed(4)),
    lng: parseFloat(newLng.toFixed(4))
  };
}

// Base coordinates for major cities in Northeast Ohio
const cityCoordinates = {
  'Cleveland': { lat: 41.4822, lng: -81.6697 },
  'Akron': { lat: 41.0814, lng: -81.5190 },
  'Parma': { lat: 41.4048, lng: -81.7229 },
  'Lakewood': { lat: 41.4824, lng: -81.7982 },
  'Westlake': { lat: 41.4553, lng: -81.9179 },
  'Beachwood': { lat: 41.4639, lng: -81.5087 },
  'Strongsville': { lat: 41.3139, lng: -81.8365 },
  'Brooklyn': { lat: 41.4303, lng: -81.7468 },
  'Bedford': { lat: 41.3931, lng: -81.5368 },
  'Shaker Heights': { lat: 41.4739, lng: -81.5370 },
  'Garfield Heights': { lat: 41.4178, lng: -81.6060 },
  'Independence': { lat: 41.3976, lng: -81.6386 },
  'Seven Hills': { lat: 41.3978, lng: -81.6756 },
  'Macedonia': { lat: 41.3151, lng: -81.5045 },
  'Berea': { lat: 41.3662, lng: -81.8543 },
  'Rocky River': { lat: 41.4767, lng: -81.8422 },
  'North Royalton': { lat: 41.3139, lng: -81.7248 },
  'Middleburg Heights': { lat: 41.3758, lng: -81.8143 },
  'Northfield': { lat: 41.3395, lng: -81.5285 },
  'Brunswick': { lat: 41.2384, lng: -81.8418 },
  'North Olmsted': { lat: 41.4158, lng: -81.9235 },
  'Avon': { lat: 41.4517, lng: -82.0354 },
  'Cuyahoga Falls': { lat: 41.1334, lng: -81.4845 },
  'Medina': { lat: 41.1434, lng: -81.8632 },
  'Richmond Heights': { lat: 41.5620, lng: -81.5015 },
  'Chagrin Falls': { lat: 41.4300, lng: -81.3912 },
  'Chardon': { lat: 41.5787, lng: -81.2013 },
  'Mentor': { lat: 41.6661, lng: -81.3396 },
  'Solon': { lat: 41.3897, lng: -81.4411 },
  'Stow': { lat: 41.1595, lng: -81.4401 },
  'North Ridgeville': { lat: 41.3892, lng: -82.0190 },
  'Wooster': { lat: 40.8051, lng: -81.9351 },
  'Troy': { lat: 40.0392, lng: -84.2033 },
  'Poland': { lat: 41.0242, lng: -80.6145 },
  'Wickliffe': { lat: 41.6042, lng: -81.4715 }
};

// Extract city name from location string
function extractCity(location) {
  const match = location.match(/.+?,\s*([A-Za-z\s]+),\s*OH/);
  if (match && match[1]) return match[1].trim();

  const simpleCityMatch = location.match(/([A-Za-z\s]+),\s*OH/);
  if (simpleCityMatch && simpleCityMatch[1]) return simpleCityMatch[1].trim();

  return 'Cleveland'; // Default
}

// Main function to process the CSV file
async function processCsvFile() {
  try {
    // Setup file paths
    const csvFilePath = '/home/project/uploads/NE_Ohio_-_Sheet1.csv';
    const outputFilePath = path.join(__dirname, 'src', 'data', 'facilities.new.ts');

    // Check if CSV file exists
    if (!fs.existsSync(csvFilePath)) {
      console.error('CSV file not found:', csvFilePath);
      return;
    }

    // Create a readable stream for the CSV file
    const fileStream = fs.createReadStream(csvFilePath);
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    });

    // Start the output file with the TypeScript declarations
    let outputContent = `// Define the type for facility data
export interface FacilityStaff {
  name: string;
  position: string;
}

export interface FacilityTestimonial {
  quote: string;
  author: string;
}

export interface Facility {
  id: string;
  name: string;
  location: string;
  address?: string; // Full street address
  coordinates?: {
    lat: number;
    lng: number;
  };
  images: string[];
  careTypes: string[];
  description?: string;
  amenities?: string[];
  staff?: {
    administrators: FacilityStaff[];
    caregivers: FacilityStaff[];
  };
  testimonials?: FacilityTestimonial[];
}

// Export facility data
export const facilityData: Facility[] = [
`;

    // Skip the header line and process each facility
    let isFirstLine = true;
    let facilityId = 1;

    // Sample image URLs to rotate through
    const sampleImageUrls = [
      'https://ext.same-assets.com/3140348022/277918512.jpeg',
      'https://ext.same-assets.com/3140348022/554927045.jpeg',
      'https://ext.same-assets.com/3140348022/808373612.jpeg',
      'https://ext.same-assets.com/3140348022/1423073146.jpeg',
      'https://ext.same-assets.com/3140348022/1483408660.jpeg',
      'https://ext.same-assets.com/3140348022/2616406230.jpeg',
      'https://ext.same-assets.com/3140348022/2975331289.jpeg',
      'https://ext.same-assets.com/3140348022/3811120941.jpeg',
      'https://ext.same-assets.com/3140348022/3923490053.jpeg',
      'https://ext.same-assets.com/3140348022/3950841709.jpeg'
    ];

    // Descriptions for different care types
    const descriptions = {
      'Independent Living': 'offers premium independent living for active seniors in a beautiful setting. Our community features spacious apartments, restaurant-style dining, engaging activities, and a wide range of amenities designed to support an active, maintenance-free lifestyle.',
      'Assisted Living': 'provides personalized assisted living services in a comfortable environment. Our dedicated staff delivers 24-hour assistance with daily activities, medication management, and health monitoring while promoting dignity and independence.',
      'Memory Care': 'specializes in memory care services within a secure, supportive environment. Our purpose-built community features specialized programming, trained staff, and innovative therapies designed specifically for those with Alzheimer\'s and other forms of dementia.',
      'Skilled Nursing': 'offers comprehensive skilled nursing care and rehabilitation services. Our professional medical team provides 24-hour nursing care, specialized therapies, and personalized treatment plans to support recovery and ongoing health management.'
    };

    for await (const line of rl) {
      // Skip the header line
      if (isFirstLine) {
        isFirstLine = false;
        continue;
      }

      // Parse the CSV line - handle quoted fields properly
      const parseCSVLine = (line) => {
        const result = [];
        let current = '';
        let inQuotes = false;

        for (let i = 0; i < line.length; i++) {
          const char = line[i];

          if (char === '"' && (i === 0 || line[i-1] !== '\\')) {
            inQuotes = !inQuotes;
          } else if (char === ',' && !inQuotes) {
            result.push(current);
            current = '';
          } else {
            current += char;
          }
        }

        if (current) result.push(current);
        return result;
      };

      const columns = parseCSVLine(line);

      if (columns.length < 3) {
        console.warn('Invalid line:', line);
        continue;
      }

      const communityFullName = columns[0].replace(/"/g, '').trim();
      const addressField = columns[1].replace(/"/g, '').replace(/^Location:\s*/, '').trim();
      const servicesField = columns[2].replace(/"/g, '').replace(/^Services:\s*/, '').trim();

      // Extract facility name and location
      const facilityNameMatch = communityFullName.match(/^"?([^,]+),\s*([^-]+)\s*-\s*(.+)"?$/);
      let facilityName, location, careTypeString;

      if (facilityNameMatch) {
        facilityName = facilityNameMatch[1].trim();
        location = facilityNameMatch[2].trim();
        careTypeString = facilityNameMatch[3].trim();
      } else {
        // Handle cases where the format is different
        const simpleSplit = communityFullName.split(',');
        if (simpleSplit.length >= 2) {
          facilityName = simpleSplit[0].trim();
          location = simpleSplit[1].trim();
          if (location.includes('-')) {
            const locationSplit = location.split('-');
            location = locationSplit[0].trim();
            careTypeString = locationSplit[1].trim();
          } else {
            careTypeString = 'Assisted Living'; // Default
          }
        } else {
          facilityName = communityFullName;
          location = 'Ohio';
          careTypeString = 'Assisted Living'; // Default
        }
      }

      // Ensure location ends with OH
      if (!location.endsWith('OH')) {
        location = `${location}, OH`;
      }

      // Parse care types
      const careTypes = servicesField.split(',').map(type => type.trim());

      // Extract city name from location
      const cityName = extractCity(location);

      // Get base coordinates for the city or use Cleveland as default
      let baseCoords = cityCoordinates[cityName] || cityCoordinates['Cleveland'];

      // Generate nearby coordinates
      const coords = generateNearbyCoordinates(baseCoords.lat, baseCoords.lng);

      // Choose two random image URLs
      const imageUrl1 = sampleImageUrls[Math.floor(Math.random() * sampleImageUrls.length)];
      const imageUrl2 = sampleImageUrls[Math.floor(Math.random() * sampleImageUrls.length)];

      // Create a description based on care types
      let description = '';
      if (careTypes.includes('Independent Living') && careTypes.includes('Assisted Living') && careTypes.includes('Memory Care')) {
        description = `${facilityName} offers a full continuum of care with independent living, assisted living, and memory care options. Our beautiful community features spacious apartments, chef-prepared dining, engaging activities, and personalized care services tailored to each resident's unique needs and preferences.`;
      } else if (careTypes.includes('Assisted Living') && careTypes.includes('Memory Care')) {
        description = `${facilityName} provides compassionate assisted living and specialized memory care services in a supportive environment. Our dedicated care team offers 24-hour assistance, medication management, and innovative memory care programming to enhance quality of life for all residents.`;
      } else if (careTypes.includes('Independent Living') && careTypes.includes('Assisted Living')) {
        description = `${facilityName} offers both independent and assisted living options in a vibrant community setting. Residents enjoy spacious apartments, restaurant-style dining, engaging activities, and access to personalized care services as their needs evolve.`;
      } else if (careTypes.includes('Memory Care')) {
        description = `${facilityName} ${descriptions['Memory Care']}`;
      } else if (careTypes.includes('Assisted Living')) {
        description = `${facilityName} ${descriptions['Assisted Living']}`;
      } else if (careTypes.includes('Independent Living')) {
        description = `${facilityName} ${descriptions['Independent Living']}`;
      } else if (careTypes.includes('Skilled Nursing')) {
        description = `${facilityName} ${descriptions['Skilled Nursing']}`;
      } else {
        description = `${facilityName} provides quality senior living services in a comfortable, supportive environment. Our community offers personalized care plans, engaging activities, and a range of amenities to enhance quality of life for all residents.`;
      }

      // Format the facility entry
      const facilityEntry = `  {
    id: "facility-${facilityId}",
    name: "${facilityName}",
    location: "${location}",
    address: "${addressField}",
    coordinates: {
      lat: ${coords.lat},
      lng: ${coords.lng}
    },
    images: [
      "${imageUrl1}",
      "${imageUrl2}",
    ],
    careTypes: [${careTypes.map(type => `"${type}"`).join(', ')}],
    description: "${description}"
  }${facilityId < 69 ? ',' : ''}\n`;

      // Add to the output
      outputContent += facilityEntry;
      facilityId++;
    }

    // Close the array and the file
    outputContent += '];';

    // Write to the output file
    fs.writeFileSync(outputFilePath, outputContent);

    console.log(`Successfully processed ${facilityId - 1} facilities to ${outputFilePath}`);
  } catch (error) {
    console.error('Error processing file:', error);
  }
}

// Run the main function
processCsvFile();
