import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const EXTERNAL_API_URL = process.env.EXTERNAL_API_URL;
const EXTERNAL_API_KEY = process.env.MINDMATE_EXTERNAL_API_KEY;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Get auth token from cookie to forward to external API
    const token = request.cookies.get('mindmate_token')?.value;

    // Forward the registration request to the external API
    const response = await axios.post(
      `${EXTERNAL_API_URL}/auth/mentor/signup`,
      formData,
      {
        headers: {
          'X-API-KEY': `${EXTERNAL_API_KEY}`,
          'Content-Type': 'multipart/form-data',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        validateStatus: () => true, // Don't throw on any status
      }
    );

    // Create Next.js response with the external API's response
    const nextResponse = NextResponse.json(response.data, {
      status: response.status,
    });

    // Forward cookies from external API if present
    const setCookieHeader = response.headers['set-cookie'];
    if (setCookieHeader) {
      const cookies = Array.isArray(setCookieHeader) ? setCookieHeader : [setCookieHeader];
      cookies.forEach((cookie) => {
        const [cookiePair, ...attributes] = cookie.split('; ');
        const [name, value] = cookiePair.split('=');
        
        nextResponse.cookies.set(name, value, {
          httpOnly: attributes.some(attr => attr.toLowerCase() === 'httponly'),
          secure: attributes.some(attr => attr.toLowerCase() === 'secure'),
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7,
        });
      });
    }

    return nextResponse;
  } catch (error) {
    console.error('Mentor signup proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to communicate with authentication service' },
      { status: 500 }
    );
  }
}
