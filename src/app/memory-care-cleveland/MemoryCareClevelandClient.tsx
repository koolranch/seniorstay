import Link from 'next/link';
import { ArrowRight, CheckCircle, Heart, Shield, Users, Brain, Phone, Clock, DollarSign, Hospital, AlertTriangle } from 'lucide-react';
import GlobalHeader from '@/components/home/GlobalHeader';
import Footer from '@/components/footer/Footer';
import LocationCard from '@/components/property/LocationCard';
import StickyTourButton from '@/components/tour/StickyTourButton';
import PopularSuburbsGrid from '@/components/conversion/PopularSuburbsGrid';
import PlacementHeroCTAs from '@/components/conversion/PlacementHeroCTAs';
import PhoneLink from '@/components/conversion/PhoneLink';
import SimpleContactForm from '@/components/forms/SimpleContactForm';
import { Community } from '@/data/facilities';

interface MemoryCareClevelandClientProps {
  communities: Community[];
}

export default function MemoryCareClevelandClient({ communities }: MemoryCareClevelandClientProps) {
  const specializedServices = [
    {
      icon: Shield,
      title: "Secure Environment",
      description: "Monitored exits, wandering prevention, and safe outdoor spaces"
    },
    {
      icon: Brain,
      title: "Cognitive Therapy",
      description: "Memory-enhancing activities and specialized programming"
    },
    {
      icon: Users,
      title: "Specialized Staff Training",
      description: "Staff trained in dementia care and behavior management"
    },
    {
      icon: Heart,
      title: "Personalized Care Plans",
      description: "Individualized approach based on each resident's needs"
    },
    {
      icon: Clock,
      title: "Structured Daily Routines",
      description: "Consistent schedules that provide comfort and reduce anxiety"
    },
    {
      icon: CheckCircle,
      title: "24/7 Supervision",
      description: "Round-the-clock care and monitoring for safety"
    }
  ];

  return (
    <main className="flex min-h-screen flex-col bg-white">
      <GlobalHeader />
      
      <section className="bg-gradient-to-b from-slate-50 via-white to-slate-50 py-16 md:py-24 relative overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-teal-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-200/20 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block bg-teal-100 text-teal-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Brain className="inline h-4 w-4 mr-1" />
              Specialized Dementia Care
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900 leading-tight">
              Memory Care in Cleveland, Ohio
            </h1>
            <p className="text-lg md:text-xl text-slate-600 mb-10">
              Specialized Alzheimer&apos;s and dementia care in a secure, compassionate environment. Compare Cleveland memory care communities with free local placement help.
            </p>
            <PlacementHeroCTAs
              phonePlacement="memory_care_hub_hero"
              browseHref="#communities"
              browseLabel="Browse Memory Care Communities"
              guideHref="#guide"
              guideLabel="Read Complete Guide"
            />
          </div>
        </div>
      </section>

      <section className="bg-slate-800 py-4 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm md:text-base">
            <div className="flex items-center gap-2">
              <Hospital className="h-5 w-5 text-teal-400" />
              <span>Cleveland Clinic Neurological Institute</span>
            </div>
            <div className="flex items-center gap-2">
              <Hospital className="h-5 w-5 text-teal-400" />
              <span>UH Memory & Cognition Center</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-teal-400" />
              <span>Secure, Licensed Communities</span>
            </div>
          </div>
        </div>
      </section>

      <PopularSuburbsGrid title="Memory Care by Suburb" />

      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-8 border border-teal-200">
              <div className="flex items-start gap-4 mb-6">
                <div className="bg-teal-100 p-3 rounded-xl">
                  <DollarSign className="h-6 w-6 text-teal-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">Cost of Memory Care in Cleveland</h2>
                  <p className="text-3xl font-bold text-teal-600">$4,500 – $8,500/month</p>
                </div>
              </div>
              <p className="text-slate-600 mb-4">
                Memory care is higher than assisted living due to the specialized care, lower staff-to-resident ratios, and secure environment. Costs vary based on:
              </p>
              <ul className="grid md:grid-cols-2 gap-2 mb-6">
                {["Level of care required", "Community location and amenities", "Type of apartment (private vs. shared)", "Additional services needed"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-slate-700">
                    <div className="w-2 h-2 bg-teal-500 rounded-full" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-slate-600 text-sm">
                Most Cleveland memory care communities offer all-inclusive pricing that covers room, meals, personal care, activities, and medical management.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="communities" className="bg-slate-50 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-block bg-teal-100 text-teal-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              Featured Communities
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Top Memory Care Communities in Cleveland</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              These specialized memory care communities provide expert Alzheimer&apos;s and dementia care in secure, compassionate environments.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
            {communities.map((community) => (
              <LocationCard key={community.id} community={community} />
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/cleveland"
              className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold px-8 py-4 rounded-xl transition-colors shadow-lg hover:shadow-xl min-h-[56px]"
            >
              Browse Cleveland Communities
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      <section id="guide" className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900">What is Memory Care?</h2>
            
            <p className="text-lg text-slate-600 mb-10 leading-relaxed">
              Memory care is specialized senior housing designed for individuals with Alzheimer&apos;s disease, dementia, or other forms of memory impairment. Cleveland&apos;s memory care communities provide secure environments with specially trained staff, structured routines, and therapeutic programs tailored to residents with cognitive challenges.
            </p>

            <div className="mb-16">
              <h3 className="text-2xl font-bold mb-8 text-slate-900">Specialized Services in Cleveland Memory Care Communities</h3>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {specializedServices.map((service) => {
                  const Icon = service.icon;
                  return (
                    <div key={service.title} className="bg-slate-50 rounded-2xl p-6 border border-slate-200 hover:shadow-md transition-shadow">
                      <div className="bg-teal-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                        <Icon className="h-6 w-6 text-teal-600" />
                      </div>
                      <h4 className="font-bold text-slate-900 mb-2">{service.title}</h4>
                      <p className="text-slate-600">{service.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8 mb-12">
              <div className="flex items-start gap-4 mb-6">
                <div className="bg-amber-100 p-3 rounded-xl">
                  <AlertTriangle className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Signs It&apos;s Time for Memory Care</h3>
                  <p className="text-slate-600">Consider memory care in Cleveland when your loved one experiences:</p>
                </div>
              </div>
              <ul className="grid md:grid-cols-2 gap-3">
                {[
                  "Wandering or getting lost in familiar places",
                  "Difficulty with personal care and hygiene",
                  "Aggressive or unsafe behaviors",
                  "Inability to manage medications independently",
                  "Sundowning (increased confusion in evening hours)",
                  "Caregiver burnout or inability to provide adequate supervision",
                  "Safety concerns at home (leaving stove on, forgetting to eat)"
                ].map((sign) => (
                  <li key={sign} className="flex items-start gap-2 text-slate-700">
                    <CheckCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <span>{sign}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-12">
              <h3 className="text-2xl font-bold mb-6 text-slate-900">Memory Care vs. Assisted Living: What&apos;s the Difference?</h3>
              <p className="text-slate-600 mb-6">
                While both provide personal care assistance, memory care offers additional features:
              </p>
              <div className="space-y-4">
                {[
                  { title: "Secure Facilities", desc: "Memory care units have controlled access to prevent wandering" },
                  { title: "Staff Training", desc: "Specialized dementia care training for all caregivers" },
                  { title: "Lower Staff Ratios", desc: "More staff per resident for intensive supervision" },
                  { title: "Specialized Programs", desc: "Activities designed for cognitive stimulation" },
                  { title: "Environmental Design", desc: "Layouts that reduce confusion and promote independence" }
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-3 bg-slate-50 p-4 rounded-xl">
                    <CheckCircle className="h-5 w-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-900">{item.title}:</span>{' '}
                      <span className="text-slate-600">{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-12">
              <h3 className="text-2xl font-bold mb-6 text-slate-900">How to Pay for Memory Care in Ohio</h3>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                {[
                  { title: "Private Pay", desc: "Most Cleveland memory care is paid privately through savings, a home sale, or family support" },
                  { title: "Veterans Benefits", desc: "VA Aid & Attendance can provide up to $2,266/month for qualifying veterans" },
                  { title: "Long-Term Care Insurance", desc: "Many policies cover memory care services" },
                  { title: "Life Insurance Conversion", desc: "Some policies can be converted to pay for care" },
                  { title: "Reverse Mortgages", desc: "Can provide funds for memory care costs" }
                ].map((item) => (
                  <div key={item.title} className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                    <h4 className="font-bold text-slate-900 mb-1">{item.title}</h4>
                    <p className="text-slate-600 text-sm">{item.desc}</p>
                  </div>
                ))}
              </div>
              <p className="text-sm text-slate-500">
                Most Cleveland memory care is private-pay. A{' '}
                <Link href="/cleveland-senior-living-advisor" className="text-teal-700 font-medium hover:underline">
                  Cleveland senior living advisor
                </Link>{' '}
                can compare current rates and availability before you tour.
              </p>
            </div>

            <div className="mb-12">
              <h3 className="text-2xl font-bold mb-6 text-slate-900">Choosing the Right Memory Care Community in Cleveland</h3>
              <p className="text-slate-600 mb-6">
                When evaluating Cleveland memory care options, look for:
              </p>
              <div className="space-y-3">
                {[
                  { title: "Staff Credentials", desc: "Ask about dementia-specific training and certifications" },
                  { title: "Safety Features", desc: "Secure outdoor areas, monitored entry/exit, emergency response systems" },
                  { title: "Activity Programs", desc: "Music therapy, art therapy, reminiscence activities" },
                  { title: "Healthcare Partnerships", desc: "On-site medical services or partnerships with Cleveland Clinic or University Hospitals" },
                  { title: "Family Involvement", desc: "Policies for visits, care plan participation, and communication" },
                  { title: "Progression of Care", desc: "Can they accommodate changing needs as dementia progresses?" }
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-teal-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-900">{item.title}:</span>{' '}
                      <span className="text-slate-600">{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-900 text-white rounded-2xl p-8">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-teal-500 p-3 rounded-xl">
                  <Hospital className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold">Memory Care in Greater Cleveland</h3>
              </div>
              <p className="text-slate-300 leading-relaxed">
                Cleveland offers strong memory care options with access to world-class healthcare, including <strong className="text-white">Cleveland Clinic&apos;s Neurological Institute</strong> and <strong className="text-white">University Hospitals&apos; Memory and Cognition Center</strong>. Many local communities coordinate with these systems for specialized care protocols.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-teal-600 to-teal-700 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Get Expert Help Finding Memory Care in Cleveland</h2>
            <p className="text-lg text-teal-100 mb-6">
              Call Jocelynn for a free memory care consult. We know Cleveland&apos;s dementia care communities and can help you find the right fit.
            </p>
            <PhoneLink
              placement="memory_care_hub_cta"
              className="inline-flex items-center gap-2 bg-white text-teal-700 hover:bg-teal-50 font-bold px-8 py-4 rounded-xl shadow-lg mb-8 min-h-[56px]"
            >
              <Phone className="h-5 w-5" />
              Call (216) 677-4630
            </PhoneLink>
            <div className="bg-white p-8 rounded-2xl shadow-2xl text-left">
              <SimpleContactForm
                sourcePage="memory-care-cleveland"
                buttonText="Request a Callback"
                showMessage={false}
              />
            </div>
            <p className="mt-6 text-sm text-teal-100">
              Prefer to read first?{' '}
              <Link href="/cleveland-senior-living-advisor" className="underline hover:text-white font-medium">
                Cleveland senior living advisor
              </Link>
            </p>
          </div>
        </div>
      </section>

      <StickyTourButton />
      <Footer />
    </main>
  );
}
