import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Link,
  Svg,
  Rect,
  Path,
} from '@react-pdf/renderer';

// ============================================================================
// BOUTIQUE MEDICAL CONCIERGE - CARE GUIDE PDF
// Premium design for Cleveland families seeking senior care guidance
// ============================================================================

// Brand Colors - Boutique Medical Concierge Palette
const COLORS = {
  navy: '#001F3F',        // Primary - Headers, key text
  navyLight: '#0A3055',   // Secondary navy
  sage: '#8DA399',        // Accent - CTAs, checkboxes
  sageLight: '#B5C9BC',   // Light sage for backgrounds
  sageDark: '#6B8574',    // Dark sage for contrast
  white: '#FFFFFF',
  cream: '#FAFBFA',       // Off-white for cards
  warmGray: '#F5F5F3',    // Warm background
  textPrimary: '#1A1A2E', // Body text
  textSecondary: '#4A5568', // Secondary text
  gold: '#C9A227',        // Premium accent
  goldLight: '#F5E6B3',   // Light gold for badges
  red: '#C53030',         // Warning/red flags
  redLight: '#FED7D7',    // Light red background
};

// Styles matching the boutique aesthetic
const styles = StyleSheet.create({
  // ===== PAGE LAYOUTS =====
  page: {
    flexDirection: 'column',
    backgroundColor: COLORS.white,
    padding: 40,
    fontFamily: 'Helvetica',
  },
  coverPage: {
    flexDirection: 'column',
    backgroundColor: COLORS.navy,
    padding: 0,
    fontFamily: 'Helvetica',
  },

  // ===== COVER PAGE =====
  coverContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 50,
  },
  coverBadge: {
    backgroundColor: COLORS.sage,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 30,
  },
  coverBadgeText: {
    fontSize: 10,
    color: COLORS.white,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  coverLogo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 6,
  },
  coverTagline: {
    fontSize: 12,
    color: COLORS.sageLight,
    marginBottom: 50,
    letterSpacing: 0.5,
  },
  coverTitle: {
    fontSize: 42,
    fontWeight: 'bold',
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 1.2,
  },
  coverSubtitle: {
    fontSize: 14,
    color: COLORS.sageLight,
    textAlign: 'center',
    marginBottom: 50,
    lineHeight: 1.5,
  },
  coverPreparedFor: {
    fontSize: 11,
    color: COLORS.sage,
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 1,
  },
  coverName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.white,
    textAlign: 'center',
  },
  coverFooter: {
    backgroundColor: COLORS.navyLight,
    padding: 24,
    alignItems: 'center',
    borderTopWidth: 3,
    borderTopColor: COLORS.sage,
  },
  coverPhone: {
    fontSize: 16,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  coverDate: {
    fontSize: 10,
    color: COLORS.sageLight,
    marginTop: 4,
  },

  // ===== HEADER & FOOTER =====
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.navy,
  },
  headerLogo: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.navy,
  },
  headerPage: {
    fontSize: 10,
    color: COLORS.textSecondary,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.sageLight,
  },
  footerText: {
    fontSize: 9,
    color: COLORS.textSecondary,
  },
  footerPhone: {
    fontSize: 10,
    color: COLORS.navy,
    fontWeight: 'bold',
  },

  // ===== TYPOGRAPHY =====
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.navy,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.navy,
    marginTop: 20,
    marginBottom: 12,
  },
  subsectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginTop: 12,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 11,
    color: COLORS.textSecondary,
    lineHeight: 1.7,
    marginBottom: 12,
  },
  bodyText: {
    fontSize: 11,
    color: COLORS.textPrimary,
    lineHeight: 1.6,
  },

  // ===== PREMIUM CARDS =====
  premiumCard: {
    backgroundColor: COLORS.cream,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.sageLight,
  },
  premiumCardHighlight: {
    backgroundColor: COLORS.warmGray,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: COLORS.sage,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardIcon: {
    width: 40,
    height: 40,
    backgroundColor: COLORS.navy,
    borderRadius: 20,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardIconText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.navy,
  },
  cardSubtitle: {
    fontSize: 11,
    color: COLORS.sage,
    marginTop: 2,
  },

  // ===== ASSESSMENT NARRATIVE =====
  narrativeBox: {
    backgroundColor: COLORS.navy,
    borderRadius: 12,
    padding: 24,
    marginBottom: 20,
  },
  narrativeQuote: {
    fontSize: 13,
    color: COLORS.white,
    fontStyle: 'italic',
    lineHeight: 1.6,
    marginBottom: 12,
  },
  narrativeAttribution: {
    fontSize: 10,
    color: COLORS.sageLight,
    textAlign: 'right',
  },

  // ===== CALLOUT BOX =====
  calloutBox: {
    backgroundColor: COLORS.goldLight,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.gold,
  },
  calloutTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.navy,
    marginBottom: 6,
  },
  calloutText: {
    fontSize: 10,
    color: COLORS.textPrimary,
    lineHeight: 1.5,
  },

  // ===== INFO BOX =====
  infoBox: {
    backgroundColor: '#EBF8FF',
    borderRadius: 8,
    padding: 14,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#3182CE',
  },
  infoTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#2C5282',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 10,
    color: '#2D3748',
    lineHeight: 1.5,
  },

  // ===== WARNING/RED FLAG BOX =====
  redFlagBox: {
    backgroundColor: COLORS.redLight,
    borderRadius: 10,
    padding: 18,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: COLORS.red,
  },
  redFlagHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  redFlagIcon: {
    width: 28,
    height: 28,
    backgroundColor: COLORS.red,
    borderRadius: 14,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  redFlagIconText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  redFlagTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.red,
  },
  redFlagItem: {
    marginBottom: 10,
    paddingLeft: 4,
  },
  redFlagItemTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  redFlagItemText: {
    fontSize: 10,
    color: COLORS.textSecondary,
    lineHeight: 1.4,
  },

  // ===== PRICING TABLE =====
  pricingTable: {
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.sageLight,
  },
  pricingHeader: {
    flexDirection: 'row',
    backgroundColor: COLORS.navy,
    padding: 12,
  },
  pricingHeaderCell: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  pricingRow: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.sageLight,
  },
  pricingRowAlt: {
    backgroundColor: COLORS.cream,
  },
  pricingCell: {
    fontSize: 10,
    color: COLORS.textSecondary,
  },
  pricingCellBold: {
    fontSize: 10,
    color: COLORS.navy,
    fontWeight: 'bold',
  },

  // ===== COMMUNITY CARD =====
  communityCard: {
    backgroundColor: COLORS.cream,
    borderRadius: 10,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.sageLight,
  },
  communityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  communityName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.navy,
    marginBottom: 4,
  },
  communityLocation: {
    fontSize: 10,
    color: COLORS.textSecondary,
  },
  communityBadge: {
    backgroundColor: COLORS.gold,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  communityBadgeText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  whyMatchedBox: {
    backgroundColor: COLORS.white,
    borderRadius: 6,
    padding: 10,
    marginTop: 8,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.sage,
  },
  whyMatchedLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    color: COLORS.sage,
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  whyMatchedText: {
    fontSize: 10,
    color: COLORS.textPrimary,
    fontStyle: 'italic',
    lineHeight: 1.4,
  },

  // ===== CHECKLIST =====
  checklistItem: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  checklistBox: {
    width: 14,
    height: 14,
    borderWidth: 2,
    borderColor: COLORS.sage,
    borderRadius: 3,
    marginRight: 10,
    marginTop: 1,
  },
  checklistText: {
    fontSize: 11,
    color: COLORS.textPrimary,
    flex: 1,
    lineHeight: 1.5,
  },

  // ===== CTA BOX =====
  ctaBox: {
    backgroundColor: COLORS.navy,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 10,
  },
  ctaText: {
    fontSize: 11,
    color: COLORS.sageLight,
    textAlign: 'center',
    marginBottom: 14,
    lineHeight: 1.5,
  },
  ctaPhone: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.sage,
  },

  // ===== TWO COLUMN LAYOUT =====
  twoColumn: {
    flexDirection: 'row',
    gap: 16,
  },
  column: {
    flex: 1,
  },

  // ===== STATS ROW =====
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statBox: {
    width: '31%',
    backgroundColor: COLORS.cream,
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.sageLight,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.navy,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 9,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 1.3,
  },

  // ===== QR CODE PLACEHOLDER =====
  qrContainer: {
    width: 50,
    height: 50,
    backgroundColor: COLORS.white,
    borderRadius: 4,
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.sageLight,
  },

  // ===== HOSPITAL INTEGRATION =====
  hospitalBox: {
    backgroundColor: '#F0FFF4',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#9AE6B4',
  },
  hospitalTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#276749',
    marginBottom: 8,
  },
  hospitalText: {
    fontSize: 10,
    color: '#2F855A',
    lineHeight: 1.5,
  },

  // ===== FOOTNOTE =====
  footnote: {
    fontSize: 9,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.sageLight,
    lineHeight: 1.4,
  },
});

// ============================================================================
// TYPES
// ============================================================================

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
  cmsRating?: number;
  whyMatched?: string;
}

interface CareGuidePDFProps {
  recipientName: string;
  email: string;
  assessmentData: AssessmentData;
  matchedCommunities?: Community[];
  generatedDate?: string;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

// Generate personalized assessment narrative
function generateNarrative(assessmentData: AssessmentData, recipientName: string): string {
  const recommendation = assessmentData.recommendation.toLowerCase();
  const score = assessmentData.score;
  const firstName = recipientName.split(' ')[0];

  if (recommendation.includes('memory')) {
    return `Based on your focus on 24/7 specialized support and cognitive care needs, Memory Care is the safest and most appropriate recommendation for your family's current situation. This level of care ensures round-the-clock supervision with staff trained specifically in dementia and Alzheimer's care protocols.`;
  }
  
  if (recommendation.includes('assisted')) {
    if (score > 70) {
      return `Your assessment indicates a need for daily assistance with personal care activities while maintaining a meaningful level of independence. Assisted Living communities provide the ideal balance—professional support when needed, with the freedom to live life on your terms.`;
    }
    return `Based on your responses, Assisted Living offers the right blend of independence and support. You'll have access to trained staff around the clock while enjoying private living spaces and community activities.`;
  }
  
  if (recommendation.includes('independent')) {
    return `Great news! Your assessment suggests that Independent Living is well-suited to your current needs. These communities offer maintenance-free living, social engagement, and convenient services while preserving your complete autonomy.`;
  }
  
  if (recommendation.includes('skilled')) {
    return `Your assessment indicates a need for comprehensive medical care and rehabilitation services. Skilled Nursing Facilities provide 24-hour nursing care with specialized medical support for complex health needs.`;
  }

  return `Based on your unique situation and care preferences, we've identified the best options for your family. Our local Cleveland advisors are ready to provide personalized guidance at no cost to you.`;
}

// Get care type details
function getCareTypeDetails(recommendation: string): { description: string; services: string[]; priceRange: string } {
  const rec = recommendation.toLowerCase();
  
  if (rec.includes('memory')) {
    return {
      description: 'Memory Care communities provide specialized 24/7 support for individuals with Alzheimer\'s disease, dementia, or other cognitive impairments in a secure, purposefully designed environment.',
      services: [
        'Secure, monitored environment to prevent wandering',
        '24/7 specialized dementia-trained staff',
        'Cognitive therapy and memory-enhancing programs',
        'Structured daily routines for comfort',
        'All meals with nutrition monitoring',
        'Complete personal care assistance',
      ],
      priceRange: '$4,500 - $8,500/month',
    };
  }
  
  if (rec.includes('assisted')) {
    return {
      description: 'Assisted Living communities help residents maintain independence while providing personalized support with daily activities. Professional staff are available 24/7 in a warm, social environment.',
      services: [
        'Private or semi-private apartments',
        'Personal care assistance as needed',
        'Three chef-prepared meals daily',
        'Medication management',
        'Engaging social activities and outings',
        'Housekeeping and laundry services',
      ],
      priceRange: '$3,200 - $6,500/month',
    };
  }
  
  if (rec.includes('independent')) {
    return {
      description: 'Independent Living communities offer maintenance-free living for active seniors who want convenience, social connection, and peace of mind without hands-on care assistance.',
      services: [
        'Private apartment or cottage',
        'Restaurant-style dining options',
        'Fitness and wellness programs',
        'Social and recreational activities',
        'Housekeeping and maintenance',
        '24-hour emergency response',
      ],
      priceRange: '$2,200 - $4,500/month',
    };
  }

  return {
    description: 'Senior living communities provide various levels of care tailored to individual needs, from independent living to comprehensive skilled nursing.',
    services: [
      'Personalized care plans',
      'Professional staff support',
      'Nutritious meals',
      'Social activities',
      'Safety and security',
      'Healthcare coordination',
    ],
    priceRange: '$2,200 - $8,500/month',
  };
}

// Cleveland area pricing
const CLEVELAND_PRICING = [
  { suburb: 'Beachwood / Pepper Pike', assistedLiving: '$5,800 - $7,200', memoryCare: '$6,500 - $8,500' },
  { suburb: 'Westlake / Bay Village', assistedLiving: '$5,200 - $6,500', memoryCare: '$6,000 - $7,800' },
  { suburb: 'Rocky River / Lakewood', assistedLiving: '$4,800 - $6,200', memoryCare: '$5,800 - $7,500' },
  { suburb: 'Mentor / Willoughby', assistedLiving: '$4,500 - $5,800', memoryCare: '$5,500 - $7,000' },
  { suburb: 'Parma / Seven Hills', assistedLiving: '$4,200 - $5,500', memoryCare: '$5,200 - $6,800' },
  { suburb: 'Independence / Broadview Hts', assistedLiving: '$4,500 - $5,800', memoryCare: '$5,400 - $7,000' },
];

// Default community "Why Matched" reasons
const DEFAULT_WHY_MATCHED: Record<string, string> = {
  'Mount Alverna Village': 'High-rated spiritual care and peaceful Parma campus with excellent resident satisfaction',
  'Westlake Village': 'Top-tier memory care program with specialized dementia training for all staff',
  'Judson Park': 'Exceptional continuing care community with outstanding CMS ratings in University Circle',
  'Breckenridge Village': 'Award-winning Willoughby campus with strong rehabilitation program',
  'default': 'Matches your care needs and location preferences with verified quality ratings',
};

// Simple QR code pattern (decorative representation)
function QRCodePlaceholder() {
  return (
    <View style={styles.qrContainer}>
      <Svg width="42" height="42" viewBox="0 0 42 42">
        {/* Simple decorative QR pattern */}
        <Rect x="0" y="0" width="14" height="14" fill={COLORS.navy} />
        <Rect x="28" y="0" width="14" height="14" fill={COLORS.navy} />
        <Rect x="0" y="28" width="14" height="14" fill={COLORS.navy} />
        <Rect x="4" y="4" width="6" height="6" fill={COLORS.white} />
        <Rect x="32" y="4" width="6" height="6" fill={COLORS.white} />
        <Rect x="4" y="32" width="6" height="6" fill={COLORS.white} />
        <Rect x="18" y="4" width="6" height="6" fill={COLORS.navy} />
        <Rect x="18" y="18" width="6" height="6" fill={COLORS.navy} />
        <Rect x="4" y="18" width="6" height="6" fill={COLORS.navy} />
        <Rect x="32" y="18" width="6" height="6" fill={COLORS.navy} />
        <Rect x="18" y="32" width="6" height="6" fill={COLORS.navy} />
        <Rect x="32" y="32" width="6" height="6" fill={COLORS.navy} />
      </Svg>
    </View>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function CareGuidePDF({
  recipientName,
  email,
  assessmentData,
  matchedCommunities = [],
  generatedDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
}: CareGuidePDFProps) {
  const careTypeDetails = getCareTypeDetails(assessmentData.recommendation);
  const narrative = generateNarrative(assessmentData, recipientName);
  const careTypeKey = assessmentData.recommendation.includes('Memory') 
    ? 'Memory Care' 
    : assessmentData.recommendation.includes('Assisted') 
      ? 'Assisted Living'
      : assessmentData.recommendation.includes('Independent')
        ? 'Independent Living'
        : 'Senior Care';

  return (
    <Document>
      {/* ================================================================== */}
      {/* PAGE 1: PREMIUM COVER */}
      {/* ================================================================== */}
      <Page size="LETTER" style={styles.coverPage}>
        <View style={styles.coverContent}>
          <View style={styles.coverBadge}>
            <Text style={styles.coverBadgeText}>PERSONALIZED CARE GUIDE</Text>
          </View>
          
          <Text style={styles.coverLogo}>Guide for Seniors</Text>
          <Text style={styles.coverTagline}>Cleveland's Boutique Senior Care Concierge</Text>
          
          <Text style={styles.coverTitle}>Your Personal{'\n'}Care Roadmap</Text>
          <Text style={styles.coverSubtitle}>
            Expert recommendations tailored to your family's{'\n'}
            unique needs and preferences
          </Text>
          
          <Text style={styles.coverPreparedFor}>PREPARED FOR</Text>
          <Text style={styles.coverName}>{recipientName}</Text>
        </View>
        
        <View style={styles.coverFooter}>
          <Link src="tel:+12166774630" style={{ textDecoration: 'none' }}>
            <Text style={styles.coverPhone}>(216) 677-4630</Text>
          </Link>
          <Text style={styles.coverDate}>Generated {generatedDate}</Text>
        </View>
      </Page>

      {/* ================================================================== */}
      {/* PAGE 2: ASSESSMENT SUMMARY WITH NARRATIVE */}
      {/* ================================================================== */}
      <Page size="LETTER" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerLogo}>Guide for Seniors</Text>
          <Text style={styles.headerPage}>Your Assessment Results</Text>
        </View>

        <Text style={styles.pageTitle}>Your Personalized Assessment</Text>

        {/* Dynamic Narrative Box */}
        <View style={styles.narrativeBox}>
          <Text style={styles.narrativeQuote}>
            "{narrative}"
          </Text>
          <Text style={styles.narrativeAttribution}>
            — Guide for Seniors Care Team
          </Text>
        </View>

        {/* Premium Summary Card */}
        <View style={styles.premiumCardHighlight}>
          <View style={styles.cardHeader}>
            <View style={styles.cardIcon}>
              <Text style={styles.cardIconText}>{careTypeKey.charAt(0)}</Text>
            </View>
            <View>
              <Text style={styles.cardTitle}>Recommended: {careTypeKey}</Text>
              <Text style={styles.cardSubtitle}>{careTypeDetails.priceRange} in Cleveland</Text>
            </View>
          </View>
          
          <Text style={styles.paragraph}>{careTypeDetails.description}</Text>
          
          <Text style={styles.subsectionTitle}>What's Typically Included:</Text>
          <View style={styles.twoColumn}>
            <View style={styles.column}>
              {careTypeDetails.services.slice(0, 3).map((service, i) => (
                <View key={i} style={{ flexDirection: 'row', marginBottom: 4 }}>
                  <Text style={{ fontSize: 10, color: COLORS.sage, marginRight: 6 }}>✓</Text>
                  <Text style={{ fontSize: 10, color: COLORS.textSecondary }}>{service}</Text>
                </View>
              ))}
            </View>
            <View style={styles.column}>
              {careTypeDetails.services.slice(3, 6).map((service, i) => (
                <View key={i} style={{ flexDirection: 'row', marginBottom: 4 }}>
                  <Text style={{ fontSize: 10, color: COLORS.sage, marginRight: 6 }}>✓</Text>
                  <Text style={{ fontSize: 10, color: COLORS.textSecondary }}>{service}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{assessmentData.score}</Text>
            <Text style={styles.statLabel}>CARE SCORE</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>
              {matchedCommunities.length > 0 ? matchedCommunities.length : assessmentData.matchedCommunities.length}
            </Text>
            <Text style={styles.statLabel}>MATCHED{'\n'}COMMUNITIES</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>100%</Text>
            <Text style={styles.statLabel}>FREE{'\n'}SERVICE</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>© Guide for Seniors | www.guideforseniors.com</Text>
          <Link src="tel:+12166774630">
            <Text style={styles.footerPhone}>(216) 677-4630</Text>
          </Link>
        </View>
      </Page>

      {/* ================================================================== */}
      {/* PAGE 3: CLEVELAND PRICING GUIDE */}
      {/* ================================================================== */}
      <Page size="LETTER" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerLogo}>Guide for Seniors</Text>
          <Text style={styles.headerPage}>2026 Pricing Guide</Text>
        </View>

        <Text style={styles.pageTitle}>Cleveland Area Pricing Guide</Text>

        {/* Northeast Ohio Advantage Callout */}
        <View style={styles.calloutBox}>
          <Text style={styles.calloutTitle}>🌟 Northeast Ohio Advantage</Text>
          <Text style={styles.calloutText}>
            Local senior care is 5-15% more affordable than the national average. Cleveland families benefit from excellent quality care at significantly lower costs compared to coastal cities, without compromising on standards.
          </Text>
        </View>

        <Text style={styles.paragraph}>
          Below are current 2026 pricing ranges for senior living communities across Greater Cleveland. 
          Costs vary by location, room type, and level of care needed.
        </Text>

        <View style={styles.pricingTable}>
          <View style={styles.pricingHeader}>
            <Text style={[styles.pricingHeaderCell, { width: '36%' }]}>Neighborhood</Text>
            <Text style={[styles.pricingHeaderCell, { width: '32%' }]}>Assisted Living</Text>
            <Text style={[styles.pricingHeaderCell, { width: '32%' }]}>Memory Care</Text>
          </View>
          {CLEVELAND_PRICING.map((row, index) => (
            <View key={index} style={[styles.pricingRow, index % 2 === 1 ? styles.pricingRowAlt : {}]}>
              <Text style={[styles.pricingCellBold, { width: '36%' }]}>{row.suburb}</Text>
              <Text style={[styles.pricingCell, { width: '32%' }]}>{row.assistedLiving}</Text>
              <Text style={[styles.pricingCell, { width: '32%' }]}>{row.memoryCare}</Text>
            </View>
          ))}
        </View>

        {/* Add-On Footnote */}
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>💡 Understanding "Level of Care" Fees</Text>
          <Text style={styles.infoText}>
            Base rates typically exclude 'Level of Care' fees for services like medication management, 
            incontinence care, and mobility assistance. These additional fees range from $500–$1,500/month 
            in 2026 depending on individual needs. Always request a detailed care assessment before signing.
          </Text>
        </View>

        <Text style={styles.footnote}>
          * Pricing is based on 2026 market data and may vary by specific community, room type, and care level. 
          Contact us for current availability and exact pricing for your preferred communities.
        </Text>

        <View style={styles.footer}>
          <Text style={styles.footerText}>© Guide for Seniors | www.guideforseniors.com</Text>
          <Link src="tel:+12166774630">
            <Text style={styles.footerPhone}>(216) 677-4630</Text>
          </Link>
        </View>
      </Page>

      {/* ================================================================== */}
      {/* PAGE 4: MATCHED COMMUNITIES */}
      {/* ================================================================== */}
      <Page size="LETTER" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerLogo}>Guide for Seniors</Text>
          <Text style={styles.headerPage}>Your Matched Communities</Text>
        </View>

        <Text style={styles.pageTitle}>Communities Matched to You</Text>
        <Text style={styles.paragraph}>
          Based on your assessment, these Cleveland-area communities align with your care needs, 
          location preferences, and budget. Each includes our "Why It Matched" insight.
        </Text>

        {matchedCommunities.length > 0 ? (
          matchedCommunities.slice(0, 4).map((community, index) => (
            <View key={index} style={styles.communityCard}>
              <View style={styles.communityHeader}>
                <View>
                  <Text style={styles.communityName}>{community.name}</Text>
                  <Text style={styles.communityLocation}>{community.city}, Ohio</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  {community.cmsRating && community.cmsRating >= 4 && (
                    <View style={styles.communityBadge}>
                      <Text style={styles.communityBadgeText}>CMS {community.cmsRating}★</Text>
                    </View>
                  )}
                  <QRCodePlaceholder />
                </View>
              </View>
              
              <Text style={{ fontSize: 10, color: COLORS.textSecondary, marginBottom: 8 }}>
                Care Types: {community.careTypes.join(', ')}
                {community.priceRange && ` • Starting at ${community.priceRange}`}
              </Text>
              
              <View style={styles.whyMatchedBox}>
                <Text style={styles.whyMatchedLabel}>WHY IT MATCHED</Text>
                <Text style={styles.whyMatchedText}>
                  {community.whyMatched || DEFAULT_WHY_MATCHED[community.name] || DEFAULT_WHY_MATCHED['default']}
                </Text>
              </View>
            </View>
          ))
        ) : (
          assessmentData.matchedCommunities.slice(0, 4).map((name, index) => (
            <View key={index} style={styles.communityCard}>
              <View style={styles.communityHeader}>
                <View>
                  <Text style={styles.communityName}>{name}</Text>
                  <Text style={styles.communityLocation}>Greater Cleveland Area</Text>
                </View>
                <QRCodePlaceholder />
              </View>
              
              <Text style={{ fontSize: 10, color: COLORS.textSecondary, marginBottom: 8 }}>
                Care Types: {careTypeKey}
              </Text>
              
              <View style={styles.whyMatchedBox}>
                <Text style={styles.whyMatchedLabel}>WHY IT MATCHED</Text>
                <Text style={styles.whyMatchedText}>
                  {DEFAULT_WHY_MATCHED[name] || DEFAULT_WHY_MATCHED['default']}
                </Text>
              </View>
            </View>
          ))
        )}

        <View style={styles.ctaBox}>
          <Text style={styles.ctaTitle}>Ready to Tour?</Text>
          <Text style={styles.ctaText}>
            Our local advisors can schedule complimentary tours at any of{'\n'}
            these communities on your behalf—completely free.
          </Text>
          <Link src="tel:+12166774630">
            <Text style={styles.ctaPhone}>(216) 677-4630</Text>
          </Link>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>© Guide for Seniors | www.guideforseniors.com</Text>
          <Link src="tel:+12166774630">
            <Text style={styles.footerPhone}>(216) 677-4630</Text>
          </Link>
        </View>
      </Page>

      {/* ================================================================== */}
      {/* PAGE 5: NEXT STEPS CHECKLIST + RED FLAGS */}
      {/* ================================================================== */}
      <Page size="LETTER" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerLogo}>Guide for Seniors</Text>
          <Text style={styles.headerPage}>Expert Guidance</Text>
        </View>

        <Text style={styles.pageTitle}>Your Next Steps Checklist</Text>

        {/* Hospital Discharge Integration */}
        <View style={styles.hospitalBox}>
          <Text style={styles.hospitalTitle}>🏥 Hospital-to-Home Transition</Text>
          <Text style={styles.hospitalText}>
            If transitioning from a hospital stay, our team coordinates directly with discharge 
            planners at Cleveland Clinic, University Hospitals, MetroHealth, and St. John Medical 
            Center to ensure a seamless placement process. We handle the paperwork and timing.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Before Touring</Text>
        <View style={styles.checklistItem}>
          <View style={styles.checklistBox} />
          <Text style={styles.checklistText}>Gather current medical records and medication list</Text>
        </View>
        <View style={styles.checklistItem}>
          <View style={styles.checklistBox} />
          <Text style={styles.checklistText}>Review financial options (savings, LTC insurance, VA benefits)</Text>
        </View>
        <View style={styles.checklistItem}>
          <View style={styles.checklistBox} />
          <Text style={styles.checklistText}>List must-have amenities and non-negotiables</Text>
        </View>
        <View style={styles.checklistItem}>
          <View style={styles.checklistBox} />
          <Text style={styles.checklistText}>Discuss care needs and concerns with family members</Text>
        </View>

        <Text style={styles.sectionTitle}>During Tours</Text>
        <View style={styles.checklistItem}>
          <View style={styles.checklistBox} />
          <Text style={styles.checklistText}>Ask about staff-to-resident ratios and training programs</Text>
        </View>
        <View style={styles.checklistItem}>
          <View style={styles.checklistBox} />
          <Text style={styles.checklistText}>Sample a meal and observe the dining atmosphere</Text>
        </View>
        <View style={styles.checklistItem}>
          <View style={styles.checklistBox} />
          <Text style={styles.checklistText}>Request the activity calendar and attend an activity if possible</Text>
        </View>
        <View style={styles.checklistItem}>
          <View style={styles.checklistBox} />
          <Text style={styles.checklistText}>Talk to current residents and their families</Text>
        </View>

        {/* RED FLAGS MODULE */}
        <View style={styles.redFlagBox}>
          <View style={styles.redFlagHeader}>
            <View style={styles.redFlagIcon}>
              <Text style={styles.redFlagIconText}>!</Text>
            </View>
            <Text style={styles.redFlagTitle}>3 Local Expert Red Flags to Watch</Text>
          </View>
          
          <View style={styles.redFlagItem}>
            <Text style={styles.redFlagItemTitle}>1. Employee Engagement</Text>
            <Text style={styles.redFlagItemText}>
              Are staff genuinely interacting with residents, or avoiding eye contact and rushing through hallways? 
              Warm, engaged staff is the #1 indicator of quality care.
            </Text>
          </View>
          
          <View style={styles.redFlagItem}>
            <Text style={styles.redFlagItemTitle}>2. Social Vitality</Text>
            <Text style={styles.redFlagItemText}>
              Are residents active in common areas participating in activities, or isolated in their rooms? 
              A vibrant community prevents decline and depression.
            </Text>
          </View>
          
          <View style={styles.redFlagItem}>
            <Text style={styles.redFlagItemTitle}>3. The "Smell Test"</Text>
            <Text style={styles.redFlagItemText}>
              Are transition areas, hallways, and common spaces clean and odor-free? 
              Persistent odors indicate housekeeping or care quality issues.
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>© Guide for Seniors | www.guideforseniors.com</Text>
          <Link src="tel:+12166774630">
            <Text style={styles.footerPhone}>(216) 677-4630</Text>
          </Link>
        </View>
      </Page>

      {/* ================================================================== */}
      {/* PAGE 6: CONTACT & FINAL CTA */}
      {/* ================================================================== */}
      <Page size="LETTER" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerLogo}>Guide for Seniors</Text>
          <Text style={styles.headerPage}>Your Next Steps</Text>
        </View>

        <Text style={styles.pageTitle}>We're Here for You</Text>

        <View style={styles.premiumCard}>
          <Text style={styles.paragraph}>
            Navigating senior care decisions can feel overwhelming. That's why Guide for Seniors 
            provides completely free, personalized guidance from local Cleveland advisors who know 
            these communities personally.
          </Text>
          
          <Text style={styles.subsectionTitle}>What We Do For You:</Text>
          <View style={styles.checklistItem}>
            <Text style={{ fontSize: 11, color: COLORS.sage, marginRight: 8 }}>✓</Text>
            <Text style={styles.checklistText}>Schedule and coordinate tours at multiple communities</Text>
          </View>
          <View style={styles.checklistItem}>
            <Text style={{ fontSize: 11, color: COLORS.sage, marginRight: 8 }}>✓</Text>
            <Text style={styles.checklistText}>Negotiate pricing and secure move-in specials</Text>
          </View>
          <View style={styles.checklistItem}>
            <Text style={{ fontSize: 11, color: COLORS.sage, marginRight: 8 }}>✓</Text>
            <Text style={styles.checklistText}>Explain Medicaid waiver and VA benefit options</Text>
          </View>
          <View style={styles.checklistItem}>
            <Text style={{ fontSize: 11, color: COLORS.sage, marginRight: 8 }}>✓</Text>
            <Text style={styles.checklistText}>Support you through the entire transition process</Text>
          </View>
        </View>

        <View style={[styles.ctaBox, { marginTop: 24 }]}>
          <Text style={styles.ctaTitle}>Ready to Take the Next Step?</Text>
          <Text style={styles.ctaText}>
            Call us today for a free, no-pressure consultation.{'\n'}
            We'll discuss your options and answer all your questions.
          </Text>
          <Link src="tel:+12166774630">
            <Text style={styles.ctaPhone}>(216) 677-4630</Text>
          </Link>
          <Text style={{ fontSize: 10, color: COLORS.sageLight, marginTop: 10 }}>
            www.guideforseniors.com
          </Text>
        </View>

        <View style={[styles.premiumCard, { marginTop: 24 }]}>
          <Text style={styles.subsectionTitle}>Your Personal Guide Team:</Text>
          <Text style={styles.paragraph}>
            When you call, you'll speak with a real Cleveland-based advisor—not a call center. 
            We've toured every community we recommend and built relationships with their staff. 
            This local expertise means you get honest, informed guidance specific to your situation.
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>© Guide for Seniors | www.guideforseniors.com</Text>
          <Link src="tel:+12166774630">
            <Text style={styles.footerPhone}>(216) 677-4630</Text>
          </Link>
        </View>
      </Page>
    </Document>
  );
}

export default CareGuidePDF;

