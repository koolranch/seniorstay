import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ohio Assisted Living Medicaid Waiver 2026: Eligibility, Costs & Cleveland Communities',
  description:
    'Does Medicaid pay for assisted living in Ohio? Yes — through the Assisted Living Waiver. See 2026 income limits ($2,982/mo), what it covers, and get free help finding Cleveland-area communities that accept the waiver.',
  keywords:
    'ohio assisted living medicaid waiver, medicaid assisted living cleveland, does medicaid pay for assisted living, assisted living facilities that take medicaid ohio, medicaid waiver ohio eligibility',
  alternates: {
    canonical: 'https://www.guideforseniors.com/medicaid-assisted-living-ohio',
  },
  openGraph: {
    title: 'Ohio Assisted Living Medicaid Waiver: 2026 Guide',
    description:
      'How the Ohio Assisted Living Waiver works, who qualifies in 2026, and how to find Cleveland-area communities that accept it.',
    url: 'https://www.guideforseniors.com/medicaid-assisted-living-ohio',
    siteName: 'Guide for Seniors',
    locale: 'en_US',
    type: 'article',
  },
};

export default function MedicaidAssistedLivingOhioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
