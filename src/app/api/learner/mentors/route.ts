import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const EXTERNAL_API_KEY = process.env.MINDMATE_EXTERNAL_API_KEY;
const EXTERNAL_API_URL = process.env.EXTERNAL_API_URL;

export async function GET(request: NextRequest) {
  try {
    if (!EXTERNAL_API_KEY) {
      return NextResponse.json(
        { error: 'External API configuration missing' },
        { status: 500 }
      );
    }

    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const subject = searchParams.get('subject');
    const modality = searchParams.get('modality');
    const availability = searchParams.get('availability');

    // Fetch mentors from external API
    const response = await axios.get(`${EXTERNAL_API_URL}/mentors`, {
      headers: {
        'X-API-KEY': `${EXTERNAL_API_KEY}`,
        'Content-Type': 'application/json'
      },
      params: {
        ...(subject && { subject }),
        ...(modality && { modality }),
        ...(availability && { availability })
      }
    });

    // Extract data from nested structure: response.data.data or response.data.mentors.data
    let mentorsData = [];
    if (response.data.data) {
      mentorsData = response.data.data;
    } else if (response.data.mentors?.data) {
      mentorsData = response.data.mentors.data;
    } else if (response.data.mentors) {
      mentorsData = response.data.mentors;
    } else {
      mentorsData = Array.isArray(response.data) ? response.data : [];
    }

    // Transform to match expected format
    const transformedMentors = mentorsData.map((mentor: any) => ({
      id: mentor._id || mentor.id,
      name: mentor.name || mentor.userId?.username || 'Unknown',
      email: mentor.email || mentor.userId?.email,
      yearLevel: mentor.yearLevel || 'Professor',
      program: mentor.program || 'Computer Science',
      subjects: mentor.subjects || mentor.specialization || [],
      availability: mentor.availability || [],
      sessionDur: mentor.sessionDur || '1 hour',
      modality: mentor.modality || 'Online',
      bio: mentor.bio || '',
      image: mentor.image || 'https://placehold.co/100x100',
      proficiency: mentor.proficiency || 'Intermediate',
      experience: mentor.exp || mentor.experience || '',
      credentials: mentor.credentials || [],
      aveRating: mentor.aveRating || 4.5,
      status: mentor.accountStatus || 'Active',
      specialization: mentor.specialization || [],
      verified: mentor.verified || false
    }));

    return NextResponse.json(transformedMentors);

  } catch (error: any) {
    console.error('Fetch mentors error:', error);
    
    // Always return empty array for consistency
    return NextResponse.json([]);
  }
}
