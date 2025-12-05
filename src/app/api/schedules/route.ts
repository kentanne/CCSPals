import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Schedule from '@/models/Schedule';
import User from '@/models/User';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

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

// POST - Create new schedule
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const { userId, role } = verifyToken(request);
    
    const body = await request.json();
    const {
      learnerId,
      mentorId,
      subject,
      date,
      time,
      duration,
      modality,
      meetingLink,
      location,
      notes
    } = body;

    // Validate required fields
    if (!learnerId || !mentorId || !subject || !date || !time || !duration || !modality) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify users exist
    const learner = await User.findOne({ userId: learnerId, role: 'learner' });
    const mentor = await User.findOne({ userId: mentorId, role: 'mentor' });

    if (!learner || !mentor) {
      return NextResponse.json(
        { error: 'Learner or mentor not found' },
        { status: 404 }
      );
    }

    // Verify the requester is either the learner or mentor in the schedule
    if (userId !== learnerId && userId !== mentorId) {
      return NextResponse.json(
        { error: 'Unauthorized to create this schedule' },
        { status: 403 }
      );
    }

    // Create schedule
    const scheduleId = `SCH-${uuidv4().slice(0, 8).toUpperCase()}`;
    
    const newSchedule = new Schedule({
      scheduleId,
      learnerId,
      learnerName: learner.name || learner.username,
      mentorId,
      mentorName: mentor.name || mentor.username,
      subject,
      date,
      time,
      duration,
      modality,
      meetingLink: modality === 'online' ? meetingLink : undefined,
      location: modality !== 'online' ? location : undefined,
      status: 'pending',
      notes
    });

    await newSchedule.save();

    return NextResponse.json({
      message: 'Schedule created successfully',
      schedule: newSchedule
    }, { status: 201 });

  } catch (error: any) {
    console.error('Create schedule error:', error);
    
    if (error.message === 'Authentication required' || error.message === 'Invalid token') {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    
    return NextResponse.json(
      { error: 'Failed to create schedule' },
      { status: 500 }
    );
  }
}

// GET - Fetch all schedules (admin or general view)
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    verifyToken(request); // Just verify user is authenticated
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const learnerId = searchParams.get('learnerId');
    const mentorId = searchParams.get('mentorId');

    const query: any = {};
    if (status) query.status = status;
    if (learnerId) query.learnerId = learnerId;
    if (mentorId) query.mentorId = mentorId;

    const schedules = await Schedule.find(query).sort({ date: -1, time: -1 });

    return NextResponse.json({
      schedules,
      total: schedules.length
    });

  } catch (error: any) {
    console.error('Get schedules error:', error);
    
    if (error.message === 'Authentication required' || error.message === 'Invalid token') {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch schedules' },
      { status: 500 }
    );
  }
}
