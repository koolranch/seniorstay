import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from '@react-pdf/renderer';

// Register fonts (using default sans-serif for now)
// In production, you could register custom fonts here

// Create styles
const styles = StyleSheet.create({
  // Page styles
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 40,
    fontFamily: 'Helvetica',
  },
  coverPage: {
    flexDirection: 'column',
    backgroundColor: '#0f766e', // teal-700
    padding: 0,
    fontFamily: 'Helvetica',
  },
  
  // Cover page styles
  coverContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  coverLogo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  coverTagline: {
    fontSize: 12,
    color: '#99f6e4', // teal-200
    marginBottom: 60,
  },
  coverTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 1.2,
  },
  coverSubtitle: {
    fontSize: 16,
    color: '#ccfbf1', // teal-100
    textAlign: 'center',
    marginBottom: 40,
  },
  coverPreparedFor: {
    fontSize: 12,
    color: '#99f6e4',
    textAlign: 'center',
    marginBottom: 8,
  },
  coverName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  coverFooter: {
    backgroundColor: '#115e59', // teal-800
    padding: 20,
    alignItems: 'center',
  },
  coverPhone: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  coverDate: {
    fontSize: 10,
    color: '#99f6e4',
    marginTop: 4,
  },

  // Header/Footer
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#0f766e',
  },
  headerLogo: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f766e',
  },
  headerPage: {
    fontSize: 10,
    color: '#64748b',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  footerText: {
    fontSize: 9,
    color: '#64748b',
  },
  footerPhone: {
    fontSize: 10,
    color: '#0f766e',
    fontWeight: 'bold',
  },

  // Typography
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f766e',
    marginTop: 20,
    marginBottom: 10,
  },
  subsectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#334155',
    marginTop: 12,
    marginBottom: 6,
  },
  paragraph: {
    fontSize: 11,
    color: '#475569',
    lineHeight: 1.6,
    marginBottom: 10,
  },
  bulletItem: {
    fontSize: 11,
    color: '#475569',
    marginBottom: 4,
    paddingLeft: 12,
  },
  bulletPoint: {
    position: 'absolute',
    left: 0,
  },

  // Summary box
  summaryBox: {
    backgroundColor: '#f0fdfa', // teal-50
    borderWidth: 1,
    borderColor: '#99f6e4', // teal-200
    borderRadius: 8,
    padding: 20,
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f766e',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 11,
    color: '#64748b',
    width: 140,
  },
  summaryValue: {
    fontSize: 11,
    color: '#0f172a',
    fontWeight: 'bold',
    flex: 1,
  },

  // Care Type Card
  careTypeCard: {
    backgroundColor: '#fafafa',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  careTypeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  careTypeIcon: {
    width: 36,
    height: 36,
    backgroundColor: '#0f766e',
    borderRadius: 18,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  careTypeIconText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  careTypeName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  careTypePrice: {
    fontSize: 12,
    color: '#0f766e',
    marginTop: 2,
  },

  // Pricing table
  pricingTable: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 20,
  },
  pricingHeader: {
    flexDirection: 'row',
    backgroundColor: '#0f766e',
    padding: 10,
  },
  pricingHeaderCell: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  pricingRow: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  pricingRowAlt: {
    backgroundColor: '#f8fafc',
  },
  pricingCell: {
    fontSize: 10,
    color: '#475569',
  },

  // Community card
  communityCard: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  communityName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 4,
  },
  communityDetail: {
    fontSize: 10,
    color: '#64748b',
    marginBottom: 2,
  },
  communityPrice: {
    fontSize: 11,
    color: '#0f766e',
    fontWeight: 'bold',
    marginTop: 6,
  },

  // Checklist
  checklistItem: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  checklistBox: {
    width: 14,
    height: 14,
    borderWidth: 1,
    borderColor: '#0f766e',
    borderRadius: 2,
    marginRight: 10,
    marginTop: 1,
  },
  checklistText: {
    fontSize: 11,
    color: '#475569',
    flex: 1,
    lineHeight: 1.4,
  },

  // Call to action box
  ctaBox: {
    backgroundColor: '#0f766e',
    borderRadius: 8,
    padding: 20,
    marginTop: 20,
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  ctaText: {
    fontSize: 11,
    color: '#ccfbf1',
    textAlign: 'center',
    marginBottom: 12,
  },
  ctaPhone: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },

  // Two column layout
  twoColumn: {
    flexDirection: 'row',
    gap: 20,
  },
  column: {
    flex: 1,
  },
});

// Types
interface AssessmentData {
  score: number;
  recommendation: string;
  matchedCommunities: string[];
  answers: Record<string, string | string[]>;
}

interface Community {
  name: string;
  city: string;
  careTypes: string[];
  priceRange?: string;
}

interface CareGuidePDFProps {
  recipientName: string;
  email: string;
  assessmentData: AssessmentData;
  matchedCommunities?: Community[];
  generatedDate?: string;
}

// Care type information
const CARE_TYPE_INFO: Record<string, { description: string; services: string[]; priceRange: string }> = {
  'Memory Care': {
    description: 'Memory Care communities provide specialized 24/7 support for individuals with Alzheimer\'s disease, dementia, or other cognitive impairments. These communities offer secure environments with trained staff who understand the unique needs of memory care residents.',
    services: [
      'Secure, monitored environment to prevent wandering',
      '24/7 specialized dementia-trained staff',
      'Cognitive therapy and memory-enhancing activities',
      'All meals, snacks, and hydration monitoring',
      'Medication management and health monitoring',
      'Personal care assistance (bathing, dressing, grooming)',
      'Housekeeping and laundry services',
    ],
    priceRange: '$4,500 - $8,500/month',
  },
  'Assisted Living': {
    description: 'Assisted Living communities help residents maintain independence while providing support with daily activities. Staff are available around the clock to assist with personal care, medication management, and other needs while residents enjoy a vibrant social community.',
    services: [
      'Private or semi-private apartments',
      'Personal care assistance as needed',
      'Three chef-prepared meals daily plus snacks',
      'Medication reminders and management',
      'Housekeeping and laundry services',
      'Social activities and outings',
      'Transportation to appointments',
    ],
    priceRange: '$3,200 - $6,500/month',
  },
  'Independent Living': {
    description: 'Independent Living communities are designed for active seniors who want a maintenance-free lifestyle with access to social activities, dining, and amenities. Residents live independently while enjoying the convenience of community services.',
    services: [
      'Private apartment or cottage',
      'Restaurant-style dining options',
      'Social and recreational activities',
      'Fitness and wellness programs',
      'Housekeeping services',
      'Transportation to shopping and appointments',
      '24-hour emergency response',
    ],
    priceRange: '$2,200 - $4,500/month',
  },
  'Skilled Nursing': {
    description: 'Skilled Nursing Facilities (SNFs) provide 24-hour medical care for individuals who need intensive nursing support or rehabilitation services. These facilities are staffed with registered nurses and licensed practical nurses.',
    services: [
      '24/7 nursing care and medical monitoring',
      'Physical, occupational, and speech therapy',
      'Wound care and IV therapy',
      'Post-surgery rehabilitation',
      'Long-term care for chronic conditions',
      'All meals and dietary management',
      'Social services and discharge planning',
    ],
    priceRange: '$8,000 - $12,000/month',
  },
};

// Cleveland area pricing by suburb
const CLEVELAND_PRICING = [
  { suburb: 'Beachwood', assistedLiving: '$5,800 - $7,200', memoryCare: '$6,500 - $8,500' },
  { suburb: 'Westlake', assistedLiving: '$5,200 - $6,500', memoryCare: '$6,000 - $7,800' },
  { suburb: 'Rocky River', assistedLiving: '$5,000 - $6,200', memoryCare: '$5,800 - $7,500' },
  { suburb: 'Parma', assistedLiving: '$4,200 - $5,500', memoryCare: '$5,200 - $6,800' },
  { suburb: 'Mentor', assistedLiving: '$4,500 - $5,800', memoryCare: '$5,500 - $7,000' },
  { suburb: 'Lakewood', assistedLiving: '$4,800 - $6,000', memoryCare: '$5,600 - $7,200' },
];

// Main PDF Component
export function CareGuidePDF({
  recipientName,
  email,
  assessmentData,
  matchedCommunities = [],
  generatedDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
}: CareGuidePDFProps) {
  const careTypeKey = assessmentData.recommendation.includes('Memory') 
    ? 'Memory Care' 
    : assessmentData.recommendation.includes('Assisted') 
      ? 'Assisted Living'
      : assessmentData.recommendation.includes('Independent')
        ? 'Independent Living'
        : 'Assisted Living';
  
  const careTypeInfo = CARE_TYPE_INFO[careTypeKey] || CARE_TYPE_INFO['Assisted Living'];

  return (
    <Document>
      {/* Page 1: Cover */}
      <Page size="LETTER" style={styles.coverPage}>
        <View style={styles.coverContent}>
          <Text style={styles.coverLogo}>Guide for Seniors</Text>
          <Text style={styles.coverTagline}>Cleveland&apos;s Trusted Senior Living Resource</Text>
          
          <Text style={styles.coverTitle}>Your Personalized{'\n'}Senior Living{'\n'}Care Guide</Text>
          <Text style={styles.coverSubtitle}>Expert recommendations for finding the right care in Cleveland, Ohio</Text>
          
          <Text style={styles.coverPreparedFor}>Prepared For</Text>
          <Text style={styles.coverName}>{recipientName}</Text>
        </View>
        
        <View style={styles.coverFooter}>
          <Text style={styles.coverPhone}>(216) 677-4630</Text>
          <Text style={styles.coverDate}>Generated {generatedDate}</Text>
        </View>
      </Page>

      {/* Page 2: Assessment Summary & Care Type */}
      <Page size="LETTER" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerLogo}>Guide for Seniors</Text>
          <Text style={styles.headerPage}>Page 2</Text>
        </View>

        <Text style={styles.pageTitle}>Your Assessment Summary</Text>
        
        <View style={styles.summaryBox}>
          <Text style={styles.summaryTitle}>Personalized Recommendation</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Recommended Care Type:</Text>
            <Text style={styles.summaryValue}>{careTypeKey}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Assessment Score:</Text>
            <Text style={styles.summaryValue}>{assessmentData.score}/100</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Communities Matched:</Text>
            <Text style={styles.summaryValue}>{matchedCommunities.length > 0 ? matchedCommunities.length : assessmentData.matchedCommunities.length}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Understanding {careTypeKey}</Text>
        <Text style={styles.paragraph}>{careTypeInfo.description}</Text>

        <Text style={styles.subsectionTitle}>Services Typically Included:</Text>
        {careTypeInfo.services.map((service, index) => (
          <View key={index} style={{ flexDirection: 'row', marginBottom: 4 }}>
            <Text style={styles.bulletPoint}>•</Text>
            <Text style={styles.bulletItem}>{service}</Text>
          </View>
        ))}

        <View style={styles.careTypeCard}>
          <View style={styles.careTypeHeader}>
            <View style={styles.careTypeIcon}>
              <Text style={styles.careTypeIconText}>{careTypeKey.charAt(0)}</Text>
            </View>
            <View>
              <Text style={styles.careTypeName}>{careTypeKey}</Text>
              <Text style={styles.careTypePrice}>{careTypeInfo.priceRange} in Cleveland</Text>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>© Guide for Seniors | www.guideforseniors.com</Text>
          <Text style={styles.footerPhone}>(216) 677-4630</Text>
        </View>
      </Page>

      {/* Page 3: Cleveland Pricing Overview */}
      <Page size="LETTER" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerLogo}>Guide for Seniors</Text>
          <Text style={styles.headerPage}>Page 3</Text>
        </View>

        <Text style={styles.pageTitle}>Cleveland Area Pricing Guide</Text>
        <Text style={styles.paragraph}>
          Senior living costs in Greater Cleveland are typically 5-15% below the national average, 
          making our region an excellent value for quality care. Below are current 2026 pricing ranges 
          for popular Cleveland suburbs.
        </Text>

        <View style={styles.pricingTable}>
          <View style={styles.pricingHeader}>
            <Text style={[styles.pricingHeaderCell, { width: '30%' }]}>Location</Text>
            <Text style={[styles.pricingHeaderCell, { width: '35%' }]}>Assisted Living</Text>
            <Text style={[styles.pricingHeaderCell, { width: '35%' }]}>Memory Care</Text>
          </View>
          {CLEVELAND_PRICING.map((row, index) => (
            <View key={index} style={[styles.pricingRow, index % 2 === 1 ? styles.pricingRowAlt : {}]}>
              <Text style={[styles.pricingCell, { width: '30%', fontWeight: 'bold' }]}>{row.suburb}</Text>
              <Text style={[styles.pricingCell, { width: '35%' }]}>{row.assistedLiving}</Text>
              <Text style={[styles.pricingCell, { width: '35%' }]}>{row.memoryCare}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>What&apos;s Included in Pricing</Text>
        <Text style={styles.paragraph}>
          Most communities include room and board, meals, basic utilities, housekeeping, activities, 
          and a base level of care. Additional services may include:
        </Text>
        <View style={styles.twoColumn}>
          <View style={styles.column}>
            <View style={{ flexDirection: 'row', marginBottom: 4 }}>
              <Text style={styles.bulletPoint}>•</Text>
              <Text style={styles.bulletItem}>Additional personal care</Text>
            </View>
            <View style={{ flexDirection: 'row', marginBottom: 4 }}>
              <Text style={styles.bulletPoint}>•</Text>
              <Text style={styles.bulletItem}>Incontinence supplies</Text>
            </View>
            <View style={{ flexDirection: 'row', marginBottom: 4 }}>
              <Text style={styles.bulletPoint}>•</Text>
              <Text style={styles.bulletItem}>Specialized therapies</Text>
            </View>
          </View>
          <View style={styles.column}>
            <View style={{ flexDirection: 'row', marginBottom: 4 }}>
              <Text style={styles.bulletPoint}>•</Text>
              <Text style={styles.bulletItem}>Premium room upgrades</Text>
            </View>
            <View style={{ flexDirection: 'row', marginBottom: 4 }}>
              <Text style={styles.bulletPoint}>•</Text>
              <Text style={styles.bulletItem}>Beauty/barber services</Text>
            </View>
            <View style={{ flexDirection: 'row', marginBottom: 4 }}>
              <Text style={styles.bulletPoint}>•</Text>
              <Text style={styles.bulletItem}>Private transportation</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Paying for Senior Living</Text>
        <Text style={styles.paragraph}>
          Several financial options may help cover senior living costs:
        </Text>
        <View style={{ flexDirection: 'row', marginBottom: 4 }}>
          <Text style={styles.bulletPoint}>•</Text>
          <Text style={styles.bulletItem}><Text style={{ fontWeight: 'bold' }}>Private Pay:</Text> Personal savings, retirement accounts, home equity</Text>
        </View>
        <View style={{ flexDirection: 'row', marginBottom: 4 }}>
          <Text style={styles.bulletPoint}>•</Text>
          <Text style={styles.bulletItem}><Text style={{ fontWeight: 'bold' }}>Long-Term Care Insurance:</Text> Policies that cover assisted living/memory care</Text>
        </View>
        <View style={{ flexDirection: 'row', marginBottom: 4 }}>
          <Text style={styles.bulletPoint}>•</Text>
          <Text style={styles.bulletItem}><Text style={{ fontWeight: 'bold' }}>VA Benefits:</Text> Aid & Attendance for qualifying veterans and spouses</Text>
        </View>
        <View style={{ flexDirection: 'row', marginBottom: 4 }}>
          <Text style={styles.bulletPoint}>•</Text>
          <Text style={styles.bulletItem}><Text style={{ fontWeight: 'bold' }}>Medicaid Waiver:</Text> Ohio&apos;s PASSPORT program for eligible individuals</Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>© Guide for Seniors | www.guideforseniors.com</Text>
          <Text style={styles.footerPhone}>(216) 677-4630</Text>
        </View>
      </Page>

      {/* Page 4: Matched Communities */}
      <Page size="LETTER" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerLogo}>Guide for Seniors</Text>
          <Text style={styles.headerPage}>Page 4</Text>
        </View>

        <Text style={styles.pageTitle}>Communities Matched to You</Text>
        <Text style={styles.paragraph}>
          Based on your assessment, we&apos;ve identified communities in the Cleveland area that may be 
          a good fit for your care needs. Our advisors can provide detailed information about any 
          of these communities and schedule tours.
        </Text>

        {matchedCommunities.length > 0 ? (
          matchedCommunities.slice(0, 5).map((community, index) => (
            <View key={index} style={styles.communityCard}>
              <Text style={styles.communityName}>{community.name}</Text>
              <Text style={styles.communityDetail}>{community.city}, Ohio</Text>
              <Text style={styles.communityDetail}>Care Types: {community.careTypes.join(', ')}</Text>
              {community.priceRange && (
                <Text style={styles.communityPrice}>Starting at {community.priceRange}</Text>
              )}
            </View>
          ))
        ) : (
          <>
            {assessmentData.matchedCommunities.slice(0, 5).map((name, index) => (
              <View key={index} style={styles.communityCard}>
                <Text style={styles.communityName}>{name}</Text>
                <Text style={styles.communityDetail}>Greater Cleveland Area</Text>
                <Text style={styles.communityDetail}>Care Types: {careTypeKey}</Text>
              </View>
            ))}
          </>
        )}

        <View style={styles.ctaBox}>
          <Text style={styles.ctaTitle}>Ready to Tour?</Text>
          <Text style={styles.ctaText}>
            Our local advisors can schedule complimentary tours{'\n'}
            at any of these communities on your behalf.
          </Text>
          <Text style={styles.ctaPhone}>(216) 677-4630</Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>© Guide for Seniors | www.guideforseniors.com</Text>
          <Text style={styles.footerPhone}>(216) 677-4630</Text>
        </View>
      </Page>

      {/* Page 5: Next Steps Checklist */}
      <Page size="LETTER" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerLogo}>Guide for Seniors</Text>
          <Text style={styles.headerPage}>Page 5</Text>
        </View>

        <Text style={styles.pageTitle}>Your Next Steps Checklist</Text>
        <Text style={styles.paragraph}>
          Use this checklist to guide your senior living search. Our advisors are here to help 
          at every step—all of our services are completely free to families.
        </Text>

        <Text style={styles.sectionTitle}>Before Touring</Text>
        <View style={styles.checklistItem}>
          <View style={styles.checklistBox} />
          <Text style={styles.checklistText}>Gather medical records and current medication list</Text>
        </View>
        <View style={styles.checklistItem}>
          <View style={styles.checklistBox} />
          <Text style={styles.checklistText}>Review financial options (savings, insurance, VA benefits)</Text>
        </View>
        <View style={styles.checklistItem}>
          <View style={styles.checklistBox} />
          <Text style={styles.checklistText}>Make a list of must-have amenities and preferences</Text>
        </View>
        <View style={styles.checklistItem}>
          <View style={styles.checklistBox} />
          <Text style={styles.checklistText}>Discuss care needs and concerns with family members</Text>
        </View>

        <Text style={styles.sectionTitle}>During Tours</Text>
        <View style={styles.checklistItem}>
          <View style={styles.checklistBox} />
          <Text style={styles.checklistText}>Ask about staff-to-resident ratios and staff training</Text>
        </View>
        <View style={styles.checklistItem}>
          <View style={styles.checklistBox} />
          <Text style={styles.checklistText}>Sample a meal and observe dining atmosphere</Text>
        </View>
        <View style={styles.checklistItem}>
          <View style={styles.checklistBox} />
          <Text style={styles.checklistText}>Review the activity calendar and attend an activity if possible</Text>
        </View>
        <View style={styles.checklistItem}>
          <View style={styles.checklistBox} />
          <Text style={styles.checklistText}>Talk to current residents and their families</Text>
        </View>
        <View style={styles.checklistItem}>
          <View style={styles.checklistBox} />
          <Text style={styles.checklistText}>Request a copy of the resident contract and fee schedule</Text>
        </View>

        <Text style={styles.sectionTitle}>After Tours</Text>
        <View style={styles.checklistItem}>
          <View style={styles.checklistBox} />
          <Text style={styles.checklistText}>Compare communities using notes from each tour</Text>
        </View>
        <View style={styles.checklistItem}>
          <View style={styles.checklistBox} />
          <Text style={styles.checklistText}>Check state inspection reports online</Text>
        </View>
        <View style={styles.checklistItem}>
          <View style={styles.checklistBox} />
          <Text style={styles.checklistText}>Schedule a second visit (unannounced if possible)</Text>
        </View>
        <View style={styles.checklistItem}>
          <View style={styles.checklistBox} />
          <Text style={styles.checklistText}>Contact Guide for Seniors with any questions</Text>
        </View>

        <View style={styles.ctaBox}>
          <Text style={styles.ctaTitle}>We&apos;re Here to Help</Text>
          <Text style={styles.ctaText}>
            Our Cleveland-based advisors provide free, personalized guidance{'\n'}
            throughout your entire senior living journey.
          </Text>
          <Text style={styles.ctaPhone}>(216) 677-4630</Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>© Guide for Seniors | www.guideforseniors.com</Text>
          <Text style={styles.footerPhone}>(216) 677-4630</Text>
        </View>
      </Page>
    </Document>
  );
}

export default CareGuidePDF;

