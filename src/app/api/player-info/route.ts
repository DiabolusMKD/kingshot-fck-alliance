import { NextRequest, NextResponse } from 'next/server';

export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const playerId = searchParams.get('playerId');

    if (!playerId) {
      return NextResponse.json(
        { error: 'Player ID is required', status: 'error' },
        { status: 400 }
      );
    }

    const kingshotApiUrl = process.env.NEXT_PUBLIC_KINGSHOT_API_URL || 'https://kingshot.net/api';
    const fetchUrl = `${kingshotApiUrl}/player-info?playerId=${playerId}`;
    
    console.log('[API Route] Fetching from:', fetchUrl);

    let response;
    try {
      response = await fetch(fetchUrl);
      console.log('[API Route] Response status:', response.status);
    } catch (fetchError) {
      console.error('[API Route] Fetch failed:', fetchError);
      return NextResponse.json(
        { 
          error: `Failed to reach Kingshot API: ${fetchError instanceof Error ? fetchError.message : 'Unknown error'}`,
          status: 'error'
        },
        { status: 503 }
      );
    }

    let data;
    try {
      data = await response.json();
      console.log('[API Route] Response data keys:', Object.keys(data));
    } catch (parseError) {
      console.error('[API Route] JSON parse error:', parseError);
      return NextResponse.json(
        { error: 'Failed to parse Kingshot API response', status: 'error' },
        { status: 502 }
      );
    }

    // Check if the API returned an error status
    if (data.status === 'error') {
      const errorMessage = data.message || 'Player not found';
      console.error('[API Route] API error status:', errorMessage);
      return NextResponse.json(
        { error: errorMessage, status: 'error' },
        { status: 400 }
      );
    }

    if (!response.ok) {
      const errorMessage = data.message || `API error: ${response.statusText}`;
      console.error('[API Route] Non-OK HTTP:', response.status, errorMessage);
      return NextResponse.json(
        { error: errorMessage, status: 'error' },
        { status: response.status || 400 }
      );
    }

    if (!data.data) {
      console.error('[API Route] No data field in response');
      return NextResponse.json(
        { error: 'Invalid API response format', status: 'error' },
        { status: 502 }
      );
    }

    console.log('[API Route] Success:', { playerId: data.data.playerId, name: data.data.name });
    return NextResponse.json(data);
  } catch (error) {
    console.error('[API Route] Unexpected error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to fetch player data',
        status: 'error',
        details: process.env.NODE_ENV === 'development' ? String(error) : undefined
      },
      { status: 500 }
    );
  }
}
