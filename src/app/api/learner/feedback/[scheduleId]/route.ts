import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Feedback from '@/models/Feedback';
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

// POST - Learner writes feedback for a completed session
export async function POST(
  request: NextRequest,
  { params }: { params: { scheduleId: string } }
) {
  try {
    await connectDB();
    
    const { userId, role } = verifyToken(request);
    
    // Only learners can write feedback
    if (role !== 'learner') {
      return NextResponse.json(
        { error: 'Only learners can submit feedback' },
        { status: 403 }
      );
    }

    const scheduleId = params.scheduleId;
    const body = await request.json();
    const { rating, comment } = body;

    // Validate input
    if (!rating || !comment) {
      return NextResponse.json(
        { error: 'Rating and comment are required' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Verify schedule exists
    const schedule = await Schedule.findOne({ scheduleId });

    if (!schedule) {
      return NextResponse.json(
        { error: 'Schedule not found' },
        { status: 404 }
      );
    }

    // Verify the learner is part of this schedule
    if (schedule.learnerId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized to provide feedback for this session' },
        { status: 403 }
      );
    }

    // Verify session is completed
    if (schedule.status !== 'completed') {
      return NextResponse.json(
        { error: 'Feedback can only be provided for completed sessions' },
        { status: 400 }
      );
    }

    // Check if feedback already exists for this schedule
    const existingFeedback = await Feedback.findOne({ scheduleId });
    if (existingFeedback) {
      return NextResponse.json(
        { error: 'Feedback already submitted for this session' },
        { status: 409 }
      );
    }

    // Get learner info
    const learner = await User.findOne({ userId: schedule.learnerId });

    // Create feedback
    const feedbackId = `FB-${uuidv4().slice(0, 8).toUpperCase()}`;
    
    const newFeedback = new Feedback({
      feedbackId,
      scheduleId,
      learnerId: schedule.learnerId,
      learnerName: learner?.name || learner?.username || 'Anonymous',
      mentorId: schedule.mentorId,
      mentorName: schedule.mentorName,
      rating,
      comment,
      subject: schedule.subject,
      sessionDate: schedule.date
    });

    await newFeedback.save();

    return NextResponse.json({
      message: 'Feedback submitted successfully',
      feedback: newFeedback
    }, { status: 201 });

  } catch (error: any) {
    console.error('Submit feedback error:', error);
    
    if (error.message === 'Authentication required' || error.message === 'Invalid token') {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    
    return NextResponse.json(
      { error: 'Failed to submit feedback' },
      { status: 500 }
    );
  }
}
