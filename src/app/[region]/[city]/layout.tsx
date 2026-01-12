import { Metadata } from 'next';

type Props = {
  params: Promise<{ region: string; city: string }>;
  children: React.ReactNode;
};

export default async function CityLayout({ params, children }: Props) {
  const { region, city } = await params;
  return children;
}
