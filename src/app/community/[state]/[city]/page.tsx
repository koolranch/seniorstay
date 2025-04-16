import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import prisma from '@/lib/db';
import { notFound } from 'next/navigation';
import { formatSlug, formatLocation } from '@/lib/utils/formatSlug'; // Assuming you have this for formatting
import { FiMapPin } from 'react-icons/fi';
import type { Community } from '@prisma/client'; // Import the Community type

interface PageParams {
  state: string;
  city: string;
}

interface Props {
  params: PageParams;
}

// Generate Metadata for the City Page
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const state = decodeURIComponent(params.state).toUpperCase();
  const city = formatLocation(decodeURIComponent(params.city)); // Use your formatting function

  try {
    // Optional: Check if any communities exist for this city to make metadata more accurate
    const communityCount = await prisma.community.count({
      where: {
        state: state,
        city: {
          equals: city,
          mode: 'insensitive', // Case-insensitive city comparison
        },
      },
    });

    if (communityCount === 0) {
      // Or return metadata indicating no communities found
       return {
        title: `No Senior Living Communities Found in ${city}, ${state} | SeniorStay`,
        description: `We currently do not have listings for senior living communities in ${city}, ${state}. Check back soon!`,
       }
    }

    const title = `Senior Living Communities in ${city}, ${state} | SeniorStay`;
    const description = `Explore senior living options, including assisted living and independent living, in ${city}, ${state}. Find pricing, reviews, and amenities on SeniorStay.`;

    return {
      title,
      description,
      alternates: {
        canonical: `https://seniorstay.com/community/${params.state}/${params.city}`,
      },
      openGraph: {
         title,
         description,
         url: `https://seniorstay.com/community/${params.state}/${params.city}`,
         siteName: 'SeniorStay',
         type: 'website',
         // Consider adding a generic image for city pages
       },
       twitter: {
         card: 'summary',
         title,
         description,
       },
    };
  } catch (error) {
    console.error(`Metadata Error for City Page (${city}, ${state}):`, error);
    return {
      title: `Senior Living in ${city}, ${state} | SeniorStay`,
      description: `Find senior living communities in ${city}, ${state}.`,
    };
  }
}

// City Page Component
export default async function CityPage({ params }: Props) {
  const stateParam = decodeURIComponent(params.state);
  const cityParam = decodeURIComponent(params.city);

  // Format for display and database query
  const stateDisplay = stateParam.toUpperCase();
  const cityDisplay = formatLocation(cityParam); // Capitalize city name for display
  const cityQuery = cityDisplay; // Use formatted city for query

  let communities: Community[] = []; // Explicitly type the array
  try {
    console.log(`CityPage: Fetching communities for city='${cityQuery}', state='${stateDisplay}'`);
    communities = await prisma.community.findMany({
      where: {
        state: stateDisplay,
        city: {
          equals: cityQuery,
          mode: 'insensitive', // Case-insensitive search
        },
      },
      orderBy: {
        name: 'asc', // Order alphabetically by name
      },
    });
    console.log(`CityPage: Found ${communities.length} communities.`);

  } catch (error) {
    console.error(`CityPage: Error fetching communities for ${cityDisplay}, ${stateDisplay}:`, error);
    // Optionally display an error message to the user
    // For now, we'll proceed as if none were found
  }

  if (communities.length === 0) {
    // Render a message if no communities are found for this city
    return (
      <div className="container mx-auto px-4 py-12 min-h-screen">
        {/* Consider adding Breadcrumbs here */}
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Senior Living in {cityDisplay}, {stateDisplay}
        </h1>
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md" role="alert">
          <p className="font-bold">City Not Found or No Communities Listed</p>
          <p>We couldn't find any senior living communities listed for {cityDisplay}, {stateDisplay} at this time. Please check back later or try a different city.</p>
        </div>
         <div className="mt-8">
             <Link href="/" className="text-blue-600 hover:underline">
               &larr; Back to Home
             </Link>
         </div>
      </div>
    );
  }

  // Render the list of communities
  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
       {/* Consider adding Breadcrumbs here */}
       <h1 className="text-3xl font-bold text-gray-800 mb-8">
         Senior Living Communities in {cityDisplay}, {stateDisplay}
       </h1>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
         {communities.map((community) => (
           <div key={community.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300 flex flex-col">
             <Link href={`/community/${stateParam}/${cityParam}/${community.slug}`} className="block">
               <div className="relative h-48 w-full">
                 <Image
                   src={community.imageUrl || '/placeholder-image.jpg'} // Add a placeholder
                   alt={`Exterior of ${community.name}`}
                   fill
                   sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                   className="object-cover"
                   // Consider adding onError for image fallbacks
                 />
               </div>
             </Link>
             <div className="p-4 flex flex-col flex-grow">
               <Link href={`/community/${stateParam}/${cityParam}/${community.slug}`} className="block">
                 <h2 className="text-xl font-semibold text-gray-800 hover:text-blue-600 mb-2 truncate" title={community.name || ""}>
                   {community.name || 'Community Name Missing'}
                 </h2>
               </Link>
               <div className="flex items-center text-gray-600 text-sm mb-4 flex-grow">
                 <FiMapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                 <span className="truncate">
                   {community.address ? `${community.address}, ` : ''}
                   {community.city || cityDisplay}, {community.state || stateDisplay} {community.zip || ''}
                 </span>
               </div>
               <div className="mt-auto">
                 <Link
                   href={`/community/${stateParam}/${cityParam}/${community.slug}`}
                   className="inline-block bg-blue-600 text-white text-sm font-medium py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200 w-full text-center"
                 >
                   View Details
                 </Link>
               </div>
             </div>
           </div>
         ))}
       </div>
       <div className="mt-12 text-center">
            <Link href="/" className="text-blue-600 hover:underline">
               &larr; Explore Other Areas
             </Link>
       </div>
    </div>
  );
} 