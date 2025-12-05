import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const JWT_SECRET = process.env.JWT_SECRET || 'ccspals-default-secret-change-in-production';

// Helper to verify JWT and extract user info
function verifyToken(request: NextRequest) {
  const token = request.cookies.get('mindmate_token')?.value || 
                request.cookies.get('MindMateToken')?.value ||
                request.headers.get('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    throw new Error('Authentication required');
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
    return decoded;
  } catch (error) {
    throw new Error('Invalid token');
  }
}

// GET - Mentor reads all feedback they've received from external API
export async function GET(request: NextRequest) {
  try {
    // Accept token from cookie or Authorization header
    const cookieToken = request.cookies.get('mindmate_token')?.value || request.cookies.get('MindMateToken')?.value;
    const authHeader = request.headers.get('authorization');
    const headerToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
    const token = cookieToken || headerToken;

    if (!EXTERNAL_API_KEY) {
      return NextResponse.json({ error: 'External API configuration missing' }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const rating = searchParams.get('rating');
    const subject = searchParams.get('subject');

    const response = await axios.get(`${EXTERNAL_API_URL}/mentors/feedbacks`, {
      headers: {
        'X-API-KEY': `${EXTERNAL_API_KEY}`,
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      params: {
        ...(rating && { rating }),
        ...(subject && { subject }),
      },
    });

    return NextResponse.json(response.data);

  } catch (error: any) {
    console.error('Get mentor feedbacks error:', error);
    
    if (error.response?.status === 401) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch feedbacks' },
      { status: 500 }
    );
  }
}