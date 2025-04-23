'use server';

import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';

const prisma = new PrismaClient();

type LeadData = {
  fullName: string;
  email?: string;
  phone?: string;
  cityOrZip?: string;
  careType?: string;
  moveInTimeline?: string;
  notes?: string;
  communityName?: string;
  pageType?: string;
  sourceSlug?: string;
  city?: string;
  state?: string;
  address?: string;
  services?: string;
};

type QueryResult = {
  id: string;
}

export async function createLead(data: LeadData) {
  try {
    // Create lead record in database using the prisma client
    const lead = await prisma.$queryRaw<QueryResult[]>`
      INSERT INTO "Lead" (
        "id", 
        "fullName", 
        "email", 
        "phone", 
        "cityOrZip", 
        "careType", 
        "moveInTimeline", 
        "notes", 
        "communityName", 
        "pageType", 
        "sourceSlug",
        "city",
        "state",
        "address",
        "services",
        "createdAt", 
        "updatedAt",
        "status"
      ) 
      VALUES (
        gen_random_uuid(), 
        ${data.fullName}, 
        ${data.email}, 
        ${data.phone}, 
        ${data.cityOrZip}, 
        ${data.careType}, 
        ${data.moveInTimeline}, 
        ${data.notes}, 
        ${data.communityName}, 
        ${data.pageType}, 
        ${data.sourceSlug},
        ${data.city},
        ${data.state},
        ${data.address},
        ${data.services}, 
        NOW(), 
        NOW(),
        'new'
      )
      RETURNING "id"
    `;

    // Send email notification
    await sendEmailNotification(data);

    // Extract the ID from the query result
    const leadId = lead[0]?.id || 'unknown';
    
    return { success: true, leadId };
  } catch (error) {
    console.error('Error creating lead:', error);
    throw new Error('Failed to create lead');
  }
}

async function sendEmailNotification(leadData: LeadData) {
  // This is a placeholder email configuration
  // Replace with your actual email service credentials
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.example.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.EMAIL_USER || 'user@example.com',
      pass: process.env.EMAIL_PASSWORD || 'password',
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM || 'noreply@seniorstay.com',
    to: process.env.ADMIN_EMAIL || 'admin@seniorstay.com',
    subject: `New Lead: ${leadData.fullName}`,
    html: `
      <h1>New Lead Submission</h1>
      <p><strong>Name:</strong> ${leadData.fullName}</p>
      <p><strong>Email:</strong> ${leadData.email || 'Not provided'}</p>
      <p><strong>Phone:</strong> ${leadData.phone || 'Not provided'}</p>
      <p><strong>Location:</strong> ${leadData.cityOrZip || 'Not provided'}</p>
      <p><strong>Care Type:</strong> ${leadData.careType || 'Not provided'}</p>
      <p><strong>Move-in Timeline:</strong> ${leadData.moveInTimeline || 'Not provided'}</p>
      <p><strong>Notes:</strong> ${leadData.notes || 'None'}</p>
      <p><strong>Community:</strong> ${leadData.communityName || 'Not specified'}</p>
      <p><strong>City:</strong> ${leadData.city || 'Not specified'}</p>
      <p><strong>State:</strong> ${leadData.state || 'Not specified'}</p>
      <p><strong>Address:</strong> ${leadData.address || 'Not specified'}</p>
      <p><strong>Services:</strong> ${leadData.services || 'Not specified'}</p>
      <p><strong>Source:</strong> ${leadData.pageType || 'Not specified'} ${leadData.sourceSlug ? `(${leadData.sourceSlug})` : ''}</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Failed to send email notification:', error);
    // We don't want to fail the lead submission if email fails
  }
} 