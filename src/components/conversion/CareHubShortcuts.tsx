import Link from 'next/link';
import { CLEVELAND_CARE_HUBS } from '@/lib/top-cleveland-cities';

interface CareHubShortcutsProps {
  className?: string;
}

export default function CareHubShortcuts({ className = '' }: CareHubShortcutsProps) {
  return (
    <div className={`flex flex-wrap justify-center gap-2 ${className}`}>
      {CLEVELAND_CARE_HUBS.map((hub) => (
        <Link
          key={hub.href}
          href={hub.href}
          className="inline-flex items-center bg-white border border-slate-200 hover:border-teal-400 text-slate-700 hover:text-teal-700 font-semibold text-sm px-4 py-2 rounded-full transition-colors shadow-sm"
        >
          {hub.label}
        </Link>
      ))}
    </div>
  );
}
