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
    const yearLevel = searchParams.get('yearLevel');
    const program = searchParams.get('program');

    // Fetch learners from external API
    const response = await axios.get(`${EXTERNAL_API_URL}/learners`, {
      headers: {
        'X-API-KEY': `${EXTERNAL_API_KEY}`,
        'Content-Type': 'application/json'
      },
      params: {
        ...(subject && { subject }),
        ...(yearLevel && { yearLevel }),
        ...(program && { program })
      }
    });

    // Extract data from nested structure: response.data.data or response.data.learners.data
    let learnersData = [];
    if (response.data.data) {
      learnersData = response.data.data;
    } else if (response.data.learners?.data) {
      learnersData = response.data.learners.data;
    } else if (response.data.learners) {
      learnersData = response.data.learners;
    } else {
      learnersData = Array.isArray(response.data) ? response.data : [];
    }

    // Transform to match expected format
    const transformedLearners = learnersData.map((learner: any) => ({
      id: learner._id || learner.id,
      name: learner.name || learner.userId?.username || 'Unknown',
      email: learner.email || learner.userId?.email,
      yearLevel: learner.yearLevel || '1st Year',
      program: learner.program || 'Computer Science',
      subjects: learner.subjects || [],
      style: learner.style || [],
      goals: learner.goals || '',
      bio: learner.bio || '',
      image: learner.image || 'https://placehold.co/100x100',
      phoneNumber: learner.phoneNumber || '',
      address: learner.address || '',
      modality: learner.modality || 'Online',
      availability: learner.availability || [],
      status: learner.status || learner.accountStatus || 'Active'
    }));

    return NextResponse.json(transformedLearners);

  } catch (error: any) {
    console.error('Fetch learners error:', error);
    
    // Always return empty array for consistency
    return NextResponse.json([]);
  }
}
