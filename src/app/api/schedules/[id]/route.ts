import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Schedule from '@/models/Schedule';
import jwt from 'jsonwebtoken';

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

// GET - Fetch single schedule by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const { userId } = verifyToken(request);
    const scheduleId = params.id;

    const schedule = await Schedule.findOne({ scheduleId });

    if (!schedule) {
      return NextResponse.json(
        { error: 'Schedule not found' },
        { status: 404 }
      );
    }

    // Verify user has access to this schedule
    if (schedule.learnerId !== userId && schedule.mentorId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 403 }
      );
    }

    return NextResponse.json({ schedule });

  } catch (error: any) {
    console.error('Get schedule error:', error);
    
    if (error.message === 'Authentication required' || error.message === 'Invalid token') {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch schedule' },
      { status: 500 }
    );
  }
}

// PATCH - Update schedule (status, time, etc.)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const { userId } = verifyToken(request);
    const scheduleId = params.id;
    const updates = await request.json();

    const schedule = await Schedule.findOne({ scheduleId });

    if (!schedule) {
      return NextResponse.json(
        { error: 'Schedule not found' },
        { status: 404 }
      );
    }

    // Verify user has access to update this schedule
    if (schedule.learnerId !== userId && schedule.mentorId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized to update this schedule' },
        { status: 403 }
      );
    }

    // Update allowed fields
    const allowedUpdates = ['status', 'date', 'time', 'meetingLink', 'location', 'notes'];
    Object.keys(updates).forEach(key => {
      if (allowedUpdates.includes(key)) {
        (schedule as any)[key] = updates[key];
      }
    });

    await schedule.save();

    return NextResponse.json({
      message: 'Schedule updated successfully',
      schedule
    });

  } catch (error: any) {
    console.error('Update schedule error:', error);
    
    if (error.message === 'Authentication required' || error.message === 'Invalid token') {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    
    return NextResponse.json(
      { error: 'Failed to update schedule' },
      { status: 500 }
    );
  }
}

// DELETE - Cancel/delete schedule
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const { userId } = verifyToken(request);
    const scheduleId = params.id;

    const schedule = await Schedule.findOne({ scheduleId });

    if (!schedule) {
      return NextResponse.json(
        { error: 'Schedule not found' },
        { status: 404 }
      );
    }

    // Verify user has access to delete this schedule
    if (schedule.learnerId !== userId && schedule.mentorId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized to delete this schedule' },
        { status: 403 }
      );
    }

    // Soft delete by setting status to cancelled
    schedule.status = 'cancelled';
    await schedule.save();

    return NextResponse.json({
      message: 'Schedule cancelled successfully',
      schedule
    });

  } catch (error: any) {
    console.error('Delete schedule error:', error);
    
    if (error.message === 'Authentication required' || error.message === 'Invalid token') {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    
    return NextResponse.json(
      { error: 'Failed to cancel schedule' },
      { status: 500 }
    );
  }
}
