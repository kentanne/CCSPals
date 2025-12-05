import { NextRequest, NextResponse } from 'next/server';
// import axios from 'axios';

const EXTERNAL_API_URL = process.env.EXTERNAL_API_URL;
const EXTERNAL_API_KEY = process.env.MINDMATE_EXTERNAL_API_KEY;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    const response = await fetch(`${process.env.EXTERNAL_API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'X-API-Key': process.env.MINDMATE_EXTERNAL_API_KEY!,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (data.success && data.data?.token) {
      // Set httpOnly cookie for security
      const res = NextResponse.json(data);
      res.cookies.set('mindmate_token', data.data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 1 week
      });
      return res;
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Login proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to communicate with authentication service' },
      { status: 500 }
    );
  }
}
