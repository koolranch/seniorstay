import { Metadata } from 'next';
import Link from 'next/link';
import { 
  Users, 
  Heart, 
  MapPin, 
  Calendar, 
  Coffee, 
  Music, 
  Palette, 
  Dumbbell,
  BookOpen,
  Church,
  ArrowRight, 
  Phone,
  CheckCircle,
  Home as HomeIcon
} from 'lucide-react';
import GlobalHeader from '@/components/home/GlobalHeader';
import Footer from '@/components/footer/Footer';

/**
 * Social Activities for Seniors Page
 * 
 * SEO Target Keywords:
 * - "seniors meet" (900 vol)
 * - "where to meet seniors" (related)
 * - "senior social activities cleveland" (local)
 * - "places for seniors to meet other seniors" (long-tail)
 * 
 * This page targets the high-volume "seniors meet" keyword.
 */

export const metadata: Metadata = {
  title: 'Where Seniors Meet Other Seniors | Social Activities Cleveland | Guide for Seniors',
  description: 'Discover 11+ places where seniors can meet other seniors in Cleveland. From senior centers to community groups, find social activities and combat isolation.',
  keywords: 'seniors meet, where seniors meet other seniors, senior social activities cleveland, places for seniors to meet, senior center cleveland, senior groups cleveland ohio, social activities for elderly',
  openGraph: {
    title: 'Where Seniors Meet Other Seniors in Cleveland',
    description: 'Discover places where seniors can meet other seniors in Cleveland. Senior centers, community groups, and social activities.',
    url: 'https://guideforseniors.com/resources/social-activities',
    siteName: 'Guide for Seniors',
    locale: 'en_US',
    type: 'article',
  },
  alternates: {
    canonical: 'https://guideforseniors.com/resources/social-activities',
  },
  robots: {
    index: true,
    follow: true,
  },
};

// FAQ Schema for featured snippets
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Where can seniors meet other seniors?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Seniors can meet other seniors at: 1) Local senior centers offering daily activities and meals, 2) Community recreation centers with senior programs, 3) Faith-based organizations and church groups, 4) Volunteer organizations, 5) Fitness classes for seniors like Silver Sneakers, 6) Adult education classes, 7) Clubs based on hobbies (gardening, book clubs, art), 8) Senior living communities, and 9) Local libraries offering senior programming. In Cleveland, popular options include the Cleveland Senior Center and programs through the Western Reserve Area Agency on Aging.',
      },
    },
    {
      '@type': 'Question',
      name: 'How can I help an elderly person who is lonely?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'To help an elderly person who is lonely: 1) Visit or call regularly to maintain connection, 2) Help them join a senior center or social group, 3) Arrange transportation to activities, 4) Teach them video calling to connect with family, 5) Consider adult day programs, 6) Look into senior living communities with social programming, 7) Encourage hobbies that involve others, and 8) Connect them with volunteer opportunities. If isolation is severe, consult with a senior care advisor about assisted living options that provide built-in social opportunities.',
      },
    },
    {
      '@type': 'Question',
      name: 'What activities do senior centers offer?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Senior centers typically offer: fitness classes (chair yoga, walking groups), arts and crafts, card games and bingo, educational workshops, computer classes, congregate meals, health screenings, day trips and outings, holiday celebrations, support groups, volunteer opportunities, and special interest clubs. Cleveland-area senior centers often partner with local hospitals and organizations to provide comprehensive programming.',
      },
    },
  ],
};

const PLACES_TO_MEET = [
  {
    id: 'senior-centers',
    title: 'Senior Centers',
    description: 'Dedicated facilities offering daily activities, meals, health programs, and social opportunities specifically for older adults.',
    icon: <HomeIcon className="h-8 w-8" />,
    iconBg: 'bg-teal-100 text-teal-600',
    activities: ['Group meals', 'Fitness classes', 'Card games', 'Day trips'],
    clevelandExamples: ['Cleveland Senior Center', 'Parma Senior Center', 'Lakewood Senior Center'],
  },
  {
    id: 'recreation-centers',
    title: 'Community Recreation Centers',
    description: 'Local rec centers with senior-specific programming, fitness facilities, and group activities.',
    icon: <Dumbbell className="h-8 w-8" />,
    iconBg: 'bg-rose-100 text-rose-600',
    activities: ['Silver Sneakers', 'Swimming', 'Walking clubs', 'Sports leagues'],
    clevelandExamples: ['Rocky River Recreation Center', 'Beachwood Community Center'],
  },
  {
    id: 'faith-based',
    title: 'Faith-Based Organizations',
    description: 'Churches, synagogues, and religious communities often have active senior ministries and social groups.',
    icon: <Church className="h-8 w-8" />,
    iconBg: 'bg-violet-100 text-violet-600',
    activities: ['Prayer groups', 'Bible study', 'Service projects', 'Fellowship meals'],
    clevelandExamples: ['Local church senior groups', 'JCC of Cleveland', 'Catholic Charities'],
  },
  {
    id: 'libraries',
    title: 'Public Libraries',
    description: 'Libraries offer free programs for seniors including book clubs, computer classes, and cultural events.',
    icon: <BookOpen className="h-8 w-8" />,
    iconBg: 'bg-amber-100 text-amber-600',
    activities: ['Book clubs', 'Computer help', 'Movie screenings', 'Guest speakers'],
    clevelandExamples: ['Cuyahoga County Public Library', 'Cleveland Public Library'],
  },
  {
    id: 'volunteer',
    title: 'Volunteer Organizations',
    description: 'Giving back to the community while meeting like-minded seniors who want to make a difference.',
    icon: <Heart className="h-8 w-8" />,
    iconBg: 'bg-pink-100 text-pink-600',
    activities: ['Food banks', 'Tutoring', 'Hospital volunteering', 'Animal shelters'],
    clevelandExamples: ['Greater Cleveland Food Bank', 'Hospice volunteer programs'],
  },
  {
    id: 'hobby-clubs',
    title: 'Hobby & Interest Clubs',
    description: 'Join groups based on shared interests like gardening, art, photography, or crafts.',
    icon: <Palette className="h-8 w-8" />,
    iconBg: 'bg-cyan-100 text-cyan-600',
    activities: ['Gardening clubs', 'Art classes', 'Photography groups', 'Knitting circles'],
    clevelandExamples: ['Cleveland Botanical Garden', 'Local art centers'],
  },
  {
    id: 'fitness',
    title: 'Senior Fitness Classes',
    description: 'Stay active while making friends in classes designed for older adults.',
    icon: <Dumbbell className="h-8 w-8" />,
    iconBg: 'bg-green-100 text-green-600',
    activities: ['Chair yoga', 'Tai Chi', 'Water aerobics', 'Walking groups'],
    clevelandExamples: ['YMCAs', 'Silver Sneakers locations', 'Community pools'],
  },
  {
    id: 'music',
    title: 'Music & Performance Groups',
    description: 'Choirs, bands, and theater groups welcome seniors and provide creative social outlets.',
    icon: <Music className="h-8 w-8" />,
    iconBg: 'bg-indigo-100 text-indigo-600',
    activities: ['Community choirs', 'Jam sessions', 'Theater groups', 'Concert attendance'],
    clevelandExamples: ['Cleveland Orchestra free events', 'Community theater'],
  },
];

const CLEVELAND_SENIOR_CENTERS = [
  { name: 'Cleveland Senior Center', location: 'Downtown Cleveland', highlight: 'Largest in the city' },
  { name: 'Parma Senior Center', location: 'Parma', highlight: 'Active fitness programs' },
  { name: 'Lakewood Senior Center', location: 'Lakewood', highlight: 'Arts & crafts focus' },
  { name: 'Rocky River Senior Center', location: 'Rocky River', highlight: 'Day trips popular' },
  { name: 'Beachwood Community Center', location: 'Beachwood', highlight: 'Upscale facilities' },
  { name: 'Westlake Senior Center', location: 'Westlake', highlight: 'Technology classes' },
];

export default function SocialActivitiesPage() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />

      <main className="min-h-screen flex flex-col">
        <GlobalHeader />

        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-rose-50 to-white py-16 md:py-24 overflow-hidden">
          <div className="absolute top-1/4 left-0 w-64 h-64 bg-rose-300 rounded-full mix-blend-multiply filter blur-xl opacity-10" />
          <div className="absolute bottom-1/4 right-0 w-64 h-64 bg-teal-300 rounded-full mix-blend-multiply filter blur-xl opacity-10" />
          
          <div className="container mx-auto px-4 relative z-10 text-center">
            <span className="inline-block bg-rose-100 text-rose-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              Social Connection for Seniors
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-6 max-w-4xl mx-auto">
              Where Seniors Meet Other Seniors
            </h1>
            <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
              Discover 11+ places in Cleveland where seniors can make new friends, stay active, and combat loneliness through meaningful social connections.
            </p>
            
            {/* Trust Stats */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-rose-500" />
                <span>Combat Isolation</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-teal-500" />
                <span>Cleveland Local Options</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-amber-500" />
                <span>Daily Activities</span>
              </div>
            </div>
          </div>
        </section>

        {/* Why Social Connection Matters */}
        <section className="py-16 md:py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <span className="inline-block bg-teal-100 text-teal-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                    The Importance of Connection
                  </span>
                  <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                    Social Isolation: A Senior Health Crisis
                  </h2>
                  <p className="text-lg text-slate-600 mb-6">
                    Studies show that social isolation in seniors is as harmful as smoking 15 cigarettes a day. Regular social interaction is essential for mental health, cognitive function, and even physical wellness.
                  </p>
                  <div className="space-y-3">
                    {[
                      '43% of seniors report feeling lonely regularly',
                      'Social seniors have 50% lower dementia risk',
                      'Active social life reduces depression by 30%',
                      'Community engagement extends lifespan',
                    ].map((stat, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-teal-600 flex-shrink-0" />
                        <span className="text-slate-700">{stat}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-rose-50 p-8 rounded-2xl border border-rose-200">
                  <Coffee className="h-12 w-12 text-rose-600 mb-4" />
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Ready to Help Your Loved One?</h3>
                  <p className="text-slate-600 mb-4">
                    If your senior family member is experiencing isolation, our Cleveland advisors can help find communities and programs that provide built-in social opportunities.
                  </p>
                  <Link
                    href="/contact"
                    className="inline-flex items-center text-rose-600 font-semibold hover:text-rose-700"
                  >
                    Talk to an Advisor <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Places to Meet */}
        <section className="py-16 md:py-20 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <span className="inline-block bg-violet-100 text-violet-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                11+ Places
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Places Where Seniors Can Meet New Friends
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                From senior centers to hobby clubs, discover the best places for older adults to socialize in Cleveland.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {PLACES_TO_MEET.map((place) => (
                <div 
                  key={place.id}
                  className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg transition-all duration-300"
                >
                  <div className={`${place.iconBg} w-14 h-14 rounded-xl flex items-center justify-center mb-4`}>
                    {place.icon}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{place.title}</h3>
                  <p className="text-slate-600 text-sm mb-4">{place.description}</p>
                  
                  <div className="mb-3">
                    <p className="text-xs font-semibold text-slate-500 mb-2">ACTIVITIES:</p>
                    <div className="flex flex-wrap gap-1">
                      {place.activities.map((activity, index) => (
                        <span 
                          key={index}
                          className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full"
                        >
                          {activity}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-teal-600 mb-1">CLEVELAND OPTIONS:</p>
                    <p className="text-xs text-slate-500">{place.clevelandExamples.join(', ')}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Cleveland Senior Centers */}
        <section className="py-16 md:py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <span className="inline-block bg-teal-100 text-teal-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                  Local Resources
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                  Cleveland-Area Senior Centers
                </h2>
                <p className="text-lg text-slate-600">
                  These local senior centers offer daily programming, meals, and social activities.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {CLEVELAND_SENIOR_CENTERS.map((center, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200"
                  >
                    <MapPin className="h-6 w-6 text-teal-600 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-slate-900">{center.name}</h3>
                      <p className="text-sm text-slate-600">{center.location} • {center.highlight}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-6 bg-amber-50 border-l-4 border-amber-500 rounded-xl">
                <p className="text-amber-800">
                  <strong>Pro Tip:</strong> Most senior centers are free or low-cost and welcome drop-ins. Call ahead to learn about upcoming activities and meal schedules. Many offer transportation assistance for seniors who don&apos;t drive.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Senior Living Communities CTA */}
        <section className="py-16 md:py-20 bg-gradient-to-br from-teal-600 to-teal-700 text-white">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-80" />
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Consider Senior Living for Built-In Community
              </h2>
              <p className="text-lg text-teal-100 mb-8">
                Assisted living and independent living communities offer daily social activities, group dining, and ready-made friendships. For seniors who are isolated at home, moving to a community can be life-changing.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/greater-cleveland"
                  className="inline-flex items-center justify-center bg-white text-teal-700 font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all text-base min-h-[56px]"
                >
                  Explore Communities with Social Programs
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center bg-teal-500 hover:bg-teal-400 text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all text-base min-h-[56px]"
                >
                  <Phone className="mr-2 h-5 w-5" />
                  (216) 677-4630
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Related Resources */}
        <section className="py-16 md:py-20 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                Related Senior Resources
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <Link 
                href="/resources/games-for-seniors"
                className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg transition-all duration-300 group"
              >
                <Coffee className="h-8 w-8 text-violet-600 mb-4" />
                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-teal-600 transition-colors">
                  Games for Seniors
                </h3>
                <p className="text-slate-600 text-sm">
                  Free online games and brain puzzles to enjoy alone or with others.
                </p>
              </Link>

              <Link 
                href="/assisted-living-cleveland"
                className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg transition-all duration-300 group"
              >
                <HomeIcon className="h-8 w-8 text-teal-600 mb-4" />
                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-teal-600 transition-colors">
                  Assisted Living Guide
                </h3>
                <p className="text-slate-600 text-sm">
                  Learn about assisted living communities with active social programs.
                </p>
              </Link>

              <Link 
                href="/resources"
                className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg transition-all duration-300 group"
              >
                <BookOpen className="h-8 w-8 text-amber-600 mb-4" />
                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-teal-600 transition-colors">
                  All Resources
                </h3>
                <p className="text-slate-600 text-sm">
                  Browse all our senior living guides and expert advice.
                </p>
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}


