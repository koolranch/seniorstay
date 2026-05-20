import Link from 'next/link';
import { Phone, ArrowRight, MapPin } from 'lucide-react';
import PhoneLink from '@/components/conversion/PhoneLink';

interface PlacementConversionBandProps {
  title: string;
  description: string;
  phonePlacement: string;
  contactHref?: string;
  cityName?: string;
  cityHref?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  className?: string;
}

export default function PlacementConversionBand({
  title,
  description,
  phonePlacement,
  contactHref = '/contact?intent=placement',
  cityName,
  cityHref,
  secondaryHref = '/assessment',
  secondaryLabel = 'Take the 2-min assessment',
  className = '',
}: PlacementConversionBandProps) {
  return (
    <section className={`bg-gradient-to-r from-teal-600 to-teal-700 py-8 md:py-10 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-xl md:text-2xl font-bold mb-2">{title}</h2>
          <p className="text-teal-50 mb-6 text-sm md:text-base">{description}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <PhoneLink
              placement={phonePlacement}
              className="inline-flex items-center justify-center gap-2 bg-white text-teal-700 hover:bg-teal-50 font-bold px-6 py-3.5 rounded-xl min-h-[48px] w-full sm:w-auto"
            >
              <Phone className="h-5 w-5" />
              Call for Free Help
            </PhoneLink>
            <Link
              href={contactHref}
              className="inline-flex items-center justify-center gap-2 bg-teal-800/40 hover:bg-teal-800/60 text-white font-semibold px-6 py-3.5 rounded-xl border border-white/30 min-h-[48px] w-full sm:w-auto"
            >
              Request a Callback
            </Link>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-5 text-sm">
            {cityName && cityHref && (
              <Link href={cityHref} className="inline-flex items-center gap-1 text-teal-100 hover:text-white font-medium">
                <MapPin className="h-4 w-4" />
                Senior living in {cityName}
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            )}
            {secondaryHref && (
              <Link href={secondaryHref} className="text-teal-100 hover:text-white font-medium underline-offset-2 hover:underline">
                {secondaryLabel}
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
