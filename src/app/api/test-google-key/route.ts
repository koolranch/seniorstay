/**
 * Diagnostic endpoint to check if Google Places API key is accessible
 * GET /api/test-google-key
 */

import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  
  if (!apiKey) {
    return NextResponse.json({
      hasKey: false,
      message: 'GOOGLE_PLACES_API_KEY not found in environment',
      availableVars: Object.keys(process.env).filter(k => k.includes('GOOGLE') || k.includes('PLACES'))
    });
  }
  
  // Test the key with a simple request
  try {
    const testUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?` +
      `input=Westwood%20Place%20Cleveland%20OH&` +
      `inputtype=textquery&` +
      `fields=place_id&` +
      `key=${apiKey}`;
    
    const response = await fetch(testUrl);
    const data = await response.json();
    
    return NextResponse.json({
      hasKey: true,
      keyPrefix: apiKey.substring(0, 20) + '...',
      testStatus: data.status,
      working: data.status === 'OK',
      message: data.status === 'OK' ? 'API key is working!' : `API returned: ${data.status}`
    });
  } catch (error) {
    return NextResponse.json({
      hasKey: true,
      keyPrefix: apiKey.substring(0, 20) + '...',
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Key found but test request failed'
    });
  }
}

