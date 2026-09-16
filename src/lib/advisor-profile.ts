/** Public local-advisor identity for the Cleveland placement landing page.
 *  Service-area business: locality only — never publish a home street address.
 */
export const ADVISOR_NAME = 'Jocelynn Ray';
export const ADVISOR_INITIALS = 'JR';
export const ADVISOR_JOB_TITLE = 'Senior Living Placement Advisor';
export const ADVISOR_BUSINESS = 'Guide for Seniors';
export const ADVISOR_PATH = '/cleveland-senior-living-advisor';
export const ADVISOR_CANONICAL = `https://www.guideforseniors.com${ADVISOR_PATH}`;
export const ADVISOR_EMAIL = 'info@guideforseniors.com';
export const ADVISOR_LOCALITY = 'Chagrin Falls';
export const ADVISOR_REGION = 'OH';
export const ADVISOR_POSTAL_CODE = '44022';
export const ADVISOR_SERVICE_AREA_LABEL = 'Chagrin Falls and Greater Cleveland, Ohio';
/** Citation-ready locality line — no street or home address. */
export const ADVISOR_NAP_CITY_LINE = `${ADVISOR_LOCALITY}, ${ADVISOR_REGION} ${ADVISOR_POSTAL_CODE}`;
export const ADVISOR_LINK_LABEL = 'Cleveland senior living advisor';

export const ADVISOR_PLACEMENT_CASES = [
  {
    suburb: 'Rocky River',
    careType: 'Assisted living',
    summary:
      'A West Side daughter needed assisted living within a short drive of Fairview Hospital after a hospital stay. We shortlisted three private-pay buildings, compared current rates, and scheduled tours the same week — including The Normandy and options closer to Detroit Road.',
  },
  {
    suburb: 'Chagrin Falls',
    careType: 'Memory care',
    summary:
      'An east-side family wanted boutique memory care near the village, not a large campus. We compared Hamlet, Meadow Falls in South Russell, and Arden Courts of Chagrin Falls on staffing, secured walking paths, and real monthly totals before anyone sat in a sales office.',
  },
  {
    suburb: 'Westlake',
    careType: 'Memory care',
    summary:
      'A couple on the West Side needed dementia-specific care without giving up proximity to UH St. John. We walked through Arden Courts of Westlake versus Fairmont and Saint Therese, including which buildings are memory-care-only versus a locked wing on a larger campus.',
  },
] as const;

export function getAdvisorLocalBusinessSchema(telephone: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${ADVISOR_CANONICAL}#business`,
    name: ADVISOR_BUSINESS,
    url: ADVISOR_CANONICAL,
    telephone,
    email: ADVISOR_EMAIL,
    image: 'https://www.guideforseniors.com/images/default-community.jpg',
    priceRange: 'Free to families',
    description:
      'Free assisted living, memory care, and independent living placement for Greater Cleveland families. Service-area advisor based in Chagrin Falls, Ohio.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: ADVISOR_LOCALITY,
      addressRegion: ADVISOR_REGION,
      postalCode: ADVISOR_POSTAL_CODE,
      addressCountry: 'US',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone,
      email: ADVISOR_EMAIL,
      contactType: 'customer service',
      areaServed: 'US',
      availableLanguage: 'English',
    },
    areaServed: [
      { '@type': 'City', name: 'Cleveland', containedInPlace: { '@type': 'State', name: 'Ohio' } },
      { '@type': 'City', name: 'Chagrin Falls' },
      { '@type': 'City', name: 'Rocky River' },
      { '@type': 'City', name: 'Westlake' },
      { '@type': 'City', name: 'Lakewood' },
      { '@type': 'City', name: 'Shaker Heights' },
      { '@type': 'City', name: 'Beachwood' },
    ],
    founder: { '@id': `${ADVISOR_CANONICAL}#advisor` },
    employee: { '@id': `${ADVISOR_CANONICAL}#advisor` },
  };
}

export function getAdvisorPersonSchema(telephone: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${ADVISOR_CANONICAL}#advisor`,
    name: ADVISOR_NAME,
    jobTitle: ADVISOR_JOB_TITLE,
    telephone,
    email: ADVISOR_EMAIL,
    url: ADVISOR_CANONICAL,
    worksFor: { '@id': `${ADVISOR_CANONICAL}#business` },
    address: {
      '@type': 'PostalAddress',
      addressLocality: ADVISOR_LOCALITY,
      addressRegion: ADVISOR_REGION,
      postalCode: ADVISOR_POSTAL_CODE,
      addressCountry: 'US',
    },
    knowsAbout: [
      'Assisted living placement',
      'Memory care placement',
      'Independent living',
      'Cleveland senior living',
      'Chagrin Valley senior living',
    ],
  };
}
