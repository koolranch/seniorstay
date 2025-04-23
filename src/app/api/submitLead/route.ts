import { NextResponse } from 'next/server';
import { createLead } from './actions';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Extract form data
    const {
      fullName,
      email,
      phone,
      cityOrZip,
      careType,
      moveInTimeline,
      notes,
      communityName,
      pageType,
      sourceSlug,
      city,
      state,
      address,
      services,
    } = body;

    // Basic validation
    if (!fullName) {
      return NextResponse.json(
        { error: 'Full name is required' },
        { status: 400 }
      );
    }

    if (!email && !phone) {
      return NextResponse.json(
        { error: 'Either email or phone is required' },
        { status: 400 }
      );
    }

    // Use server action to create lead
    const result = await createLead({
      fullName,
      email,
      phone,
      cityOrZip,
      careType,
      moveInTimeline,
      notes,
      communityName,
      pageType,
      sourceSlug,
      city,
      state,
      address,
      services,
    });

    return NextResponse.json({ success: true, leadId: result.leadId }, { status: 201 });
  } catch (error) {
    console.error('Error submitting lead:', error);
    return NextResponse.json(
      { error: 'Failed to submit lead information' },
      { status: 500 }
    );
  }
} 