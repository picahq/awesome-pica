import { NextRequest, NextResponse } from 'next/server';

interface Message {
  id: string;
  threadId: string;
}

interface EmailResponse {
  messages: Message[];
  nextPageToken?: string;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const pageToken = searchParams.get('pageToken') || undefined;

    const url = new URL('https://api.picaos.com/v1/passthrough/users/me/messages');
    url.searchParams.append('q', 'subject:"is interested in Software Engineer (Integrations) at Pica" -label:Wellfound Candidate found');
    if (pageToken) {
      url.searchParams.append('pageToken', pageToken);
    }

    // Make sure the secret key is present
    if (!process.env.PICA_SECRET_KEY) {
      return NextResponse.json(
        { error: 'PICA_SECRET_KEY is not present' },
        { status: 500 }
      );
    }

    // Make sure the connection key is present
    if (!process.env.GMAIL_CONNECTION_KEY) {
      return NextResponse.json(
        { error: 'GMAIL_CONNECTION_KEY is not present' },
        { status: 500 }
      );
    }

    const response = await fetch(url.toString(), {
      headers: {
        'x-pica-secret': process.env.PICA_SECRET_KEY,
        'x-pica-connection-key': process.env.GMAIL_CONNECTION_KEY,
        'content-type': 'application/json'
      }
    });

    const data: EmailResponse = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('❌ Error loading emails:', error);
    return NextResponse.json(
      { error: 'Failed to fetch emails' },
      { status: 500 }
    );
  }
}
