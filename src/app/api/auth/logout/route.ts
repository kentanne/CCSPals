import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const EXTERNAL_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function POST(request: NextRequest) {
  try {
    // Get the auth token from cookies
    const token = request.cookies.get('mindmate_token')?.value ||
                  request.cookies.get('MindMateToken')?.value;

    // Forward the logout request to the external API
    const response = await axios.post(
      `${EXTERNAL_API_URL}/api/auth/logout`,
      {},
      {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          Cookie: token ? `MindMateToken=${token}` : '',
        },
        validateStatus: () => true,
      }
    );

    // Create response and clear the cookie
    const nextResponse = NextResponse.json(response.data, {
      status: response.status,
    });

    // Clear the authentication cookie
    nextResponse.cookies.delete('MindMateToken');

    return nextResponse;
  } catch (error) {
    console.error('Logout proxy error:', error);
    
    // Even if the external API fails, clear the local cookie
    const nextResponse = NextResponse.json(
      { message: 'Logged out locally' },
      { status: 200 }
    );
    
    nextResponse.cookies.delete('MindMateToken');
    
    return nextResponse;
  }
}
