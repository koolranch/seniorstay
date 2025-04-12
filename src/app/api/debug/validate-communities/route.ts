import { NextResponse } from 'next/server';
import { validateCommunityData } from '@/lib/validation/validateCommunityData';

export async function GET() {
  try {
    // Run the validation
    const result = await validateCommunityData();
    
    // Return the results
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error validating community data:', error);
    return NextResponse.json(
      { error: 'Failed to validate community data', details: error },
      { status: 500 }
    );
  }
} 