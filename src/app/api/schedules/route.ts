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

    // Optionally verify authentication if needed
    // verifyToken(request);

    const body = await request.json();
    console.log('Received schedule data:', body);
    
    const {
      mentorName,
      learnerName,
      subject,
      modality,
      time,
      date,
      location,
    } = body;

    // Validate required fields
    if (!mentorName || !learnerName || !subject || !modality || !time || !date) {
      console.log('Validation failed:', { mentorName, learnerName, subject, modality, time, date });
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Default location to 'Online' if not provided
    const finalLocation = location && location.trim() !== '' ? location : 'Online';

    // Create schedule
    const scheduleId = `SCH-${uuidv4().slice(0, 8).toUpperCase()}`;

    console.log('Creating schedule with:', {
      scheduleId,
      mentorName,
      learnerName,
      subject,
      modality,
      time,
      date,
      location: finalLocation
    });

    const newSchedule = new Schedule({
      scheduleId,
      mentorName,
      learnerName,
      subject,
      modality,
      time,
      date,
      location: finalLocation,
      status: 'pending',
    });

    await newSchedule.save();
    console.log('Schedule saved successfully:', newSchedule);

    return NextResponse.json({
      message: 'Schedule created successfully',
      schedule: newSchedule
    }, { status: 201 });

  } catch (error: any) {
    console.error('Create schedule error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    return NextResponse.json(
      { error: 'Failed to create schedule', details: error.message },
      { status: 500 }
    );
  }
}

// GET - Fetch schedules filtered by mentor or learner name
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    // Optionally verify authentication if needed
    // verifyToken(request);
    
    const { searchParams } = new URL(request.url);
    const mentorName = searchParams.get('mentorName');
    const learnerName = searchParams.get('learnerName');

    const query: any = {};
    if (mentorName) query.mentorName = mentorName;
    if (learnerName) query.learnerName = learnerName;

    const schedules = await Schedule.find(query).sort({ date: 1, time: 1 });

    // Group schedules into today and upcoming
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todaySchedules: any[] = [];
    const upcomingSchedules: any[] = [];

    schedules.forEach((sched: any) => {
      const schedDate = new Date(sched.date);
      schedDate.setHours(0, 0, 0, 0);
      
      if (schedDate.getTime() === today.getTime()) {
        todaySchedules.push(sched);
      } else if (schedDate.getTime() > today.getTime()) {
        upcomingSchedules.push(sched);
      }
    });

    return NextResponse.json({
      todaySchedules,
      upcomingSchedules,
      total: schedules.length
    });

  } catch (error: any) {
    console.error('Get schedules error:', error);
    
    return NextResponse.json(
      { error: 'Failed to fetch schedules' },
      { status: 500 }
    );
  }
}
