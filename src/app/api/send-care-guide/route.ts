import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { renderToBuffer } from '@react-pdf/renderer';
import { CareGuidePDF } from '@/components/pdf/CareGuidePDF';
import { createElement } from 'react';

// Initialize Resend (will be undefined if RESEND_API_KEY is not set)
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// Types
interface AssessmentData {
  score: number;
  recommendation: string;
  matchedCommunities: string[];
  answers: Record<string, string | string[]>;
}

interface SendCareGuideRequest {
  recipientName: string;
  email: string;
  assessmentData: AssessmentData;
  matchedCommunities?: Array<{
    name: string;
    city: string;
    careTypes: string[];
    priceRange?: string;
  }>;
}

/**
 * POST /api/send-care-guide
 * 
 * Generates a personalized PDF care guide and sends it via email.
 * 
 * Request body:
 * - recipientName: string
 * - email: string
 * - assessmentData: { score, recommendation, matchedCommunities, answers }
 * - matchedCommunities?: array of community objects (optional)
 */
export async function POST(request: NextRequest) {
  try {
    const body: SendCareGuideRequest = await request.json();
    
    // Validate required fields
    if (!body.recipientName || !body.email || !body.assessmentData) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: recipientName, email, assessmentData' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Generate PDF
    console.log(`[CareGuide] Generating PDF for ${body.recipientName}`);
    const pdfBuffer = await renderToBuffer(
      createElement(CareGuidePDF, {
        recipientName: body.recipientName,
        email: body.email,
        assessmentData: body.assessmentData,
        matchedCommunities: body.matchedCommunities,
      })
    );

    // If Resend is not configured, return the PDF buffer for testing
    if (!resend) {
      console.warn('[CareGuide] RESEND_API_KEY not configured, returning PDF without sending email');
      return NextResponse.json({
        success: true,
        message: 'PDF generated successfully (email not sent - RESEND_API_KEY not configured)',
        pdfSize: pdfBuffer.length,
      });
    }

    // Get care type for email subject
    const careType = body.assessmentData.recommendation.includes('Memory')
      ? 'Memory Care'
      : body.assessmentData.recommendation.includes('Assisted')
        ? 'Assisted Living'
        : 'Senior Living';

    // Send email with PDF attachment
    console.log(`[CareGuide] Sending email to ${body.email}`);
    const { data, error } = await resend.emails.send({
      from: 'Guide for Seniors <care-guide@guideforseniors.com>',
      to: body.email,
      subject: `Your Personalized ${careType} Guide - Guide for Seniors`,
      html: generateEmailHTML(body.recipientName, careType, body.assessmentData.matchedCommunities.length),
      attachments: [
        {
          filename: `Care-Guide-${body.recipientName.replace(/\s+/g, '-')}.pdf`,
          content: pdfBuffer.toString('base64'),
        },
      ],
    });

    if (error) {
      console.error('[CareGuide] Email send error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to send email', details: error.message },
        { status: 500 }
      );
    }

    console.log(`[CareGuide] Email sent successfully, ID: ${data?.id}`);
    return NextResponse.json({
      success: true,
      message: 'Care guide sent successfully',
      emailId: data?.id,
    });

  } catch (error) {
    console.error('[CareGuide] Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * Generate the email HTML body
 */
function generateEmailHTML(name: string, careType: string, communityCount: number): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Personalized Care Guide</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #0f766e 0%, #115e59 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">Guide for Seniors</h1>
              <p style="margin: 8px 0 0 0; color: #99f6e4; font-size: 14px;">Cleveland's Trusted Senior Living Resource</p>
            </td>
          </tr>
          
          <!-- Main Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="margin: 0 0 20px 0; color: #0f172a; font-size: 22px;">Hello ${name},</h2>
              
              <p style="margin: 0 0 20px 0; color: #475569; font-size: 16px; line-height: 1.6;">
                Thank you for completing our care assessment! Attached to this email is your 
                <strong style="color: #0f766e;">personalized ${careType} guide</strong>, created just for you 
                based on your responses.
              </p>
              
              <div style="background-color: #f0fdfa; border: 1px solid #99f6e4; border-radius: 8px; padding: 20px; margin: 30px 0;">
                <h3 style="margin: 0 0 15px 0; color: #0f766e; font-size: 16px;">Your Guide Includes:</h3>
                <ul style="margin: 0; padding: 0 0 0 20px; color: #475569; line-height: 1.8;">
                  <li>Personalized care type recommendation</li>
                  <li>Cleveland area pricing guide for 2026</li>
                  <li>${communityCount} communities matched to your needs</li>
                  <li>Step-by-step tour checklist</li>
                  <li>Financial options overview</li>
                </ul>
              </div>
              
              <p style="margin: 0 0 20px 0; color: #475569; font-size: 16px; line-height: 1.6;">
                Ready to take the next step? Our local Cleveland advisors are here to help you schedule tours, 
                answer questions, and guide you through the entire process — <strong>completely free of charge</strong>.
              </p>
              
              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                <tr>
                  <td align="center">
                    <a href="tel:+12166774630" style="display: inline-block; background-color: #0f766e; color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-size: 16px; font-weight: 600;">
                      Call Us: (216) 677-4630
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 30px 0 0 0; color: #475569; font-size: 14px; line-height: 1.6;">
                Warm regards,<br>
                <strong style="color: #0f172a;">The Guide for Seniors Team</strong><br>
                <span style="color: #64748b;">Your Local Cleveland Senior Living Advisors</span>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #1e293b; padding: 30px; text-align: center;">
              <p style="margin: 0 0 10px 0; color: #ffffff; font-size: 14px; font-weight: 600;">
                Guide for Seniors
              </p>
              <p style="margin: 0 0 15px 0; color: #94a3b8; font-size: 13px;">
                Helping Cleveland families find the right senior living
              </p>
              <p style="margin: 0; color: #64748b; font-size: 12px;">
                <a href="https://www.guideforseniors.com" style="color: #0f766e; text-decoration: none;">www.guideforseniors.com</a>
                &nbsp;|&nbsp;
                <a href="tel:+12166774630" style="color: #0f766e; text-decoration: none;">(216) 677-4630</a>
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

