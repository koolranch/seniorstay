import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { renderToBuffer } from '@react-pdf/renderer';
import React from 'react';
import { PricingGuidePDF } from '@/components/pdf/PricingGuidePDF';

// Initialize Resend (will be undefined if RESEND_API_KEY is not set)
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { recipientName, email } = body;

    if (!recipientName || !email) {
      return NextResponse.json(
        { error: 'Missing required fields: recipientName and email' },
        { status: 400 }
      );
    }

    console.log('[PricingGuide] Generating PDF for:', recipientName, email);

    // Generate the PDF
    const generatedDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const pdfElement = React.createElement(PricingGuidePDF, {
      recipientName,
      email,
      generatedDate,
    });
    // @ts-expect-error - renderToBuffer expects Document but component returns Document
    const pdfBuffer = await renderToBuffer(pdfElement);

    console.log('[PricingGuide] PDF generated, size:', pdfBuffer.length, 'bytes');

    // If Resend is not configured, return error
    if (!resend) {
      console.warn('[PricingGuide] RESEND_API_KEY not configured');
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 500 }
      );
    }

    // Send the email with PDF attachment
    const { data, error } = await resend.emails.send({
      from: 'Guide for Seniors <guides@guideforseniors.com>',
      to: email,
      subject: 'Your 2026 Cleveland Senior Living Cost Report',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
            .header { background: linear-gradient(135deg, #0f766e 0%, #14b8a6 100%); padding: 40px 30px; text-align: center; }
            .header h1 { color: white; margin: 0 0 8px 0; font-size: 24px; }
            .header p { color: #99f6e4; margin: 0; font-size: 14px; }
            .content { padding: 40px 30px; background: #ffffff; }
            .greeting { font-size: 18px; color: #0f172a; margin-bottom: 20px; }
            .message { color: #475569; margin-bottom: 24px; }
            .highlights { background: #f0fdfa; border-radius: 12px; padding: 24px; margin: 24px 0; }
            .highlights h3 { color: #0f766e; margin: 0 0 16px 0; font-size: 16px; }
            .highlight-item { display: flex; align-items: flex-start; margin-bottom: 12px; }
            .highlight-icon { color: #0f766e; font-weight: bold; margin-right: 10px; }
            .highlight-text { color: #334155; font-size: 14px; }
            .cta-section { text-align: center; margin: 32px 0; }
            .cta-button { display: inline-block; background: #0f766e; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; }
            .phone-cta { text-align: center; margin: 24px 0; padding: 20px; background: #f8fafc; border-radius: 8px; }
            .phone-cta p { margin: 0 0 8px 0; color: #64748b; font-size: 14px; }
            .phone-cta a { color: #0f766e; font-size: 24px; font-weight: bold; text-decoration: none; }
            .footer { background: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0; }
            .footer p { color: #64748b; font-size: 12px; margin: 4px 0; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Guide for Seniors</h1>
            <p>Cleveland's Trusted Senior Living Resource</p>
          </div>
          
          <div class="content">
            <p class="greeting">Hi ${recipientName},</p>
            
            <p class="message">
              Thank you for requesting our <strong>2026 Greater Cleveland Senior Living Cost Report</strong>. 
              Your comprehensive pricing guide is attached to this email as a PDF.
            </p>
            
            <div class="highlights">
              <h3>📊 What's Inside Your Guide:</h3>
              <div class="highlight-item">
                <span class="highlight-icon">✓</span>
                <span class="highlight-text">2026 pricing for Memory Care, Assisted Living & Independent Living</span>
              </div>
              <div class="highlight-item">
                <span class="highlight-icon">✓</span>
                <span class="highlight-text">Neighborhood-by-neighborhood cost breakdown</span>
              </div>
              <div class="highlight-item">
                <span class="highlight-icon">✓</span>
                <span class="highlight-text">Home care vs. community living comparison</span>
              </div>
              <div class="highlight-item">
                <span class="highlight-icon">✓</span>
                <span class="highlight-text">Hidden costs checklist & questions to ask</span>
              </div>
              <div class="highlight-item">
                <span class="highlight-icon">✓</span>
                <span class="highlight-text">VA benefits & Ohio Medicaid programs</span>
              </div>
            </div>
            
            <p class="message">
              <strong>Want personalized recommendations?</strong> Our local advisors can help you find 
              communities that match your specific needs and budget—completely free of charge.
            </p>
            
            <div class="phone-cta">
              <p>Call us for a free consultation:</p>
              <a href="tel:+12166774630">(216) 677-4630</a>
            </div>
            
            <div class="cta-section">
              <a href="https://www.guideforseniors.com/assessment" class="cta-button">
                Take Our Free Care Assessment →
              </a>
            </div>
          </div>
          
          <div class="footer">
            <p><strong>Guide for Seniors</strong></p>
            <p>Cleveland's Trusted Senior Living Resource</p>
            <p>www.guideforseniors.com | (216) 677-4630</p>
            <p style="margin-top: 16px; font-size: 11px;">
              You're receiving this email because you requested our pricing guide. 
              If you have questions, reply to this email or call us anytime.
            </p>
          </div>
        </body>
        </html>
      `,
      attachments: [
        {
          filename: `2026-Cleveland-Senior-Living-Cost-Report-${recipientName.replace(/\s+/g, '-')}.pdf`,
          content: pdfBuffer.toString('base64'),
          contentType: 'application/pdf',
        },
      ],
    });

    if (error) {
      console.error('[PricingGuide] Resend error:', error);
      return NextResponse.json(
        { error: 'Failed to send email', details: error },
        { status: 500 }
      );
    }

    console.log('[PricingGuide] Email sent successfully:', data?.id);

    return NextResponse.json({
      success: true,
      message: 'Pricing guide sent successfully',
      emailId: data?.id,
    });
  } catch (error) {
    console.error('[PricingGuide] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}
