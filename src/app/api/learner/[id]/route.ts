import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const EXTERNAL_API_KEY = process.env.MINDMATE_EXTERNAL_API_KEY;
const EXTERNAL_API_URL = process.env.EXTERNAL_API_URL;

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id;

    // Accept token from cookie or Authorization header
    const cookieToken = request.cookies.get('mindmate_token')?.value;
    const authHeader = request.headers.get('authorization');
    const headerToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
    const token = cookieToken || headerToken;

    if (!EXTERNAL_API_KEY) {
      return NextResponse.json({ error: 'External API configuration missing' }, { status: 500 });
    }

    const response = await axios.get(`${EXTERNAL_API_URL}/mentors/${encodeURIComponent(id)}`, {
      headers: {
        'X-API-KEY': `${EXTERNAL_API_KEY}`,
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Fetch learner by id error:', error);
    if (error.response?.status === 401) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error.response?.status === 404) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to fetch learner' }, { status: 500 });
  }
}
