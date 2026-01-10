import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Link,
  Font,
  Svg,
  Rect,
} from '@react-pdf/renderer';

// ============================================================================
// 2026 CLEVELAND SENIOR LIVING COST REPORT
// Enterprise-grade pricing guide with local authority positioning
// ============================================================================

// ============================================================================
// TEXT SANITIZATION - Fix encoding artifacts
// ============================================================================

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

// Constants
const PHONE_NUMBER = '(216) 677-4630';
const PHONE_LINK = 'tel:+12166774630';
const WEBSITE = 'www.guideforseniors.com';

// Disable hyphenation for consistent rendering
Font.registerHyphenationCallback((word) => [word]);

// ============================================================================
// BRAND COLORS - 2026 Modern Palette
// ============================================================================

const COLORS = {
  // Primary
  teal: '#0f766e',
  tealDark: '#0d6560',
  tealLight: '#14b8a6',
  tealPale: '#ccfbf1',
  
  // Neutrals
  white: '#FFFFFF',
  cream: '#FAFBFA',
  grayLight: '#F8FAFC',
  grayMid: '#E2E8F0',
  grayText: '#64748B',
  
  // Text
  textDark: '#0F172A',
  textMid: '#334155',
  textLight: '#475569',
  
  // Accents
  navy: '#1E3A5F',
  gold: '#B8860B',
  goldLight: '#FEF3C7',
  
  // Heatmap colors for neighborhoods
  heatHigh: '#DBEAFE',    // Beachwood - soft blue (premium)
  heatMedHigh: '#E0E7FF', // Westlake - soft indigo
  heatMed: '#F3E8FF',     // Rocky River - soft purple
  heatMedLow: '#FCE7F3',  // Mentor - soft pink
  heatLow: '#DCFCE7',     // Parma - soft green (value)
  heatValue: '#D1FAE5',   // Best value green
  
  // Alerts
  red: '#DC2626',
  redLight: '#FEE2E2',
  amber: '#D97706',
  amberLight: '#FEF3C7',
};

// ============================================================================
// STYLES - WCAG 2.1 AA Compliant
// ============================================================================

const LINE_HEIGHT = {
  tight: 1.2,
  normal: 1.4,
  relaxed: 1.6,
};

const styles = StyleSheet.create({
  // ===== PAGE =====
  page: {
    flexDirection: 'column',
    backgroundColor: COLORS.white,
    padding: 40,
    fontFamily: 'Helvetica',
  },
  coverPage: {
    flexDirection: 'column',
    backgroundColor: COLORS.teal,
    padding: 0,
    fontFamily: 'Helvetica',
  },

  // ===== COVER =====
  coverContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 50,
  },
  coverBadge: {
    backgroundColor: COLORS.tealLight,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 24,
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
    color: COLORS.tealPale,
    marginBottom: 40,
    letterSpacing: 0.5,
  },
  coverYear: {
    fontSize: 56,
    fontWeight: 'bold',
    color: COLORS.tealLight,
    marginBottom: 8,
  },
  coverTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: LINE_HEIGHT.tight,
  },
  coverSubtitle: {
    fontSize: 13,
    color: COLORS.tealPale,
    textAlign: 'center',
    marginBottom: 50,
    lineHeight: LINE_HEIGHT.normal,
  },
  coverPreparedFor: {
    fontSize: 10,
    color: COLORS.tealLight,
    textAlign: 'center',
    marginBottom: 6,
    letterSpacing: 1,
  },
  coverName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: COLORS.white,
    textAlign: 'center',
  },
  coverFooter: {
    backgroundColor: COLORS.tealDark,
    padding: 24,
    alignItems: 'center',
    borderTopWidth: 3,
    borderTopColor: COLORS.tealLight,
  },
  coverPhone: {
    fontSize: 16,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  coverDate: {
    fontSize: 10,
    color: COLORS.tealPale,
    marginTop: 4,
  },

  // ===== HEADER/FOOTER =====
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.teal,
  },
  headerLogo: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.teal,
  },
  headerPage: {
    fontSize: 10,
    color: COLORS.grayText,
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
    borderTopColor: COLORS.grayMid,
  },
  footerText: {
    fontSize: 9,
    color: COLORS.grayText,
  },
  footerPhone: {
    fontSize: 10,
    color: COLORS.teal,
    fontWeight: 'bold',
  },

  // ===== TYPOGRAPHY =====
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textDark,
    marginBottom: 16,
    lineHeight: LINE_HEIGHT.tight,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.teal,
    marginTop: 20,
    marginBottom: 12,
    lineHeight: LINE_HEIGHT.tight,
  },
  subsectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.textMid,
    marginTop: 12,
    marginBottom: 8,
    lineHeight: LINE_HEIGHT.tight,
  },
  paragraph: {
    fontSize: 12,
    color: COLORS.textLight,
    lineHeight: LINE_HEIGHT.relaxed,
    marginBottom: 12,
  },
  bodyText: {
    fontSize: 12,
    color: COLORS.textMid,
    lineHeight: LINE_HEIGHT.normal,
  },

  // ===== 3D STAT BOXES =====
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statBox3D: {
    width: '31%',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.teal,
    borderBottomWidth: 6,
    borderRightWidth: 4,
  },
  statNumber3D: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.teal,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 9,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: LINE_HEIGHT.tight,
    fontWeight: 'bold',
  },
  statSubLabel: {
    fontSize: 8,
    color: COLORS.grayText,
    textAlign: 'center',
    marginTop: 2,
  },

  // ===== CARE TYPE CARDS =====
  careCardsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  careCard: {
    flex: 1,
    backgroundColor: COLORS.cream,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.grayMid,
  },
  careCardHighlight: {
    flex: 1,
    backgroundColor: COLORS.tealPale,
    borderRadius: 12,
    padding: 14,
    borderWidth: 2,
    borderColor: COLORS.teal,
  },
  careCardTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: COLORS.textDark,
    marginBottom: 4,
  },
  careCardPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.teal,
    marginBottom: 8,
  },
  careCardDesc: {
    fontSize: 9,
    color: COLORS.textLight,
    lineHeight: LINE_HEIGHT.normal,
    marginBottom: 8,
  },
  careCardBullet: {
    fontSize: 8,
    color: COLORS.textLight,
    marginBottom: 2,
  },

  // ===== HEATMAP TABLE =====
  heatmapTable: {
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.grayMid,
  },
  heatmapHeader: {
    flexDirection: 'row',
    backgroundColor: COLORS.teal,
    padding: 10,
  },
  heatmapHeaderCell: {
    fontSize: 9,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  heatmapRow: {
    flexDirection: 'row',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grayMid,
  },
  heatmapCell: {
    fontSize: 9,
    color: COLORS.textMid,
    lineHeight: LINE_HEIGHT.normal,
  },
  heatmapCellBold: {
    fontSize: 9,
    color: COLORS.textDark,
    fontWeight: 'bold',
  },
  heatmapBestFor: {
    fontSize: 8,
    color: COLORS.grayText,
    fontStyle: 'italic',
    marginTop: 2,
  },

  // ===== CALLOUT BOXES =====
  calloutBox: {
    backgroundColor: COLORS.goldLight,
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.gold,
  },
  calloutTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.textDark,
    marginBottom: 6,
  },
  calloutText: {
    fontSize: 10,
    color: COLORS.textMid,
    lineHeight: LINE_HEIGHT.normal,
  },

  // ===== EXPERT TIP BOX =====
  expertTipBox: {
    backgroundColor: COLORS.redLight,
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: COLORS.red,
  },
  expertTipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  expertTipIcon: {
    width: 24,
    height: 24,
    backgroundColor: COLORS.red,
    borderRadius: 12,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  expertTipIconText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  expertTipTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.red,
  },
  expertTipText: {
    fontSize: 10,
    color: COLORS.textMid,
    lineHeight: LINE_HEIGHT.normal,
  },

  // ===== LEAD MAGNET BOX =====
  leadMagnetBox: {
    backgroundColor: COLORS.teal,
    borderRadius: 12,
    padding: 18,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  leadMagnetContent: {
    flex: 1,
  },
  leadMagnetTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 4,
  },
  leadMagnetText: {
    fontSize: 10,
    color: COLORS.tealPale,
    lineHeight: LINE_HEIGHT.normal,
  },
  leadMagnetQR: {
    width: 50,
    height: 50,
    backgroundColor: COLORS.white,
    borderRadius: 6,
    padding: 4,
    marginLeft: 12,
  },

  // ===== CAREGIVER BURNOUT BOX =====
  burnoutBox: {
    backgroundColor: COLORS.amberLight,
    borderRadius: 10,
    padding: 16,
    marginTop: 16,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.amber,
  },
  burnoutTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: COLORS.textDark,
    marginBottom: 6,
  },
  burnoutText: {
    fontSize: 10,
    color: COLORS.textMid,
    lineHeight: LINE_HEIGHT.normal,
  },

  // ===== INFO BOX =====
  infoBox: {
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
    padding: 14,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  infoTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1E40AF',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 10,
    color: '#1E3A8A',
    lineHeight: LINE_HEIGHT.normal,
  },

  // ===== COMPARISON TABLE =====
  comparisonBox: {
    backgroundColor: COLORS.grayLight,
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.grayMid,
  },
  comparisonTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: COLORS.textDark,
    marginBottom: 12,
  },
  comparisonRow: {
    flexDirection: 'row',
    marginBottom: 6,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grayMid,
  },
  comparisonLabel: {
    fontSize: 10,
    color: COLORS.textMid,
    width: '50%',
  },
  comparisonValue: {
    fontSize: 10,
    color: COLORS.textDark,
    fontWeight: 'bold',
    width: '25%',
    textAlign: 'center',
  },

  // ===== CHECKLIST =====
  checklistItem: {
    flexDirection: 'row',
    marginBottom: 6,
    alignItems: 'flex-start',
  },
  checklistBox: {
    width: 12,
    height: 12,
    borderWidth: 2,
    borderColor: COLORS.teal,
    borderRadius: 2,
    marginRight: 8,
    marginTop: 2,
  },
  checklistText: {
    fontSize: 11,
    color: COLORS.textMid,
    flex: 1,
    lineHeight: LINE_HEIGHT.normal,
  },

  // ===== CTA BOX =====
  ctaBox: {
    backgroundColor: COLORS.teal,
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
    color: COLORS.tealPale,
    textAlign: 'center',
    marginBottom: 14,
    lineHeight: LINE_HEIGHT.normal,
  },
  ctaPhone: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.tealLight,
  },

  // ===== FOOTNOTE =====
  footnote: {
    fontSize: 9,
    color: COLORS.grayText,
    fontStyle: 'italic',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.grayMid,
    lineHeight: LINE_HEIGHT.normal,
  },

  // ===== BULLET LIST =====
  bulletRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  bulletCheck: {
    fontSize: 10,
    color: COLORS.teal,
    marginRight: 6,
    width: 12,
  },
  bulletText: {
    fontSize: 10,
    color: COLORS.textLight,
    flex: 1,
    lineHeight: LINE_HEIGHT.normal,
  },

  // ===== KEY FINDINGS =====
  keyFinding: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  keyFindingIcon: {
    width: 20,
    height: 20,
    backgroundColor: COLORS.teal,
    borderRadius: 10,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  keyFindingCheck: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  keyFindingText: {
    fontSize: 11,
    color: COLORS.textMid,
    flex: 1,
    lineHeight: LINE_HEIGHT.normal,
  },

  // ===== EXECUTIVE SUMMARY =====
  executiveSummary: {
    backgroundColor: COLORS.tealPale,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: COLORS.teal,
  },
  executiveTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.teal,
    marginBottom: 14,
  },

  // ===== TWO COLUMN =====
  twoColumn: {
    flexDirection: 'row',
    gap: 16,
  },
  column: {
    flex: 1,
  },
});

// ============================================================================
// DATA
// ============================================================================

// Neighborhood pricing with heatmap colors and "Best For"
const NEIGHBORHOOD_PRICING = [
  { 
    area: 'Beachwood / Pepper Pike', 
    al: '$5,800 - $7,200', 
    mc: '$6,500 - $8,500', 
    il: '$3,200 - $4,500',
    color: COLORS.heatHigh,
    bestFor: 'Premium amenities & top healthcare access'
  },
  { 
    area: 'Westlake / Bay Village', 
    al: '$5,200 - $6,500', 
    mc: '$6,000 - $7,800', 
    il: '$2,800 - $4,200',
    color: COLORS.heatMedHigh,
    bestFor: 'Vibrant suburban shopping & lakefront proximity'
  },
  { 
    area: 'Rocky River / Lakewood', 
    al: '$4,800 - $6,200', 
    mc: '$5,800 - $7,500', 
    il: '$2,600 - $3,800',
    color: COLORS.heatMed,
    bestFor: 'Walkable neighborhoods & cultural attractions'
  },
  { 
    area: 'Mentor / Willoughby', 
    al: '$4,500 - $5,800', 
    mc: '$5,500 - $7,000', 
    il: '$2,400 - $3,500',
    color: COLORS.heatMedLow,
    bestFor: 'Lake County charm & family-friendly areas'
  },
  { 
    area: 'Parma / Seven Hills', 
    al: '$4,200 - $5,500', 
    mc: '$5,200 - $6,800', 
    il: '$2,200 - $3,200',
    color: COLORS.heatLow,
    bestFor: 'Exceptional value & community tradition'
  },
  { 
    area: 'Independence / Broadview Hts', 
    al: '$4,500 - $5,800', 
    mc: '$5,400 - $7,000', 
    il: '$2,500 - $3,600',
    color: COLORS.heatValue,
    bestFor: 'Central location & highway accessibility'
  },
];

// Care types for card display
const CARE_TYPES = [
  {
    name: 'Memory Care',
    price: '$4,500 - $8,500/mo',
    avgPrice: '$6,200',
    description: 'Specialized 24/7 care for Alzheimer\'s and dementia in secure environments.',
    includes: ['Secure environment', '24/7 trained staff', 'All meals included', 'Memory programs'],
    highlight: false,
  },
  {
    name: 'Assisted Living',
    price: '$3,200 - $6,500/mo',
    avgPrice: '$4,800',
    description: 'Daily assistance while maintaining independence in a supportive community.',
    includes: ['Private apartment', 'Personal care help', 'Three meals daily', 'Activities'],
    highlight: true,
  },
  {
    name: 'Independent Living',
    price: '$2,200 - $4,500/mo',
    avgPrice: '$3,200',
    description: 'Maintenance-free living for active seniors with dining and amenities.',
    includes: ['Private apartment', 'Restaurant dining', 'Social activities', 'Housekeeping'],
    highlight: false,
  },
];

// Home vs Community comparison
const HOME_VS_COMMUNITY = [
  { item: 'Housing/Rent', home: '$1,500 - $2,500', community: 'Included' },
  { item: 'Utilities', home: '$200 - $400', community: 'Included' },
  { item: 'Food/Groceries', home: '$400 - $600', community: 'Included' },
  { item: 'Home Maintenance', home: '$200 - $500', community: 'Included' },
  { item: 'Transportation', home: '$200 - $400', community: 'Included' },
  { item: 'Home Care (20 hrs/wk)', home: '$2,000 - $3,200', community: 'Included' },
  { item: 'ESTIMATED TOTAL', home: '$4,500 - $7,600', community: '$3,200 - $6,500' },
];

// QR Code placeholder
function QRCodePlaceholder() {
  return (
    <View style={styles.leadMagnetQR}>
      <Svg width="42" height="42" viewBox="0 0 42 42">
        <Rect x="0" y="0" width="14" height="14" fill={COLORS.teal} />
        <Rect x="28" y="0" width="14" height="14" fill={COLORS.teal} />
        <Rect x="0" y="28" width="14" height="14" fill={COLORS.teal} />
        <Rect x="4" y="4" width="6" height="6" fill={COLORS.white} />
        <Rect x="32" y="4" width="6" height="6" fill={COLORS.white} />
        <Rect x="4" y="32" width="6" height="6" fill={COLORS.white} />
        <Rect x="18" y="4" width="6" height="6" fill={COLORS.teal} />
        <Rect x="18" y="18" width="6" height="6" fill={COLORS.teal} />
        <Rect x="4" y="18" width="6" height="6" fill={COLORS.teal} />
        <Rect x="32" y="18" width="6" height="6" fill={COLORS.teal} />
        <Rect x="18" y="32" width="6" height="6" fill={COLORS.teal} />
        <Rect x="32" y="32" width="6" height="6" fill={COLORS.teal} />
      </Svg>
    </View>
  );
}

// ============================================================================
// TYPES
// ============================================================================

interface PricingGuidePDFProps {
  recipientName: string;
  email: string;
  generatedDate?: string;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function PricingGuidePDF({
  recipientName,
  email,
  generatedDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
}: PricingGuidePDFProps) {
  // Sanitize inputs
  const cleanName = sanitizeText(recipientName) || 'Valued Family';
  const cleanDate = sanitizeText(generatedDate);

  return (
    <Document>
      {/* ================================================================== */}
      {/* PAGE 1: COVER */}
      {/* ================================================================== */}
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
          
          <Text style={styles.coverPreparedFor}>PREPARED FOR</Text>
          <Text style={styles.coverName}>{cleanName}</Text>
        </View>
        
        <View style={styles.coverFooter}>
          <Link src={PHONE_LINK} style={{ textDecoration: 'none' }}>
            <Text style={styles.coverPhone}>{PHONE_NUMBER}</Text>
          </Link>
          <Text style={styles.coverDate}>Generated {cleanDate}</Text>
        </View>
      </Page>

      {/* ================================================================== */}
      {/* PAGE 2: EXECUTIVE SUMMARY WITH 3D STATS */}
      {/* ================================================================== */}
      <Page size="LETTER" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerLogo}>Guide for Seniors</Text>
          <Text style={styles.headerPage}>Executive Summary</Text>
        </View>

        <Text style={styles.pageTitle}>2026 Cleveland Market Overview</Text>

        {/* 3D Stat Boxes - High Impact Typography */}
        <View style={styles.statRow}>
          <View style={styles.statBox3D}>
            <Text style={styles.statNumber3D}>$4,800</Text>
            <Text style={styles.statLabel}>AVG. ASSISTED</Text>
            <Text style={styles.statSubLabel}>LIVING / MONTH</Text>
          </View>
          <View style={styles.statBox3D}>
            <Text style={styles.statNumber3D}>$6,200</Text>
            <Text style={styles.statLabel}>AVG. MEMORY</Text>
            <Text style={styles.statSubLabel}>CARE / MONTH</Text>
          </View>
          <View style={styles.statBox3D}>
            <Text style={styles.statNumber3D}>$3,200</Text>
            <Text style={styles.statLabel}>AVG. INDEPENDENT</Text>
            <Text style={styles.statSubLabel}>LIVING / MONTH</Text>
          </View>
        </View>

        {/* Key Findings */}
        <View style={styles.executiveSummary}>
          <Text style={styles.executiveTitle}>Key Findings for 2026</Text>
          
          <View style={styles.keyFinding}>
            <View style={styles.keyFindingIcon}>
              <Text style={styles.keyFindingCheck}>&#10003;</Text>
            </View>
            <Text style={styles.keyFindingText}>
              Cleveland senior living costs are <Text style={{ fontWeight: 'bold' }}>5-15% below the national average</Text>, making it one of the most affordable metro areas for quality care.
            </Text>
          </View>
          
          <View style={styles.keyFinding}>
            <View style={styles.keyFindingIcon}>
              <Text style={styles.keyFindingCheck}>&#10003;</Text>
            </View>
            <Text style={styles.keyFindingText}>
              Prices vary by <Text style={{ fontWeight: 'bold' }}>up to 40%</Text> depending on neighborhood - Beachwood commands premium rates; Parma offers exceptional value.
            </Text>
          </View>
          
          <View style={styles.keyFinding}>
            <View style={styles.keyFindingIcon}>
              <Text style={styles.keyFindingCheck}>&#10003;</Text>
            </View>
            <Text style={styles.keyFindingText}>
              All-inclusive senior living is often <Text style={{ fontWeight: 'bold' }}>more affordable than staying home</Text> when factoring in home care, meals, utilities, and maintenance.
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>What's in This Report</Text>
        <View style={styles.twoColumn}>
          <View style={styles.column}>
            <View style={styles.bulletRow}>
              <Text style={styles.bulletCheck}>&#10003;</Text>
              <Text style={styles.bulletText}>2026 pricing by care type</Text>
            </View>
            <View style={styles.bulletRow}>
              <Text style={styles.bulletCheck}>&#10003;</Text>
              <Text style={styles.bulletText}>Neighborhood cost breakdown</Text>
            </View>
            <View style={styles.bulletRow}>
              <Text style={styles.bulletCheck}>&#10003;</Text>
              <Text style={styles.bulletText}>Home vs. community comparison</Text>
            </View>
          </View>
          <View style={styles.column}>
            <View style={styles.bulletRow}>
              <Text style={styles.bulletCheck}>&#10003;</Text>
              <Text style={styles.bulletText}>Hidden costs checklist</Text>
            </View>
            <View style={styles.bulletRow}>
              <Text style={styles.bulletCheck}>&#10003;</Text>
              <Text style={styles.bulletText}>Financial assistance programs</Text>
            </View>
            <View style={styles.bulletRow}>
              <Text style={styles.bulletCheck}>&#10003;</Text>
              <Text style={styles.bulletText}>Questions to ask communities</Text>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>{WEBSITE}</Text>
          <Link src={PHONE_LINK}>
            <Text style={styles.footerPhone}>{PHONE_NUMBER}</Text>
          </Link>
        </View>
      </Page>

      {/* ================================================================== */}
      {/* PAGE 3: CARE TYPE CARDS */}
      {/* ================================================================== */}
      <Page size="LETTER" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerLogo}>Guide for Seniors</Text>
          <Text style={styles.headerPage}>Pricing by Care Type</Text>
        </View>

        <Text style={styles.pageTitle}>2026 Pricing by Care Type</Text>
        <Text style={styles.paragraph}>
          Understanding the different levels of senior care helps you budget appropriately. Here's what each care type costs in Greater Cleveland:
        </Text>

        {/* Side-by-Side Care Type Cards */}
        <View style={styles.careCardsRow}>
          {CARE_TYPES.map((care, index) => (
            <View key={index} style={care.highlight ? styles.careCardHighlight : styles.careCard}>
              <Text style={styles.careCardTitle}>{care.name}</Text>
              <Text style={styles.careCardPrice}>{care.price}</Text>
              <Text style={styles.careCardDesc}>{care.description}</Text>
              {care.includes.map((item, i) => (
                <Text key={i} style={styles.careCardBullet}>&#8226; {item}</Text>
              ))}
            </View>
          ))}
        </View>

        {/* Level of Care Info */}
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Understanding "Level of Care" Fees</Text>
          <Text style={styles.infoText}>
            Base rates typically exclude Level of Care fees for medication management, incontinence care, and mobility assistance. These fees range from $500 to $1,500 per month depending on needs. Always request a detailed care assessment before signing.
          </Text>
        </View>

        {/* Callout */}
        <View style={styles.calloutBox}>
          <Text style={styles.calloutTitle}>Northeast Ohio Advantage</Text>
          <Text style={styles.calloutText}>
            Local senior care is 5-15% more affordable than the national average. Cleveland families benefit from excellent quality at significantly lower costs compared to coastal cities.
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>{WEBSITE}</Text>
          <Link src={PHONE_LINK}>
            <Text style={styles.footerPhone}>{PHONE_NUMBER}</Text>
          </Link>
        </View>
      </Page>

      {/* ================================================================== */}
      {/* PAGE 4: NEIGHBORHOOD HEATMAP + LEAD MAGNET */}
      {/* ================================================================== */}
      <Page size="LETTER" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerLogo}>Guide for Seniors</Text>
          <Text style={styles.headerPage}>Neighborhood Pricing</Text>
        </View>

        <Text style={styles.pageTitle}>Pricing by Neighborhood</Text>
        <Text style={styles.paragraph}>
          Location significantly impacts costs. This heatmap shows 2026 pricing across Greater Cleveland, with "Best For" recommendations.
        </Text>

        {/* Heatmap Table */}
        <View style={styles.heatmapTable}>
          <View style={styles.heatmapHeader}>
            <Text style={[styles.heatmapHeaderCell, { width: '32%' }]}>Neighborhood</Text>
            <Text style={[styles.heatmapHeaderCell, { width: '22%' }]}>Assisted Living</Text>
            <Text style={[styles.heatmapHeaderCell, { width: '22%' }]}>Memory Care</Text>
            <Text style={[styles.heatmapHeaderCell, { width: '24%' }]}>Best For</Text>
          </View>
          {NEIGHBORHOOD_PRICING.map((row, index) => (
            <View key={index} style={[styles.heatmapRow, { backgroundColor: row.color }]}>
              <View style={{ width: '32%' }}>
                <Text style={styles.heatmapCellBold}>{row.area}</Text>
              </View>
              <Text style={[styles.heatmapCell, { width: '22%' }]}>{row.al}</Text>
              <Text style={[styles.heatmapCell, { width: '22%' }]}>{row.mc}</Text>
              <View style={{ width: '24%' }}>
                <Text style={styles.heatmapBestFor}>{row.bestFor}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Medical Anchor Footnote */}
        <Text style={styles.footnote}>
          Strategic Location: We prioritize communities within 5-10 miles of major medical hubs like St. John Medical Center, Cleveland Clinic, and University Hospitals for rapid response care and specialist access.
        </Text>

        {/* Lead Magnet Box */}
        <View style={styles.leadMagnetBox}>
          <View style={styles.leadMagnetContent}>
            <Text style={styles.leadMagnetTitle}>Looking for a specific layout?</Text>
            <Text style={styles.leadMagnetText}>
              Scan to view 1-Bedroom and Studio floor plans available in Greater Cleveland communities.
            </Text>
          </View>
          <QRCodePlaceholder />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>{WEBSITE}</Text>
          <Link src={PHONE_LINK}>
            <Text style={styles.footerPhone}>{PHONE_NUMBER}</Text>
          </Link>
        </View>
      </Page>

      {/* ================================================================== */}
      {/* PAGE 5: HOME VS COMMUNITY + CAREGIVER BURNOUT */}
      {/* ================================================================== */}
      <Page size="LETTER" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerLogo}>Guide for Seniors</Text>
          <Text style={styles.headerPage}>Cost Comparison</Text>
        </View>

        <Text style={styles.pageTitle}>Home Care vs. Community Living</Text>
        <Text style={styles.paragraph}>
          Many families assume staying home is more affordable. The reality often surprises them:
        </Text>

        {/* Comparison Table */}
        <View style={styles.comparisonBox}>
          <Text style={styles.comparisonTitle}>Monthly Cost Comparison</Text>
          <View style={[styles.comparisonRow, { borderBottomWidth: 2, paddingBottom: 8, marginBottom: 8 }]}>
            <Text style={[styles.comparisonLabel, { fontWeight: 'bold' }]}>EXPENSE</Text>
            <Text style={[styles.comparisonValue, { fontWeight: 'bold' }]}>AT HOME</Text>
            <Text style={[styles.comparisonValue, { fontWeight: 'bold', color: COLORS.teal }]}>COMMUNITY</Text>
          </View>
          {HOME_VS_COMMUNITY.map((row, index) => (
            <View key={index} style={[
              styles.comparisonRow, 
              index === HOME_VS_COMMUNITY.length - 1 ? { 
                backgroundColor: COLORS.tealPale, 
                marginHorizontal: -16, 
                paddingHorizontal: 16,
                marginBottom: 0,
                paddingTop: 8,
                paddingBottom: 8,
                borderRadius: 4,
                borderBottomWidth: 0,
              } : {}
            ]}>
              <Text style={[styles.comparisonLabel, index === HOME_VS_COMMUNITY.length - 1 ? { fontWeight: 'bold' } : {}]}>
                {row.item}
              </Text>
              <Text style={styles.comparisonValue}>{row.home}</Text>
              <Text style={[styles.comparisonValue, { color: COLORS.teal }]}>{row.community}</Text>
            </View>
          ))}
        </View>

        {/* Caregiver Burnout Section */}
        <View style={styles.burnoutBox}>
          <Text style={styles.burnoutTitle}>The Unseen Cost: Family Caregiver Burnout</Text>
          <Text style={styles.burnoutText}>
            Unpaid family caregiving often results in $2,000+ in monthly lost productivity, missed work, and personal health impacts. Studies show 40% of family caregivers experience depression. Moving to a community can restore family relationships and improve outcomes for everyone.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Hidden Costs of Staying Home</Text>
        <View style={styles.twoColumn}>
          <View style={styles.column}>
            <View style={styles.bulletRow}>
              <Text style={styles.bulletCheck}>&#8226;</Text>
              <Text style={styles.bulletText}>Home modifications (ramps, grab bars)</Text>
            </View>
            <View style={styles.bulletRow}>
              <Text style={styles.bulletCheck}>&#8226;</Text>
              <Text style={styles.bulletText}>Emergency response systems</Text>
            </View>
            <View style={styles.bulletRow}>
              <Text style={styles.bulletCheck}>&#8226;</Text>
              <Text style={styles.bulletText}>Backup caregivers for time off</Text>
            </View>
          </View>
          <View style={styles.column}>
            <View style={styles.bulletRow}>
              <Text style={styles.bulletCheck}>&#8226;</Text>
              <Text style={styles.bulletText}>Social isolation and loneliness</Text>
            </View>
            <View style={styles.bulletRow}>
              <Text style={styles.bulletCheck}>&#8226;</Text>
              <Text style={styles.bulletText}>Family caregiver burnout</Text>
            </View>
            <View style={styles.bulletRow}>
              <Text style={styles.bulletCheck}>&#8226;</Text>
              <Text style={styles.bulletText}>Lack of 24/7 supervision</Text>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>{WEBSITE}</Text>
          <Link src={PHONE_LINK}>
            <Text style={styles.footerPhone}>{PHONE_NUMBER}</Text>
          </Link>
        </View>
      </Page>

      {/* ================================================================== */}
      {/* PAGE 6: HIDDEN COSTS + EXPERT TIP */}
      {/* ================================================================== */}
      <Page size="LETTER" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerLogo}>Guide for Seniors</Text>
          <Text style={styles.headerPage}>Hidden Costs</Text>
        </View>

        <Text style={styles.pageTitle}>Hidden Costs Checklist</Text>
        <Text style={styles.paragraph}>
          Before signing a contract, understand ALL the costs. Use this checklist:
        </Text>

        {/* Expert Tip - Red Flag Box */}
        <View style={styles.expertTipBox} wrap={false}>
          <View style={styles.expertTipHeader}>
            <View style={styles.expertTipIcon}>
              <Text style={styles.expertTipIconText}>!</Text>
            </View>
            <Text style={styles.expertTipTitle}>Expert Tip: Contract Red Flag</Text>
          </View>
          <Text style={styles.expertTipText}>
            <Text style={{ fontWeight: 'bold' }}>Wait! Before you sign</Text>, ask about the "30-day notice" policy. Some Cleveland communities require 60 days, which can cost you thousands in overlapping rent if you need to move quickly. Get the notice period in writing.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Costs NOT in Base Rate</Text>
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
              <Text style={styles.checklistText}>Cable TV and phone</Text>
            </View>
            <View style={styles.checklistItem}>
              <View style={styles.checklistBox} />
              <Text style={styles.checklistText}>Pet deposits/fees</Text>
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

        <Text style={styles.sectionTitle}>Questions to Ask</Text>
        <View style={styles.checklistItem}>
          <View style={styles.checklistBox} />
          <Text style={styles.checklistText}>"What is included in the base monthly rate?"</Text>
        </View>
        <View style={styles.checklistItem}>
          <View style={styles.checklistBox} />
          <Text style={styles.checklistText}>"What was your last rate increase and when?"</Text>
        </View>
        <View style={styles.checklistItem}>
          <View style={styles.checklistBox} />
          <Text style={styles.checklistText}>"Do you accept Medicaid waiver? If so, after how long?"</Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>{WEBSITE}</Text>
          <Link src={PHONE_LINK}>
            <Text style={styles.footerPhone}>{PHONE_NUMBER}</Text>
          </Link>
        </View>
      </Page>

      {/* ================================================================== */}
      {/* PAGE 7: FINANCIAL ASSISTANCE */}
      {/* ================================================================== */}
      <Page size="LETTER" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerLogo}>Guide for Seniors</Text>
          <Text style={styles.headerPage}>Financial Assistance</Text>
        </View>

        <Text style={styles.pageTitle}>Financial Assistance Programs</Text>
        <Text style={styles.paragraph}>
          Several programs can help Ohio families afford senior living:
        </Text>

        <View style={styles.careCardsRow}>
          <View style={styles.careCardHighlight}>
            <Text style={styles.careCardTitle}>VA Aid & Attendance</Text>
            <Text style={styles.careCardPrice}>Up to $2,727/mo</Text>
            <Text style={styles.careCardDesc}>
              Tax-free benefit for veterans and surviving spouses who need help with daily activities.
            </Text>
            <Text style={styles.careCardBullet}>&#8226; Single veteran: $2,295</Text>
            <Text style={styles.careCardBullet}>&#8226; Veteran w/ spouse: $2,727</Text>
            <Text style={styles.careCardBullet}>&#8226; Surviving spouse: $1,478</Text>
          </View>
          <View style={styles.careCard}>
            <Text style={styles.careCardTitle}>Ohio Medicaid Waivers</Text>
            <Text style={styles.careCardPrice}>Income-Based</Text>
            <Text style={styles.careCardDesc}>
              PASSPORT and Assisted Living Waiver programs for qualifying Ohio seniors.
            </Text>
            <Text style={styles.careCardBullet}>&#8226; PASSPORT Waiver</Text>
            <Text style={styles.careCardBullet}>&#8226; Assisted Living Waiver</Text>
            <Text style={styles.careCardBullet}>&#8226; Must meet care criteria</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Private Pay Options</Text>
        <View style={styles.twoColumn}>
          <View style={styles.column}>
            <View style={styles.bulletRow}>
              <Text style={styles.bulletCheck}>&#10003;</Text>
              <Text style={styles.bulletText}>Retirement savings (401k, IRA)</Text>
            </View>
            <View style={styles.bulletRow}>
              <Text style={styles.bulletCheck}>&#10003;</Text>
              <Text style={styles.bulletText}>Long-term care insurance</Text>
            </View>
            <View style={styles.bulletRow}>
              <Text style={styles.bulletCheck}>&#10003;</Text>
              <Text style={styles.bulletText}>Life insurance conversion</Text>
            </View>
          </View>
          <View style={styles.column}>
            <View style={styles.bulletRow}>
              <Text style={styles.bulletCheck}>&#10003;</Text>
              <Text style={styles.bulletText}>Home equity (sale or HELOC)</Text>
            </View>
            <View style={styles.bulletRow}>
              <Text style={styles.bulletCheck}>&#10003;</Text>
              <Text style={styles.bulletText}>Reverse mortgage</Text>
            </View>
            <View style={styles.bulletRow}>
              <Text style={styles.bulletCheck}>&#10003;</Text>
              <Text style={styles.bulletText}>Family contributions</Text>
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
          <Text style={styles.footerText}>{WEBSITE}</Text>
          <Link src={PHONE_LINK}>
            <Text style={styles.footerPhone}>{PHONE_NUMBER}</Text>
          </Link>
        </View>
      </Page>

      {/* ================================================================== */}
      {/* PAGE 8: NEXT STEPS + CTA */}
      {/* ================================================================== */}
      <Page size="LETTER" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerLogo}>Guide for Seniors</Text>
          <Text style={styles.headerPage}>Next Steps</Text>
        </View>

        <Text style={styles.pageTitle}>Your Next Steps</Text>

        <View style={styles.executiveSummary}>
          <Text style={styles.executiveTitle}>Recommended Action Plan</Text>
          <View style={styles.checklistItem}>
            <Text style={{ fontSize: 14, fontWeight: 'bold', color: COLORS.teal, marginRight: 10 }}>1</Text>
            <Text style={[styles.checklistText, { fontSize: 11 }]}>
              <Text style={{ fontWeight: 'bold' }}>Assess your budget</Text> - Review this guide's pricing against your financial resources
            </Text>
          </View>
          <View style={styles.checklistItem}>
            <Text style={{ fontSize: 14, fontWeight: 'bold', color: COLORS.teal, marginRight: 10 }}>2</Text>
            <Text style={[styles.checklistText, { fontSize: 11 }]}>
              <Text style={{ fontWeight: 'bold' }}>Identify care needs</Text> - Take our free assessment at guideforseniors.com/assessment
            </Text>
          </View>
          <View style={styles.checklistItem}>
            <Text style={{ fontSize: 14, fontWeight: 'bold', color: COLORS.teal, marginRight: 10 }}>3</Text>
            <Text style={[styles.checklistText, { fontSize: 11 }]}>
              <Text style={{ fontWeight: 'bold' }}>Explore financial options</Text> - Check VA benefits and Ohio Medicaid eligibility
            </Text>
          </View>
          <View style={styles.checklistItem}>
            <Text style={{ fontSize: 14, fontWeight: 'bold', color: COLORS.teal, marginRight: 10 }}>4</Text>
            <Text style={[styles.checklistText, { fontSize: 11 }]}>
              <Text style={{ fontWeight: 'bold' }}>Schedule tours</Text> - Visit 3-5 communities that fit your needs
            </Text>
          </View>
          <View style={styles.checklistItem}>
            <Text style={{ fontSize: 14, fontWeight: 'bold', color: COLORS.teal, marginRight: 10 }}>5</Text>
            <Text style={[styles.checklistText, { fontSize: 11 }]}>
              <Text style={{ fontWeight: 'bold' }}>Call Guide for Seniors</Text> - Get free, personalized recommendations
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Why Work with Us?</Text>
        <View style={styles.twoColumn}>
          <View style={styles.column}>
            <View style={styles.bulletRow}>
              <Text style={styles.bulletCheck}>&#10003;</Text>
              <Text style={styles.bulletText}><Text style={{ fontWeight: 'bold' }}>100% Free</Text> - No cost to you</Text>
            </View>
            <View style={styles.bulletRow}>
              <Text style={styles.bulletCheck}>&#10003;</Text>
              <Text style={styles.bulletText}><Text style={{ fontWeight: 'bold' }}>Local Experts</Text> - We know Cleveland</Text>
            </View>
            <View style={styles.bulletRow}>
              <Text style={styles.bulletCheck}>&#10003;</Text>
              <Text style={styles.bulletText}><Text style={{ fontWeight: 'bold' }}>Unbiased</Text> - Your best interest first</Text>
            </View>
          </View>
          <View style={styles.column}>
            <View style={styles.bulletRow}>
              <Text style={styles.bulletCheck}>&#10003;</Text>
              <Text style={styles.bulletText}><Text style={{ fontWeight: 'bold' }}>Tour Scheduling</Text> - We handle logistics</Text>
            </View>
            <View style={styles.bulletRow}>
              <Text style={styles.bulletCheck}>&#10003;</Text>
              <Text style={styles.bulletText}><Text style={{ fontWeight: 'bold' }}>Negotiation</Text> - We know what to ask</Text>
            </View>
            <View style={styles.bulletRow}>
              <Text style={styles.bulletCheck}>&#10003;</Text>
              <Text style={styles.bulletText}><Text style={{ fontWeight: 'bold' }}>Support</Text> - Through the whole journey</Text>
            </View>
          </View>
        </View>

        <View style={[styles.ctaBox, { marginTop: 30 }]}>
          <Text style={styles.ctaTitle}>Ready to Get Started?</Text>
          <Text style={styles.ctaText}>
            Call us today for a free consultation. We will discuss your{'\n'}
            needs and recommend communities that are the right fit.
          </Text>
          <Link src={PHONE_LINK}>
            <Text style={styles.ctaPhone}>{PHONE_NUMBER}</Text>
          </Link>
          <Text style={{ fontSize: 10, color: COLORS.tealPale, marginTop: 8 }}>
            {WEBSITE}
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>{WEBSITE}</Text>
          <Link src={PHONE_LINK}>
            <Text style={styles.footerPhone}>{PHONE_NUMBER}</Text>
          </Link>
        </View>
      </Page>
    </Document>
  );
}

export default PricingGuidePDF;
