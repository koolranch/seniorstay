import Link from 'next/link';

interface CityCardProps {
  name: string;
  slug: string;
  count: number;
}

export default function CityCard({ name, slug, count }: CityCardProps) {
  return (
    <div className="border rounded-lg p-4 flex flex-col justify-between hover:shadow-md transition-shadow">
      <div>
        <h3 className="text-lg font-medium text-gray-900">{name}, OH</h3>
        <p className="text-sm text-gray-600 mt-1">{count} Community{count !== 1 ? 'ies' : ''}</p>
      </div>
      <Link
        href={`/ohio/${slug}`}
        className="mt-4 inline-block text-center w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label={`View ${count} communities in ${name}, Ohio`}
      >
        View {count} Communities
      </Link>
    </div>
  );
} 