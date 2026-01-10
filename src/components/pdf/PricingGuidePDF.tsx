import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Link,
  Font,
} from '@react-pdf/renderer';

// ============================================================================
// TEXT SANITIZATION - Fix encoding artifacts and weird characters
// ============================================================================

/**
 * Sanitizes text to remove hidden characters, encoding artifacts, and normalize unicode.
 */
function sanitizeText(text: string | undefined | null): string {
  if (!text) return '';
  
  return text
    .normalize('NFKD')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014\u2015]/g, '-')
    .replace(/\u00A0/g, ' ')
    .replace(/\u2026/g, '...')
    .replace(/[\u200B\u200C\u200D\uFEFF]/g, '')
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    .replace(/  +/g, ' ')
    .trim();
}

// Phone number constant - use plain ASCII
const PHONE_NUMBER = '(216) 677-4630';
const PHONE_LINK = 'tel:+12166774630';

// Disable hyphenation for consistent text rendering
Font.registerHyphenationCallback((word) => [word]);

// Standard line heights
const LINE_HEIGHT_BODY = 1.4;
const LINE_HEIGHT_TIGHT = 1.2;
const LINE_HEIGHT_RELAXED = 1.6;

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
  coverBadge: {
    backgroundColor: '#14b8a6',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 20,
  },
  coverBadgeText: {
    fontSize: 11,
    color: '#ffffff',
    fontWeight: 'bold',
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
    marginBottom: 50,
  },
  coverTitle: {
    fontSize: 38,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 1.2,
  },
  coverYear: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#5eead4', // teal-300
    textAlign: 'center',
    marginBottom: 16,
  },
  coverSubtitle: {
    fontSize: 14,
    color: '#ccfbf1', // teal-100
    textAlign: 'center',
    marginBottom: 50,
    lineHeight: 1.5,
  },
  coverPreparedFor: {
    fontSize: 11,
    color: '#99f6e4',
    textAlign: 'center',
    marginBottom: 6,
  },
  coverName: {
    fontSize: 22,
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
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f766e',
    marginTop: 20,
    marginBottom: 10,
  },
  subsectionTitle: {
    fontSize: 13,
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
    fontSize: 10,
    color: '#475569',
    marginBottom: 4,
    paddingLeft: 12,
  },
  bulletPoint: {
    position: 'absolute',
    left: 0,
  },

  // Executive Summary Box
  executiveSummary: {
    backgroundColor: '#f0fdfa',
    borderWidth: 2,
    borderColor: '#14b8a6',
    borderRadius: 8,
    padding: 20,
    marginBottom: 20,
  },
  executiveTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f766e',
    marginBottom: 12,
  },
  keyFinding: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  keyFindingIcon: {
    width: 18,
    height: 18,
    backgroundColor: '#0f766e',
    borderRadius: 9,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyFindingCheck: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  keyFindingText: {
    fontSize: 11,
    color: '#334155',
    flex: 1,
    lineHeight: 1.4,
  },

  // Pricing Card
  pricingCard: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    marginBottom: 12,
    overflow: 'hidden',
  },
  pricingCardHeader: {
    backgroundColor: '#f8fafc',
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  pricingCardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  pricingCardPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f766e',
  },
  pricingCardBody: {
    padding: 12,
  },
  pricingCardDesc: {
    fontSize: 10,
    color: '#64748b',
    marginBottom: 8,
    lineHeight: 1.4,
  },

  // Pricing table
  pricingTable: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
  },
  pricingHeader: {
    flexDirection: 'row',
    backgroundColor: '#0f766e',
    padding: 10,
  },
  pricingHeaderCell: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  pricingRow: {
    flexDirection: 'row',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  pricingRowAlt: {
    backgroundColor: '#f8fafc',
  },
  pricingCell: {
    fontSize: 9,
    color: '#475569',
  },
  pricingCellBold: {
    fontSize: 9,
    color: '#0f172a',
    fontWeight: 'bold',
  },

  // Comparison table
  comparisonBox: {
    backgroundColor: '#fffbeb', // amber-50
    borderWidth: 1,
    borderColor: '#fcd34d', // amber-300
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  comparisonTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#92400e',
    marginBottom: 12,
  },
  comparisonRow: {
    flexDirection: 'row',
    marginBottom: 6,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#fef3c7',
  },
  comparisonLabel: {
    fontSize: 10,
    color: '#78350f',
    width: '50%',
  },
  comparisonValue: {
    fontSize: 10,
    color: '#78350f',
    fontWeight: 'bold',
    width: '25%',
    textAlign: 'center',
  },

  // Info box
  infoBox: {
    backgroundColor: '#eff6ff', // blue-50
    borderWidth: 1,
    borderColor: '#93c5fd', // blue-300
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 10,
    color: '#1e3a8a',
    lineHeight: 1.5,
  },

  // Warning box
  warningBox: {
    backgroundColor: '#fef2f2', // red-50
    borderWidth: 1,
    borderColor: '#fca5a5', // red-300
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  warningTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#b91c1c',
    marginBottom: 8,
  },

  // Checklist
  checklistItem: {
    flexDirection: 'row',
    marginBottom: 6,
    alignItems: 'flex-start',
  },
  checklistBox: {
    width: 12,
    height: 12,
    borderWidth: 1,
    borderColor: '#0f766e',
    borderRadius: 2,
    marginRight: 8,
    marginTop: 1,
  },
  checklistText: {
    fontSize: 10,
    color: '#475569',
    flex: 1,
    lineHeight: 1.4,
  },

  // CTA box
  ctaBox: {
    backgroundColor: '#0f766e',
    borderRadius: 8,
    padding: 20,
    marginTop: 'auto',
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
    gap: 16,
  },
  column: {
    flex: 1,
  },
  
  // Stat box
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statBox: {
    width: '30%',
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f766e',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 8,
    color: '#64748b',
    textAlign: 'center',
  },
});

// Types
interface PricingGuidePDFProps {
  recipientName: string;
  email: string;
  generatedDate?: string;
}

// Cleveland neighborhood pricing data - 2026
const NEIGHBORHOOD_PRICING = [
  { area: 'Beachwood / Pepper Pike', al: '$5,800 - $7,200', mc: '$6,500 - $8,500', il: '$3,200 - $4,500' },
  { area: 'Westlake / Bay Village', al: '$5,200 - $6,500', mc: '$6,000 - $7,800', il: '$2,800 - $4,200' },
  { area: 'Rocky River / Lakewood', al: '$4,800 - $6,200', mc: '$5,800 - $7,500', il: '$2,600 - $3,800' },
  { area: 'Mentor / Willoughby', al: '$4,500 - $5,800', mc: '$5,500 - $7,000', il: '$2,400 - $3,500' },
  { area: 'Parma / Seven Hills', al: '$4,200 - $5,500', mc: '$5,200 - $6,800', il: '$2,200 - $3,200' },
  { area: 'Independence / Broadview Hts', al: '$4,500 - $5,800', mc: '$5,400 - $7,000', il: '$2,500 - $3,600' },
  { area: 'Strongsville / North Royalton', al: '$4,400 - $5,600', mc: '$5,300 - $6,900', il: '$2,400 - $3,400' },
  { area: 'Avon / Avon Lake', al: '$4,600 - $5,900', mc: '$5,600 - $7,200', il: '$2,600 - $3,800' },
];

// Care type details
const CARE_TYPES = [
  {
    name: 'Memory Care',
    price: '$4,500 - $8,500/mo',
    avgPrice: '$6,200',
    description: 'Specialized 24/7 care for Alzheimer\'s and dementia with secure environments and trained staff.',
    includes: ['Secure environment', '24/7 specialized staff', 'All meals', 'Memory activities', 'Medication management', 'Personal care'],
  },
  {
    name: 'Assisted Living',
    price: '$3,200 - $6,500/mo',
    avgPrice: '$4,800',
    description: 'Help with daily activities while maintaining independence in a supportive community.',
    includes: ['Private apartment', 'Personal care help', 'Three meals daily', 'Medication reminders', 'Activities & outings', 'Housekeeping'],
  },
  {
    name: 'Independent Living',
    price: '$2,200 - $4,500/mo',
    avgPrice: '$3,200',
    description: 'Maintenance-free living for active seniors with dining and social amenities.',
    includes: ['Private apartment', 'Restaurant dining', 'Social activities', 'Housekeeping', 'Transportation', 'Fitness programs'],
  },
];

// Home care vs community comparison
const HOME_VS_COMMUNITY = [
  { item: 'Housing/Rent', home: '$1,500 - $2,500', community: 'Included' },
  { item: 'Utilities', home: '$200 - $400', community: 'Included' },
  { item: 'Food/Groceries', home: '$400 - $600', community: 'Included' },
  { item: 'Home Maintenance', home: '$200 - $500', community: 'Included' },
  { item: 'Transportation', home: '$200 - $400', community: 'Included' },
  { item: 'Home Care (20 hrs/wk)', home: '$2,000 - $3,200', community: 'Included' },
  { item: 'ESTIMATED TOTAL', home: '$4,500 - $7,600', community: '$3,200 - $6,500' },
];

// Main PDF Component
export function PricingGuidePDF({
  recipientName,
  email,
  generatedDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
}: PricingGuidePDFProps) {
  return (
    <Document>
      {/* Page 1: Cover */}
      <Page size="LETTER" style={styles.coverPage}>
        <View style={styles.coverContent}>
          <View style={styles.coverBadge}>
            <Text style={styles.coverBadgeText}>EXCLUSIVE MARKET DATA</Text>
          </View>
          
          <Text style={styles.coverLogo}>Guide for Seniors</Text>
          <Text style={styles.coverTagline}>Cleveland's Trusted Senior Living Resource</Text>
          
          <Text style={styles.coverYear}>2026</Text>
          <Text style={styles.coverTitle}>Greater Cleveland{'\n'}Senior Living{'\n'}Cost Report</Text>
          <Text style={styles.coverSubtitle}>
            Current pricing data for Assisted Living, Memory Care,{'\n'}
            and Independent Living across 20+ Cleveland neighborhoods
          </Text>
          
          <Text style={styles.coverPreparedFor}>Prepared For</Text>
          <Text style={styles.coverName}>{recipientName}</Text>
        </View>
        
        <View style={styles.coverFooter}>
          <Link src={PHONE_LINK} style={{ textDecoration: 'none' }}>
            <Text style={styles.coverPhone}>{PHONE_NUMBER}</Text>
          </Link>
          <Text style={styles.coverDate}>Generated {generatedDate}</Text>
        </View>
      </Page>

      {/* Page 2: Executive Summary */}
      <Page size="LETTER" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerLogo}>Guide for Seniors</Text>
          <Text style={styles.headerPage}>Page 2</Text>
        </View>

        <Text style={styles.pageTitle}>Executive Summary</Text>
        
        <View style={styles.executiveSummary}>
          <Text style={styles.executiveTitle}>Key Findings for 2026</Text>
          <View style={styles.keyFinding}>
            <View style={styles.keyFindingIcon}>
              <Text style={styles.keyFindingCheck}>✓</Text>
            </View>
            <Text style={styles.keyFindingText}>
              Cleveland senior living costs are <Text style={{ fontWeight: 'bold' }}>5-15% below the national average</Text>, making it one of the most affordable metro areas for quality care.
            </Text>
          </View>
          <View style={styles.keyFinding}>
            <View style={styles.keyFindingIcon}>
              <Text style={styles.keyFindingCheck}>✓</Text>
            </View>
            <Text style={styles.keyFindingText}>
              Average assisted living cost in Cleveland: <Text style={{ fontWeight: 'bold' }}>$4,800/month</Text> vs. national average of $5,350/month.
            </Text>
          </View>
          <View style={styles.keyFinding}>
            <View style={styles.keyFindingIcon}>
              <Text style={styles.keyFindingCheck}>✓</Text>
            </View>
            <Text style={styles.keyFindingText}>
              Prices vary by <Text style={{ fontWeight: 'bold' }}>up to 40%</Text> depending on neighborhood—Beachwood commands the highest rates; Parma offers the most value.
            </Text>
          </View>
          <View style={styles.keyFinding}>
            <View style={styles.keyFindingIcon}>
              <Text style={styles.keyFindingCheck}>✓</Text>
            </View>
            <Text style={styles.keyFindingText}>
              All-inclusive senior living is often <Text style={{ fontWeight: 'bold' }}>more affordable than staying home</Text> when factoring in home care, meals, utilities, and maintenance.
            </Text>
          </View>
        </View>

        <View style={styles.statRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>$4,800</Text>
            <Text style={styles.statLabel}>AVG. ASSISTED{'\n'}LIVING/MONTH</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>$6,200</Text>
            <Text style={styles.statLabel}>AVG. MEMORY{'\n'}CARE/MONTH</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>$3,200</Text>
            <Text style={styles.statLabel}>AVG. INDEPENDENT{'\n'}LIVING/MONTH</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>What's in This Report</Text>
        <Text style={styles.paragraph}>
          This comprehensive guide provides everything you need to understand and plan for senior living costs in Greater Cleveland:
        </Text>
        <View style={{ flexDirection: 'row', marginBottom: 4 }}>
          <Text style={styles.bulletPoint}>•</Text>
          <Text style={styles.bulletItem}>2026 pricing by care type (Memory Care, Assisted Living, Independent Living)</Text>
        </View>
        <View style={{ flexDirection: 'row', marginBottom: 4 }}>
          <Text style={styles.bulletPoint}>•</Text>
          <Text style={styles.bulletItem}>Neighborhood-by-neighborhood cost breakdown</Text>
        </View>
        <View style={{ flexDirection: 'row', marginBottom: 4 }}>
          <Text style={styles.bulletPoint}>•</Text>
          <Text style={styles.bulletItem}>Home care vs. community living comparison</Text>
        </View>
        <View style={{ flexDirection: 'row', marginBottom: 4 }}>
          <Text style={styles.bulletPoint}>•</Text>
          <Text style={styles.bulletItem}>Hidden costs checklist and what's NOT included</Text>
        </View>
        <View style={{ flexDirection: 'row', marginBottom: 4 }}>
          <Text style={styles.bulletPoint}>•</Text>
          <Text style={styles.bulletItem}>Financial assistance programs available in Ohio</Text>
        </View>
        <View style={{ flexDirection: 'row', marginBottom: 4 }}>
          <Text style={styles.bulletPoint}>•</Text>
          <Text style={styles.bulletItem}>Questions to ask communities about pricing</Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2026 Guide for Seniors | www.guideforseniors.com</Text>
          <Link src={PHONE_LINK}>
            <Text style={styles.footerPhone}>{PHONE_NUMBER}</Text>
          </Link>
        </View>
      </Page>

      {/* Page 3: Pricing by Care Type */}
      <Page size="LETTER" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerLogo}>Guide for Seniors</Text>
          <Text style={styles.headerPage}>Page 3</Text>
        </View>

        <Text style={styles.pageTitle}>2026 Pricing by Care Type</Text>
        <Text style={styles.paragraph}>
          Understanding the different levels of senior care helps you budget appropriately. Here's what each care type costs in Greater Cleveland:
        </Text>

        {CARE_TYPES.map((care, index) => (
          <View key={index} style={styles.pricingCard}>
            <View style={styles.pricingCardHeader}>
              <Text style={styles.pricingCardTitle}>{care.name}</Text>
              <Text style={styles.pricingCardPrice}>{care.price}</Text>
            </View>
            <View style={styles.pricingCardBody}>
              <Text style={styles.pricingCardDesc}>{care.description}</Text>
              <Text style={{ fontSize: 9, fontWeight: 'bold', color: '#334155', marginBottom: 4 }}>Typically Includes:</Text>
              <View style={styles.twoColumn}>
                <View style={styles.column}>
                  {care.includes.slice(0, 3).map((item, i) => (
                    <View key={i} style={{ flexDirection: 'row', marginBottom: 2 }}>
                      <Text style={{ fontSize: 9, color: '#0f766e', marginRight: 4 }}>✓</Text>
                      <Text style={{ fontSize: 9, color: '#475569' }}>{item}</Text>
                    </View>
                  ))}
                </View>
                <View style={styles.column}>
                  {care.includes.slice(3, 6).map((item, i) => (
                    <View key={i} style={{ flexDirection: 'row', marginBottom: 2 }}>
                      <Text style={{ fontSize: 9, color: '#0f766e', marginRight: 4 }}>✓</Text>
                      <Text style={{ fontSize: 9, color: '#475569' }}>{item}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </View>
        ))}

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>💡 Pro Tip: Level of Care Fees</Text>
          <Text style={styles.infoText}>
            Most communities charge a "base rate" plus additional fees based on care needs. Someone requiring more help with bathing, dressing, or mobility may pay $500-$1,500 more per month. Always ask for a full care assessment before signing.
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2026 Guide for Seniors | www.guideforseniors.com</Text>
          <Link src={PHONE_LINK}>
            <Text style={styles.footerPhone}>{PHONE_NUMBER}</Text>
          </Link>
        </View>
      </Page>

      {/* Page 4: Pricing by Neighborhood */}
      <Page size="LETTER" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerLogo}>Guide for Seniors</Text>
          <Text style={styles.headerPage}>Page 4</Text>
        </View>

        <Text style={styles.pageTitle}>Pricing by Neighborhood</Text>
        <Text style={styles.paragraph}>
          Location significantly impacts senior living costs. Upscale suburbs like Beachwood typically cost more than communities in Parma or Seven Hills. Here's the 2026 pricing breakdown:
        </Text>

        <View style={styles.pricingTable}>
          <View style={styles.pricingHeader}>
            <Text style={[styles.pricingHeaderCell, { width: '28%' }]}>Neighborhood</Text>
            <Text style={[styles.pricingHeaderCell, { width: '24%' }]}>Assisted Living</Text>
            <Text style={[styles.pricingHeaderCell, { width: '24%' }]}>Memory Care</Text>
            <Text style={[styles.pricingHeaderCell, { width: '24%' }]}>Independent</Text>
          </View>
          {NEIGHBORHOOD_PRICING.map((row, index) => (
            <View key={index} style={[styles.pricingRow, index % 2 === 1 ? styles.pricingRowAlt : {}]}>
              <Text style={[styles.pricingCellBold, { width: '28%' }]}>{row.area}</Text>
              <Text style={[styles.pricingCell, { width: '24%' }]}>{row.al}</Text>
              <Text style={[styles.pricingCell, { width: '24%' }]}>{row.mc}</Text>
              <Text style={[styles.pricingCell, { width: '24%' }]}>{row.il}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Why Prices Vary by Location</Text>
        <View style={styles.twoColumn}>
          <View style={styles.column}>
            <Text style={styles.subsectionTitle}>Higher-Priced Areas</Text>
            <View style={{ flexDirection: 'row', marginBottom: 3 }}>
              <Text style={styles.bulletPoint}>•</Text>
              <Text style={styles.bulletItem}>Newer, more upscale facilities</Text>
            </View>
            <View style={{ flexDirection: 'row', marginBottom: 3 }}>
              <Text style={styles.bulletPoint}>•</Text>
              <Text style={styles.bulletItem}>Premium amenities (pools, spas)</Text>
            </View>
            <View style={{ flexDirection: 'row', marginBottom: 3 }}>
              <Text style={styles.bulletPoint}>•</Text>
              <Text style={styles.bulletItem}>Higher real estate costs</Text>
            </View>
            <View style={{ flexDirection: 'row', marginBottom: 3 }}>
              <Text style={styles.bulletPoint}>•</Text>
              <Text style={styles.bulletItem}>More competitive wages</Text>
            </View>
          </View>
          <View style={styles.column}>
            <Text style={styles.subsectionTitle}>Value-Priced Areas</Text>
            <View style={{ flexDirection: 'row', marginBottom: 3 }}>
              <Text style={styles.bulletPoint}>•</Text>
              <Text style={styles.bulletItem}>Often same quality of care</Text>
            </View>
            <View style={{ flexDirection: 'row', marginBottom: 3 }}>
              <Text style={styles.bulletPoint}>•</Text>
              <Text style={styles.bulletItem}>Established communities</Text>
            </View>
            <View style={{ flexDirection: 'row', marginBottom: 3 }}>
              <Text style={styles.bulletPoint}>•</Text>
              <Text style={styles.bulletItem}>More familiar surroundings</Text>
            </View>
            <View style={{ flexDirection: 'row', marginBottom: 3 }}>
              <Text style={styles.bulletPoint}>•</Text>
              <Text style={styles.bulletItem}>Lower cost of living</Text>
            </View>
          </View>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>🎯 Our Recommendation</Text>
          <Text style={styles.infoText}>
            Don't choose solely based on price. The best value comes from finding a community that matches your specific care needs, preferred location, and budget. A slightly higher-priced community might include services that would cost extra elsewhere.
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2026 Guide for Seniors | www.guideforseniors.com</Text>
          <Link src={PHONE_LINK}>
            <Text style={styles.footerPhone}>{PHONE_NUMBER}</Text>
          </Link>
        </View>
      </Page>

      {/* Page 5: Home Care vs Community Comparison */}
      <Page size="LETTER" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerLogo}>Guide for Seniors</Text>
          <Text style={styles.headerPage}>Page 5</Text>
        </View>

        <Text style={styles.pageTitle}>Home Care vs. Community Living</Text>
        <Text style={styles.paragraph}>
          Many families assume staying home with hired caregivers is more affordable than senior living communities. The reality often surprises them. Here's a true cost comparison:
        </Text>

        <View style={styles.comparisonBox}>
          <Text style={styles.comparisonTitle}>Monthly Cost Comparison</Text>
          <View style={[styles.comparisonRow, { borderBottomWidth: 2, borderBottomColor: '#f59e0b' }]}>
            <Text style={[styles.comparisonLabel, { fontWeight: 'bold' }]}>EXPENSE</Text>
            <Text style={[styles.comparisonValue, { fontWeight: 'bold' }]}>AT HOME</Text>
            <Text style={[styles.comparisonValue, { fontWeight: 'bold' }]}>COMMUNITY</Text>
          </View>
          {HOME_VS_COMMUNITY.map((row, index) => (
            <View key={index} style={[styles.comparisonRow, index === HOME_VS_COMMUNITY.length - 1 ? { borderBottomWidth: 0, backgroundColor: '#fef3c7', marginHorizontal: -16, paddingHorizontal: 16, marginBottom: -6, paddingBottom: 10, marginTop: 6, paddingTop: 10, borderRadius: 4 } : {}]}>
              <Text style={[styles.comparisonLabel, index === HOME_VS_COMMUNITY.length - 1 ? { fontWeight: 'bold' } : {}]}>{row.item}</Text>
              <Text style={styles.comparisonValue}>{row.home}</Text>
              <Text style={[styles.comparisonValue, { color: '#0f766e' }]}>{row.community}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Hidden Costs of Staying Home</Text>
        <View style={styles.twoColumn}>
          <View style={styles.column}>
            <View style={{ flexDirection: 'row', marginBottom: 4 }}>
              <Text style={styles.bulletPoint}>•</Text>
              <Text style={styles.bulletItem}>Home modifications (ramps, grab bars, stair lifts)</Text>
            </View>
            <View style={{ flexDirection: 'row', marginBottom: 4 }}>
              <Text style={styles.bulletPoint}>•</Text>
              <Text style={styles.bulletItem}>Emergency response systems</Text>
            </View>
            <View style={{ flexDirection: 'row', marginBottom: 4 }}>
              <Text style={styles.bulletPoint}>•</Text>
              <Text style={styles.bulletItem}>Backup caregivers for time off</Text>
            </View>
          </View>
          <View style={styles.column}>
            <View style={{ flexDirection: 'row', marginBottom: 4 }}>
              <Text style={styles.bulletPoint}>•</Text>
              <Text style={styles.bulletItem}>Social isolation and loneliness</Text>
            </View>
            <View style={{ flexDirection: 'row', marginBottom: 4 }}>
              <Text style={styles.bulletPoint}>•</Text>
              <Text style={styles.bulletItem}>Family caregiver burnout</Text>
            </View>
            <View style={{ flexDirection: 'row', marginBottom: 4 }}>
              <Text style={styles.bulletPoint}>•</Text>
              <Text style={styles.bulletItem}>Lack of 24/7 supervision</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Benefits of Community Living</Text>
        <View style={styles.twoColumn}>
          <View style={styles.column}>
            <View style={{ flexDirection: 'row', marginBottom: 4 }}>
              <Text style={{ fontSize: 9, color: '#0f766e', marginRight: 4 }}>✓</Text>
              <Text style={styles.bulletItem}>24/7 staff availability</Text>
            </View>
            <View style={{ flexDirection: 'row', marginBottom: 4 }}>
              <Text style={{ fontSize: 9, color: '#0f766e', marginRight: 4 }}>✓</Text>
              <Text style={styles.bulletItem}>Nutritious meals prepared daily</Text>
            </View>
            <View style={{ flexDirection: 'row', marginBottom: 4 }}>
              <Text style={{ fontSize: 9, color: '#0f766e', marginRight: 4 }}>✓</Text>
              <Text style={styles.bulletItem}>Social activities and companionship</Text>
            </View>
            <View style={{ flexDirection: 'row', marginBottom: 4 }}>
              <Text style={{ fontSize: 9, color: '#0f766e', marginRight: 4 }}>✓</Text>
              <Text style={styles.bulletItem}>Transportation included</Text>
            </View>
          </View>
          <View style={styles.column}>
            <View style={{ flexDirection: 'row', marginBottom: 4 }}>
              <Text style={{ fontSize: 9, color: '#0f766e', marginRight: 4 }}>✓</Text>
              <Text style={styles.bulletItem}>No home maintenance worries</Text>
            </View>
            <View style={{ flexDirection: 'row', marginBottom: 4 }}>
              <Text style={{ fontSize: 9, color: '#0f766e', marginRight: 4 }}>✓</Text>
              <Text style={styles.bulletItem}>Emergency response on-site</Text>
            </View>
            <View style={{ flexDirection: 'row', marginBottom: 4 }}>
              <Text style={{ fontSize: 9, color: '#0f766e', marginRight: 4 }}>✓</Text>
              <Text style={styles.bulletItem}>Peace of mind for family</Text>
            </View>
            <View style={{ flexDirection: 'row', marginBottom: 4 }}>
              <Text style={{ fontSize: 9, color: '#0f766e', marginRight: 4 }}>✓</Text>
              <Text style={styles.bulletItem}>Predictable monthly costs</Text>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2026 Guide for Seniors | www.guideforseniors.com</Text>
          <Link src={PHONE_LINK}>
            <Text style={styles.footerPhone}>{PHONE_NUMBER}</Text>
          </Link>
        </View>
      </Page>

      {/* Page 6: Hidden Costs & What's NOT Included */}
      <Page size="LETTER" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerLogo}>Guide for Seniors</Text>
          <Text style={styles.headerPage}>Page 6</Text>
        </View>

        <Text style={styles.pageTitle}>Hidden Costs Checklist</Text>
        <Text style={styles.paragraph}>
          Before signing a contract, make sure you understand ALL the costs. Here's what to ask about:
        </Text>

        <View style={styles.warningBox}>
          <Text style={styles.warningTitle}>⚠️ Costs NOT Typically Included in Base Rate</Text>
          <View style={styles.twoColumn}>
            <View style={styles.column}>
              <View style={styles.checklistItem}>
                <View style={styles.checklistBox} />
                <Text style={styles.checklistText}>Level of care increases ($500-$1,500+/mo)</Text>
              </View>
              <View style={styles.checklistItem}>
                <View style={styles.checklistBox} />
                <Text style={styles.checklistText}>Medication management fees</Text>
              </View>
              <View style={styles.checklistItem}>
                <View style={styles.checklistBox} />
                <Text style={styles.checklistText}>Incontinence supplies</Text>
              </View>
              <View style={styles.checklistItem}>
                <View style={styles.checklistBox} />
                <Text style={styles.checklistText}>Beauty/barber services</Text>
              </View>
              <View style={styles.checklistItem}>
                <View style={styles.checklistBox} />
                <Text style={styles.checklistText}>Cable TV and phone</Text>
              </View>
            </View>
            <View style={styles.column}>
              <View style={styles.checklistItem}>
                <View style={styles.checklistBox} />
                <Text style={styles.checklistText}>Guest meals ($8-$15 each)</Text>
              </View>
              <View style={styles.checklistItem}>
                <View style={styles.checklistBox} />
                <Text style={styles.checklistText}>Physical/occupational therapy</Text>
              </View>
              <View style={styles.checklistItem}>
                <View style={styles.checklistBox} />
                <Text style={styles.checklistText}>Private transportation</Text>
              </View>
              <View style={styles.checklistItem}>
                <View style={styles.checklistBox} />
                <Text style={styles.checklistText}>Pet deposits/fees</Text>
              </View>
              <View style={styles.checklistItem}>
                <View style={styles.checklistBox} />
                <Text style={styles.checklistText}>Second occupant fees</Text>
              </View>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>One-Time Fees to Ask About</Text>
        <View style={styles.twoColumn}>
          <View style={styles.column}>
            <View style={styles.checklistItem}>
              <View style={styles.checklistBox} />
              <Text style={styles.checklistText}>Community fee ($2,000-$5,000)</Text>
            </View>
            <View style={styles.checklistItem}>
              <View style={styles.checklistBox} />
              <Text style={styles.checklistText}>Move-in deposit (1 month typical)</Text>
            </View>
          </View>
          <View style={styles.column}>
            <View style={styles.checklistItem}>
              <View style={styles.checklistBox} />
              <Text style={styles.checklistText}>Application/assessment fee</Text>
            </View>
            <View style={styles.checklistItem}>
              <View style={styles.checklistBox} />
              <Text style={styles.checklistText}>Refund policy if moving out</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Questions to Ask About Pricing</Text>
        <View style={styles.checklistItem}>
          <View style={styles.checklistBox} />
          <Text style={styles.checklistText}>"What is included in the base monthly rate?"</Text>
        </View>
        <View style={styles.checklistItem}>
          <View style={styles.checklistBox} />
          <Text style={styles.checklistText}>"How are care level increases determined and priced?"</Text>
        </View>
        <View style={styles.checklistItem}>
          <View style={styles.checklistBox} />
          <Text style={styles.checklistText}>"What was your last rate increase and when?"</Text>
        </View>
        <View style={styles.checklistItem}>
          <View style={styles.checklistBox} />
          <Text style={styles.checklistText}>"Is there a community fee? Is any portion refundable?"</Text>
        </View>
        <View style={styles.checklistItem}>
          <View style={styles.checklistBox} />
          <Text style={styles.checklistText}>"What is your notice period and refund policy?"</Text>
        </View>
        <View style={styles.checklistItem}>
          <View style={styles.checklistBox} />
          <Text style={styles.checklistText}>"Do you accept Medicaid waiver? If so, after how long?"</Text>
        </View>
        <View style={styles.checklistItem}>
          <View style={styles.checklistBox} />
          <Text style={styles.checklistText}>"Can you provide a complete fee schedule in writing?"</Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>💡 Request Everything in Writing</Text>
          <Text style={styles.infoText}>
            Before signing any contract, request a complete written breakdown of all fees, including the base rate, care level pricing, and any additional charges. Compare apples-to-apples across communities.
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2026 Guide for Seniors | www.guideforseniors.com</Text>
          <Link src={PHONE_LINK}>
            <Text style={styles.footerPhone}>{PHONE_NUMBER}</Text>
          </Link>
        </View>
      </Page>

      {/* Page 7: Financial Assistance */}
      <Page size="LETTER" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerLogo}>Guide for Seniors</Text>
          <Text style={styles.headerPage}>Page 7</Text>
        </View>

        <Text style={styles.pageTitle}>Financial Assistance Programs</Text>
        <Text style={styles.paragraph}>
          Several programs can help Ohio families afford senior living. Here are the most common options:
        </Text>

        <Text style={styles.sectionTitle}>Veterans Benefits</Text>
        <View style={styles.pricingCard}>
          <View style={styles.pricingCardHeader}>
            <Text style={styles.pricingCardTitle}>VA Aid & Attendance</Text>
            <Text style={styles.pricingCardPrice}>Up to $2,727/mo</Text>
          </View>
          <View style={styles.pricingCardBody}>
            <Text style={styles.pricingCardDesc}>
              Tax-free benefit for veterans and surviving spouses who need help with daily activities. Can be used for assisted living, memory care, or in-home care.
            </Text>
            <Text style={{ fontSize: 9, fontWeight: 'bold', color: '#334155', marginTop: 4 }}>
              2026 Maximum Monthly Benefits:
            </Text>
            <View style={{ flexDirection: 'row', marginTop: 4 }}>
              <Text style={{ fontSize: 9, color: '#475569', width: '50%' }}>• Veteran with spouse: $2,727</Text>
              <Text style={{ fontSize: 9, color: '#475569', width: '50%' }}>• Single veteran: $2,295</Text>
            </View>
            <View style={{ flexDirection: 'row', marginTop: 2 }}>
              <Text style={{ fontSize: 9, color: '#475569', width: '50%' }}>• Surviving spouse: $1,478</Text>
              <Text style={{ fontSize: 9, color: '#475569', width: '50%' }}>• Veteran couple: $2,727</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Ohio Medicaid Programs</Text>
        <View style={styles.pricingCard}>
          <View style={styles.pricingCardHeader}>
            <Text style={styles.pricingCardTitle}>PASSPORT Waiver Program</Text>
            <Text style={styles.pricingCardPrice}>Income-Based</Text>
          </View>
          <View style={styles.pricingCardBody}>
            <Text style={styles.pricingCardDesc}>
              Ohio's home and community-based waiver that helps seniors pay for assisted living, home care, and adult day services. Available to those who meet nursing home level of care requirements.
            </Text>
          </View>
        </View>

        <View style={styles.pricingCard}>
          <View style={styles.pricingCardHeader}>
            <Text style={styles.pricingCardTitle}>Assisted Living Waiver</Text>
            <Text style={styles.pricingCardPrice}>Income-Based</Text>
          </View>
          <View style={styles.pricingCardBody}>
            <Text style={styles.pricingCardDesc}>
              Covers room, board, and personal care in participating assisted living communities. Resident pays a portion based on income; Medicaid covers the rest.
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Private Pay Options</Text>
        <View style={styles.twoColumn}>
          <View style={styles.column}>
            <View style={{ flexDirection: 'row', marginBottom: 4 }}>
              <Text style={styles.bulletPoint}>•</Text>
              <Text style={styles.bulletItem}>Retirement savings (401k, IRA)</Text>
            </View>
            <View style={{ flexDirection: 'row', marginBottom: 4 }}>
              <Text style={styles.bulletPoint}>•</Text>
              <Text style={styles.bulletItem}>Long-term care insurance</Text>
            </View>
            <View style={{ flexDirection: 'row', marginBottom: 4 }}>
              <Text style={styles.bulletPoint}>•</Text>
              <Text style={styles.bulletItem}>Life insurance conversion</Text>
            </View>
          </View>
          <View style={styles.column}>
            <View style={{ flexDirection: 'row', marginBottom: 4 }}>
              <Text style={styles.bulletPoint}>•</Text>
              <Text style={styles.bulletItem}>Home equity (sale or HELOC)</Text>
            </View>
            <View style={{ flexDirection: 'row', marginBottom: 4 }}>
              <Text style={styles.bulletPoint}>•</Text>
              <Text style={styles.bulletItem}>Reverse mortgage</Text>
            </View>
            <View style={{ flexDirection: 'row', marginBottom: 4 }}>
              <Text style={styles.bulletPoint}>•</Text>
              <Text style={styles.bulletItem}>Family contributions</Text>
            </View>
          </View>
        </View>

        <View style={styles.ctaBox}>
          <Text style={styles.ctaTitle}>Need Help with Financing?</Text>
          <Text style={styles.ctaText}>
            Our advisors can help you understand your options and{'\n'}
            connect you with financial planning resources.
          </Text>
          <Link src={PHONE_LINK}>
            <Text style={styles.ctaPhone}>{PHONE_NUMBER}</Text>
          </Link>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2026 Guide for Seniors | www.guideforseniors.com</Text>
          <Link src={PHONE_LINK}>
            <Text style={styles.footerPhone}>{PHONE_NUMBER}</Text>
          </Link>
        </View>
      </Page>

      {/* Page 8: Next Steps */}
      <Page size="LETTER" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerLogo}>Guide for Seniors</Text>
          <Text style={styles.headerPage}>Page 8</Text>
        </View>

        <Text style={styles.pageTitle}>Your Next Steps</Text>
        <Text style={styles.paragraph}>
          Now that you understand Cleveland senior living costs, here's how to move forward with confidence:
        </Text>

        <View style={styles.executiveSummary}>
          <Text style={styles.executiveTitle}>Recommended Action Plan</Text>
          <View style={styles.checklistItem}>
            <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#0f766e', marginRight: 10 }}>1</Text>
            <Text style={[styles.checklistText, { fontSize: 11 }]}>
              <Text style={{ fontWeight: 'bold' }}>Assess your budget</Text> - Review this guide's pricing data against your financial resources
            </Text>
          </View>
          <View style={styles.checklistItem}>
            <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#0f766e', marginRight: 10 }}>2</Text>
            <Text style={[styles.checklistText, { fontSize: 11 }]}>
              <Text style={{ fontWeight: 'bold' }}>Identify care needs</Text> - Consider taking our free online assessment at guideforseniors.com/assessment
            </Text>
          </View>
          <View style={styles.checklistItem}>
            <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#0f766e', marginRight: 10 }}>3</Text>
            <Text style={[styles.checklistText, { fontSize: 11 }]}>
              <Text style={{ fontWeight: 'bold' }}>Explore financial options</Text> - Check eligibility for VA benefits or Ohio Medicaid programs
            </Text>
          </View>
          <View style={styles.checklistItem}>
            <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#0f766e', marginRight: 10 }}>4</Text>
            <Text style={[styles.checklistText, { fontSize: 11 }]}>
              <Text style={{ fontWeight: 'bold' }}>Schedule tours</Text> - Visit 3-5 communities that fit your budget and location preferences
            </Text>
          </View>
          <View style={styles.checklistItem}>
            <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#0f766e', marginRight: 10 }}>5</Text>
            <Text style={[styles.checklistText, { fontSize: 11 }]}>
              <Text style={{ fontWeight: 'bold' }}>Call Guide for Seniors</Text> - Get free, personalized recommendations from a local expert
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Why Work with Guide for Seniors?</Text>
        <View style={styles.twoColumn}>
          <View style={styles.column}>
            <View style={{ flexDirection: 'row', marginBottom: 6 }}>
              <Text style={{ fontSize: 10, color: '#0f766e', marginRight: 6 }}>✓</Text>
              <Text style={styles.bulletItem}><Text style={{ fontWeight: 'bold' }}>100% Free</Text> - Our services cost you nothing</Text>
            </View>
            <View style={{ flexDirection: 'row', marginBottom: 6 }}>
              <Text style={{ fontSize: 10, color: '#0f766e', marginRight: 6 }}>✓</Text>
              <Text style={styles.bulletItem}><Text style={{ fontWeight: 'bold' }}>Local Experts</Text> - We know Cleveland communities personally</Text>
            </View>
            <View style={{ flexDirection: 'row', marginBottom: 6 }}>
              <Text style={{ fontSize: 10, color: '#0f766e', marginRight: 6 }}>✓</Text>
              <Text style={styles.bulletItem}><Text style={{ fontWeight: 'bold' }}>Unbiased</Text> - We recommend what's best for you</Text>
            </View>
          </View>
          <View style={styles.column}>
            <View style={{ flexDirection: 'row', marginBottom: 6 }}>
              <Text style={{ fontSize: 10, color: '#0f766e', marginRight: 6 }}>✓</Text>
              <Text style={styles.bulletItem}><Text style={{ fontWeight: 'bold' }}>Tour Scheduling</Text> - We handle all the logistics</Text>
            </View>
            <View style={{ flexDirection: 'row', marginBottom: 6 }}>
              <Text style={{ fontSize: 10, color: '#0f766e', marginRight: 6 }}>✓</Text>
              <Text style={styles.bulletItem}><Text style={{ fontWeight: 'bold' }}>Price Negotiation</Text> - We know what communities can offer</Text>
            </View>
            <View style={{ flexDirection: 'row', marginBottom: 6 }}>
              <Text style={{ fontSize: 10, color: '#0f766e', marginRight: 6 }}>✓</Text>
              <Text style={styles.bulletItem}><Text style={{ fontWeight: 'bold' }}>Ongoing Support</Text> - We're here through the entire journey</Text>
            </View>
          </View>
        </View>

        <View style={[styles.ctaBox, { marginTop: 30 }]}>
          <Text style={styles.ctaTitle}>Ready to Get Started?</Text>
          <Text style={styles.ctaText}>
            Call us today for a free consultation. We'll discuss your needs,{'\n'}
            budget, and recommend communities that are the right fit.
          </Text>
          <Link src={PHONE_LINK}>
            <Text style={styles.ctaPhone}>{PHONE_NUMBER}</Text>
          </Link>
          <Text style={{ fontSize: 10, color: '#99f6e4', marginTop: 8 }}>www.guideforseniors.com</Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2026 Guide for Seniors | www.guideforseniors.com</Text>
          <Link src={PHONE_LINK}>
            <Text style={styles.footerPhone}>{PHONE_NUMBER}</Text>
          </Link>
        </View>
      </Page>
    </Document>
  );
}

export default PricingGuidePDF;
