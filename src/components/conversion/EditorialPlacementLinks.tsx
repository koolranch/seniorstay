import Link from 'next/link';
import { BookOpen, DollarSign, ClipboardList, ArrowRight } from 'lucide-react';
import { PLACEMENT_EDITORIAL_LINKS } from '@/lib/placement-editorial-links';

const ICONS = [BookOpen, DollarSign, ClipboardList] as const;

interface EditorialPlacementLinksProps {
  cityName?: string;
  className?: string;
}

export default function EditorialPlacementLinks({ cityName, className = '' }: EditorialPlacementLinksProps) {
  return (
    <section className={`py-10 bg-white border-y border-slate-100 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-2 text-center">
            {cityName ? `Planning senior living in ${cityName}?` : 'Planning senior living in Cleveland?'}
          </h2>
          <p className="text-slate-600 text-sm text-center mb-6">
            Start with costs and care level—then call for personalized community options.
          </p>
          <div className="grid sm:grid-cols-3 gap-3">
            {PLACEMENT_EDITORIAL_LINKS.map((link, i) => {
              const Icon = ICONS[i] ?? BookOpen;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group flex flex-col bg-slate-50 hover:bg-teal-50 border border-slate-200 hover:border-teal-300 rounded-xl p-4 transition-all"
                >
                  <Icon className="h-5 w-5 text-teal-600 mb-2" />
                  <span className="font-semibold text-slate-900 text-sm group-hover:text-teal-700 flex items-center gap-1">
                    {link.label}
                    <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </span>
                  <span className="text-xs text-slate-500 mt-1">{link.description}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
