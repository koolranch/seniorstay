// Local senior resources data with verified addresses for Cleveland suburbs
// This data signals hyper-local relevance to search engines

export interface LocalResource {
  name: string;
  type: 'social-security' | 'hospital' | 'area-agency' | 'medicaid-office';
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  website?: string;
  description?: string;
}

export interface CityLocalResources {
  socialSecurity: LocalResource;
  hospitals: LocalResource[];
  areaAgency: LocalResource;
  medicaidOffice?: LocalResource;
}

// Social Security offices serving Cleveland area
const socialSecurityOffices: Record<string, LocalResource> = {
  beachwood: {
    name: 'Social Security Administration - Beachwood',
    type: 'social-security',
    address: '3591 Park East Drive',
    city: 'Beachwood',
    state: 'OH',
    zip: '44122',
    phone: '1-877-402-0823',
    website: 'https://www.ssa.gov/locator/',
    description: 'Serves eastern Cuyahoga County including Beachwood, Shaker Heights, and surrounding suburbs'
  },
  cleveland: {
    name: 'Social Security Administration - Cleveland Downtown',
    type: 'social-security',
    address: '1240 East 9th Street',
    city: 'Cleveland',
    state: 'OH',
    zip: '44199',
    phone: '1-877-803-6313',
    website: 'https://www.ssa.gov/locator/',
    description: 'Main Cleveland office serving downtown and surrounding neighborhoods'
  },
  clevelandWest: {
    name: 'Social Security Administration - Cleveland West',
    type: 'social-security',
    address: '7517 Lorain Avenue',
    city: 'Cleveland',
    state: 'OH',
    zip: '44102',
    phone: '1-877-876-3172',
    website: 'https://www.ssa.gov/locator/',
    description: 'Serves Cleveland west side and western suburbs'
  },
  lorain: {
    name: 'Social Security Administration - Lorain',
    type: 'social-security',
    address: '221 West 5th Street',
    city: 'Lorain',
    state: 'OH',
    zip: '44052',
    phone: '1-800-772-1213',
    website: 'https://www.ssa.gov/locator/',
    description: 'Serves Lorain County including Westlake and western suburbs'
  },
  parma: {
    name: 'Social Security Administration - Parma',
    type: 'social-security',
    address: '5865 Pearl Road',
    city: 'Parma Heights',
    state: 'OH',
    zip: '44130',
    phone: '1-877-626-8012',
    website: 'https://www.ssa.gov/locator/',
    description: 'Serves Parma, Seven Hills, Independence and southern suburbs'
  }
};

// Major hospitals with full addresses
const hospitals: Record<string, LocalResource> = {
  hillcrest: {
    name: 'Cleveland Clinic Hillcrest Hospital',
    type: 'hospital',
    address: '6780 Mayfield Road',
    city: 'Mayfield Heights',
    state: 'OH',
    zip: '44124',
    phone: '440-312-4500',
    website: 'https://my.clevelandclinic.org/locations/hillcrest-hospital',
    description: 'Full-service hospital with emergency, cardiology, orthopedics, and geriatric care'
  },
  ahuja: {
    name: 'UH Ahuja Medical Center',
    type: 'hospital',
    address: '3999 Richmond Road',
    city: 'Beachwood',
    state: 'OH',
    zip: '44122',
    phone: '216-593-5500',
    website: 'https://www.uhhospitals.org/locations/uh-ahuja-medical-center',
    description: 'Modern full-service hospital with specialized senior care programs'
  },
  clevelandClinicMain: {
    name: 'Cleveland Clinic Main Campus',
    type: 'hospital',
    address: '9500 Euclid Avenue',
    city: 'Cleveland',
    state: 'OH',
    zip: '44195',
    phone: '216-444-2200',
    website: 'https://my.clevelandclinic.org/',
    description: 'World-renowned academic medical center with comprehensive senior services'
  },
  uhCleveland: {
    name: 'University Hospitals Cleveland Medical Center',
    type: 'hospital',
    address: '11100 Euclid Avenue',
    city: 'Cleveland',
    state: 'OH',
    zip: '44106',
    phone: '216-844-1000',
    website: 'https://www.uhhospitals.org/',
    description: 'Major teaching hospital with geriatric medicine and memory care specialists'
  },
  stjohn: {
    name: 'St. John Medical Center',
    type: 'hospital',
    address: '29000 Center Ridge Road',
    city: 'Westlake',
    state: 'OH',
    zip: '44145',
    phone: '440-835-8000',
    website: 'https://www.uhhospitals.org/locations/uh-st-john-medical-center',
    description: 'Community hospital with senior emergency care and rehabilitation services'
  },
  fairview: {
    name: 'Cleveland Clinic Fairview Hospital',
    type: 'hospital',
    address: '18101 Lorain Avenue',
    city: 'Cleveland',
    state: 'OH',
    zip: '44111',
    phone: '216-476-7000',
    website: 'https://my.clevelandclinic.org/locations/fairview-hospital',
    description: 'Full-service hospital serving Cleveland west side with geriatric specialists'
  },
  parma: {
    name: 'UH Parma Medical Center',
    type: 'hospital',
    address: '7007 Powers Boulevard',
    city: 'Parma',
    state: 'OH',
    zip: '44129',
    phone: '440-743-3000',
    website: 'https://www.uhhospitals.org/locations/uh-parma-medical-center',
    description: 'Community hospital with comprehensive senior care and rehabilitation'
  },
  southwest: {
    name: 'Southwest General Health Center',
    type: 'hospital',
    address: '18697 Bagley Road',
    city: 'Middleburg Heights',
    state: 'OH',
    zip: '44130',
    phone: '440-816-8000',
    website: 'https://www.swgeneral.com/',
    description: 'Regional hospital serving southwest suburbs with senior health programs'
  },
  metrohealth: {
    name: 'MetroHealth Medical Center',
    type: 'hospital',
    address: '2500 MetroHealth Drive',
    city: 'Cleveland',
    state: 'OH',
    zip: '44109',
    phone: '216-778-7800',
    website: 'https://www.metrohealth.org/',
    description: 'Safety-net hospital with geriatric care and rehabilitation services'
  }
};

// Western Reserve Area Agency on Aging
const areaAgency: LocalResource = {
  name: 'Western Reserve Area Agency on Aging',
  type: 'area-agency',
  address: '1700 East 13th Street, Suite 114',
  city: 'Cleveland',
  state: 'OH',
  zip: '44114',
  phone: '216-621-0303',
  website: 'https://www.areaagingsolutions.org/',
  description: 'Free assistance with Medicaid waivers, PASSPORT, and senior services for Cuyahoga, Geauga, Lake, Lorain, and Medina counties'
};

// Cuyahoga County Job & Family Services (Medicaid)
const medicaidOffice: LocalResource = {
  name: 'Cuyahoga County Job & Family Services',
  type: 'medicaid-office',
  address: '1641 Payne Avenue',
  city: 'Cleveland',
  state: 'OH',
  zip: '44114',
  phone: '216-987-7000',
  website: 'https://cjfs.cuyahogacounty.gov/',
  description: 'Apply for Medicaid and Ohio Medicaid Assisted Living Waiver programs'
};

// Map cities to their local resources
export const cityLocalResources: Record<string, CityLocalResources> = {
  'beachwood': {
    socialSecurity: socialSecurityOffices.beachwood,
    hospitals: [hospitals.ahuja, hospitals.hillcrest, hospitals.clevelandClinicMain],
    areaAgency,
    medicaidOffice
  },
  'shaker-heights': {
    socialSecurity: socialSecurityOffices.beachwood,
    hospitals: [hospitals.uhCleveland, hospitals.clevelandClinicMain, hospitals.ahuja],
    areaAgency,
    medicaidOffice
  },
  'cleveland': {
    socialSecurity: socialSecurityOffices.cleveland,
    hospitals: [hospitals.clevelandClinicMain, hospitals.uhCleveland, hospitals.metrohealth],
    areaAgency,
    medicaidOffice
  },
  'westlake': {
    socialSecurity: socialSecurityOffices.lorain,
    hospitals: [hospitals.stjohn, hospitals.fairview, hospitals.southwest],
    areaAgency,
    medicaidOffice
  },
  'lakewood': {
    socialSecurity: socialSecurityOffices.clevelandWest,
    hospitals: [hospitals.fairview, hospitals.stjohn, hospitals.metrohealth],
    areaAgency,
    medicaidOffice
  },
  'parma': {
    socialSecurity: socialSecurityOffices.parma,
    hospitals: [hospitals.parma, hospitals.southwest, hospitals.metrohealth],
    areaAgency,
    medicaidOffice
  },
  'strongsville': {
    socialSecurity: socialSecurityOffices.parma,
    hospitals: [hospitals.southwest, hospitals.parma, hospitals.fairview],
    areaAgency,
    medicaidOffice
  },
  'independence': {
    socialSecurity: socialSecurityOffices.parma,
    hospitals: [hospitals.parma, hospitals.southwest, hospitals.metrohealth],
    areaAgency,
    medicaidOffice
  },
  'seven-hills': {
    socialSecurity: socialSecurityOffices.parma,
    hospitals: [hospitals.parma, hospitals.southwest, hospitals.metrohealth],
    areaAgency,
    medicaidOffice
  },
  'rocky-river': {
    socialSecurity: socialSecurityOffices.clevelandWest,
    hospitals: [hospitals.fairview, hospitals.stjohn, hospitals.metrohealth],
    areaAgency,
    medicaidOffice
  },
  'north-olmsted': {
    socialSecurity: socialSecurityOffices.clevelandWest,
    hospitals: [hospitals.fairview, hospitals.southwest, hospitals.stjohn],
    areaAgency,
    medicaidOffice
  }
};

// Helper function to get resources for a city
export function getLocalResourcesForCity(citySlug: string): CityLocalResources | null {
  return cityLocalResources[citySlug] || null;
}



