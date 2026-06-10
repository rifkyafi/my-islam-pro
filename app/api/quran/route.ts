import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    // Default endpoint to fetch all surahs if no specific endpoint is provided
    const endpoint = searchParams.get('endpoint') || '/surat';
    
    // Get base URL from environment variable, fallback to equran.id
    const baseUrl = process.env.NEXT_PUBLIC_QURAN_API_URL || 'https://equran.id/api/v2';
    
    // Format the URL properly
    const apiUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    const fetchPath = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    
    const fetchUrl = `${apiUrl}${fetchPath}`;

    // Fetch data from Quran API
    const res = await fetch(fetchUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
      // Optional: revalidate cache every hour to be efficient
      next: { revalidate: 3600 }
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `API responded with status: ${res.status}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json(
      { error: 'Internal Server Error', message },
      { status: 500 }
    );
  }
}
