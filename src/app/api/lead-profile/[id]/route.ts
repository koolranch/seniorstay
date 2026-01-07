import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// =============================================================================
// CLINICAL PROFILE PDF GENERATOR
// Generates a professional "Qualified Lead Profile" for community referrals
// =============================================================================

interface CalculatorMetaData {
  homeValue?: number;
  mortgage?: number;
  groceries?: number;
  utilities?: number;
  maintenance?: number;
  homeCareHours?: number;
  homeCareCost?: number;
  propertyTax?: number;
  totalHomeCost?: number;
  selectedLocation?: string;
  seniorLivingCost?: number;
  valueGap?: number;
  valueGapPercent?: number;
  isHighValue?: boolean;
  monthlySavings?: number;
  annualSavings?: number;
}

function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://hncgnxbooghjhpncujzx.supabase.co';
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseServiceKey) {
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhuY2dueGJvb2doamhwbmN1anp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyMTI0ODIsImV4cCI6MjA1OTc4ODQ4Mn0.mdAL87W0h4PN7Xu8ESjjDxzjW_H3YH55i-FqAE5SXcs';
    return createClient(supabaseUrl, anonKey);
  }
  
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

/**
 * Calculate financial readiness score (0-100)
 */
function calculateFinancialReadinessScore(metaData?: CalculatorMetaData | null): {
  score: number;
  rating: 'Excellent' | 'Good' | 'Moderate' | 'Needs Review';
  factors: string[];
} {
  if (!metaData) {
    return { score: 50, rating: 'Moderate', factors: ['Calculator data not available'] };
  }
  
  let score = 50; // Base score
  const factors: string[] = [];
  
  // Home equity indicator (up to +30)
  if (metaData.homeValue) {
    if (metaData.homeValue > 500000) {
      score += 30;
      factors.push('Significant home equity ($500k+)');
    } else if (metaData.homeValue > 350000) {
      score += 25;
      factors.push('Strong home equity ($350k+)');
    } else if (metaData.homeValue > 250000) {
      score += 15;
      factors.push('Moderate home equity');
    } else if (metaData.homeValue > 150000) {
      score += 5;
      factors.push('Some home equity available');
    }
  }
  
  // Value gap indicator (up to +20)
  if (metaData.valueGap) {
    if (metaData.valueGap > 1000) {
      score += 20;
      factors.push('Senior living significantly cheaper than home ($1k+/mo savings)');
    } else if (metaData.valueGap > 500) {
      score += 15;
      factors.push('Senior living cheaper than home ($500+/mo savings)');
    } else if (metaData.valueGap > 0) {
      score += 10;
      factors.push('Comparable costs to staying home');
    }
  }
  
  // Budget alignment (up to +10)
  if (metaData.seniorLivingCost && metaData.totalHomeCost) {
    if (metaData.seniorLivingCost <= metaData.totalHomeCost * 1.1) {
      score += 10;
      factors.push('Budget-aligned with current expenses');
    }
  }
  
  // Determine rating
  let rating: 'Excellent' | 'Good' | 'Moderate' | 'Needs Review';
  if (score >= 85) rating = 'Excellent';
  else if (score >= 70) rating = 'Good';
  else if (score >= 50) rating = 'Moderate';
  else rating = 'Needs Review';
  
  return { score: Math.min(100, score), rating, factors };
}

/**
 * Generate HTML profile document
 */
function generateProfileHTML(lead: {
  id: string;
  fullName: string;
  email?: string;
  phone?: string;
  careType?: string;
  moveInTimeline?: string;
  communityName?: string;
  sourceSlug?: string;
  urgencyScore: number;
  priority: string;
  createdAt: string;
  is_high_value: boolean;
  home_value?: number;
  value_gap?: number;
  calculated_budget?: number;
  estimated_commission?: number;
  meta_data?: CalculatorMetaData | null;
  notes?: string;
}): string {
  const metaData = lead.meta_data;
  const financialReadiness = calculateFinancialReadinessScore(metaData);
  const createdDate = new Date(lead.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Qualified Lead Profile - ${lead.fullName}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #1e293b;
      background: #f8fafc;
      padding: 2rem;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
      background: white;
      border-radius: 16px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #0d9488 0%, #0f766e 100%);
      color: white;
      padding: 2rem;
    }
    .header h1 { font-size: 1.5rem; margin-bottom: 0.25rem; }
    .header p { opacity: 0.9; font-size: 0.875rem; }
    .badge {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
      background: rgba(255,255,255,0.2);
      margin-top: 0.75rem;
    }
    .badge.high-value { background: #fbbf24; color: #78350f; }
    .content { padding: 2rem; }
    .section { margin-bottom: 2rem; }
    .section-title {
      font-size: 0.875rem;
      font-weight: 600;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 1rem;
      padding-bottom: 0.5rem;
      border-bottom: 2px solid #e2e8f0;
    }
    .info-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
    }
    .info-item label {
      display: block;
      font-size: 0.75rem;
      color: #64748b;
      margin-bottom: 0.25rem;
    }
    .info-item .value {
      font-size: 1rem;
      font-weight: 500;
      color: #1e293b;
    }
    .financial-score {
      background: #f0fdf4;
      border: 2px solid #86efac;
      border-radius: 12px;
      padding: 1.5rem;
      text-align: center;
    }
    .score-circle {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      font-weight: 700;
      margin: 0 auto 1rem;
    }
    .score-rating {
      font-size: 1.25rem;
      font-weight: 600;
      color: #16a34a;
    }
    .factors {
      text-align: left;
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid #bbf7d0;
    }
    .factors li {
      font-size: 0.875rem;
      color: #166534;
      margin-bottom: 0.5rem;
      padding-left: 1.5rem;
      position: relative;
    }
    .factors li::before {
      content: "✓";
      position: absolute;
      left: 0;
      color: #22c55e;
    }
    .financial-breakdown {
      background: #f8fafc;
      border-radius: 12px;
      padding: 1.5rem;
    }
    .breakdown-row {
      display: flex;
      justify-content: space-between;
      padding: 0.75rem 0;
      border-bottom: 1px solid #e2e8f0;
    }
    .breakdown-row:last-child { border-bottom: none; }
    .breakdown-label { color: #64748b; }
    .breakdown-value { font-weight: 600; color: #1e293b; }
    .breakdown-value.positive { color: #16a34a; }
    .breakdown-value.negative { color: #dc2626; }
    .commission-box {
      background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
      border-radius: 12px;
      padding: 1.5rem;
      text-align: center;
    }
    .commission-label {
      font-size: 0.875rem;
      color: #92400e;
      margin-bottom: 0.5rem;
    }
    .commission-value {
      font-size: 2rem;
      font-weight: 700;
      color: #78350f;
    }
    .footer {
      background: #f8fafc;
      padding: 1.5rem 2rem;
      font-size: 0.75rem;
      color: #64748b;
      text-align: center;
    }
    @media print {
      body { background: white; padding: 0; }
      .container { box-shadow: none; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>QUALIFIED LEAD PROFILE</h1>
      <p>Guide For Seniors - Cleveland Senior Living Advisor</p>
      ${lead.is_high_value ? '<span class="badge high-value">⭐ HIGH-VALUE PROSPECT</span>' : ''}
    </div>
    
    <div class="content">
      <!-- Prospect Information -->
      <div class="section">
        <h2 class="section-title">Prospect Information</h2>
        <div class="info-grid">
          <div class="info-item">
            <label>Full Name</label>
            <div class="value">${lead.fullName}</div>
          </div>
          <div class="info-item">
            <label>Phone</label>
            <div class="value">${lead.phone || 'Not provided'}</div>
          </div>
          <div class="info-item">
            <label>Email</label>
            <div class="value">${lead.email || 'Not provided'}</div>
          </div>
          <div class="info-item">
            <label>Inquiry Date</label>
            <div class="value">${createdDate}</div>
          </div>
          <div class="info-item">
            <label>Care Type Needed</label>
            <div class="value">${lead.careType || 'Not specified'}</div>
          </div>
          <div class="info-item">
            <label>Move-in Timeline</label>
            <div class="value">${lead.moveInTimeline || 'Not specified'}</div>
          </div>
          <div class="info-item">
            <label>Source Location</label>
            <div class="value">${lead.sourceSlug?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Direct'}</div>
          </div>
          <div class="info-item">
            <label>Urgency Score</label>
            <div class="value">${lead.urgencyScore}/100 (${lead.priority.toUpperCase()})</div>
          </div>
        </div>
      </div>
      
      <!-- Financial Readiness Score -->
      <div class="section">
        <h2 class="section-title">Financial Readiness Assessment</h2>
        <div class="financial-score">
          <div class="score-circle">${financialReadiness.score}</div>
          <div class="score-rating">${financialReadiness.rating}</div>
          <ul class="factors">
            ${financialReadiness.factors.map(f => `<li>${f}</li>`).join('')}
          </ul>
        </div>
      </div>
      
      ${metaData ? `
      <!-- Financial Breakdown -->
      <div class="section">
        <h2 class="section-title">Calculator Data - Financial Breakdown</h2>
        <div class="financial-breakdown">
          ${metaData.homeValue ? `
          <div class="breakdown-row">
            <span class="breakdown-label">Home Value</span>
            <span class="breakdown-value">$${metaData.homeValue.toLocaleString()}</span>
          </div>
          ` : ''}
          ${metaData.propertyTax ? `
          <div class="breakdown-row">
            <span class="breakdown-label">Monthly Property Tax (2.18%)</span>
            <span class="breakdown-value">$${metaData.propertyTax.toLocaleString()}</span>
          </div>
          ` : ''}
          ${metaData.totalHomeCost ? `
          <div class="breakdown-row">
            <span class="breakdown-label">Total Cost at Home</span>
            <span class="breakdown-value">$${metaData.totalHomeCost.toLocaleString()}/mo</span>
          </div>
          ` : ''}
          ${metaData.seniorLivingCost ? `
          <div class="breakdown-row">
            <span class="breakdown-label">Senior Living Cost (${metaData.selectedLocation?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Cleveland'})</span>
            <span class="breakdown-value">$${metaData.seniorLivingCost.toLocaleString()}/mo</span>
          </div>
          ` : ''}
          ${metaData.valueGap !== undefined ? `
          <div class="breakdown-row">
            <span class="breakdown-label">Monthly Value Gap</span>
            <span class="breakdown-value ${metaData.valueGap > 0 ? 'positive' : 'negative'}">
              ${metaData.valueGap > 0 ? '+' : ''}$${metaData.valueGap.toLocaleString()}/mo
            </span>
          </div>
          ` : ''}
          ${metaData.annualSavings ? `
          <div class="breakdown-row">
            <span class="breakdown-label">Annual Savings Potential</span>
            <span class="breakdown-value positive">$${metaData.annualSavings.toLocaleString()}/year</span>
          </div>
          ` : ''}
        </div>
      </div>
      ` : ''}
      
      <!-- Commission -->
      <div class="section">
        <h2 class="section-title">Referral Terms</h2>
        <div class="commission-box">
          <div class="commission-label">Estimated Commission (100% First Month)</div>
          <div class="commission-value">$${(lead.estimated_commission || 5520).toLocaleString()}</div>
        </div>
      </div>
      
      ${lead.notes ? `
      <!-- Notes -->
      <div class="section">
        <h2 class="section-title">Additional Notes</h2>
        <p style="white-space: pre-wrap; color: #475569;">${lead.notes}</p>
      </div>
      ` : ''}
    </div>
    
    <div class="footer">
      <p>Lead ID: ${lead.id}</p>
      <p>Generated by Guide For Seniors • guideforseniors.com • (216) 677-4630</p>
      <p>This is a formal referral. Please acknowledge receipt to secure placement fee agreement.</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

// =============================================================================
// API ROUTE HANDLER
// =============================================================================

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json({ error: 'Lead ID required' }, { status: 400 });
    }
    
    const supabase = getSupabaseAdmin();
    
    const { data: lead, error } = await supabase
      .from('Lead')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error || !lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }
    
    // Check for format query param
    const format = request.nextUrl.searchParams.get('format');
    
    if (format === 'json') {
      // Return raw JSON data
      return NextResponse.json(lead);
    }
    
    // Default: Return HTML profile
    const html = generateProfileHTML(lead);
    
    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': `inline; filename="lead-profile-${id}.html"`,
      },
    });
    
  } catch (error) {
    console.error('[Lead Profile] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

