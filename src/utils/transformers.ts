import { Schedule } from '@/interfaces/user';

export const transformSchedulesForReview = (schedules: any[]): any[] => {
  return schedules.map(schedule => ({
    id: schedule.id,
    date: `${schedule.date} ${schedule.time}`,
    subject: schedule.subject,
    location: schedule.location,
    mentor: {
      user: {
        name: schedule.mentor?.name || "Unknown Mentor"
      },
      year: schedule.mentor?.yearLevel || "Professor",
      course: schedule.mentor?.program || `${schedule.subject?.substring(0, 3).toUpperCase()})`,
      image: schedule.mentor?.image || "https://placehold.co/600x400"
    },
    learner: {
      name: schedule.learner?.name || "Unknown Learner",
      program: schedule.learner?.program || "N/A",
      yearLevel: schedule.learner?.yearLevel || "N/A"
    },
    feedback: schedule.feedback || {
      rating: 0,
      feedback: ""
    },
    has_feedback: schedule.has_feedback || false
  }));
};

export const transformMentorData = (apiMentors: any[]): any[] => {
  return apiMentors.map(mentor => ({
    id: mentor.id,
    userName: mentor.name,
    yearLevel: mentor.yearLevel,
    course: mentor.program,
    image_url: mentor.image,
    proficiency: mentor.proficiency,
    rating_ave: mentor.aveRating
  }));
};

export const normalizeSchedulesForSession = (items: any[] = []) => {
  return items.map((s: any) => ({
    id: String(s.id ?? s._id ?? ''),
    subject: s.subject || '',
    mentor: {
      user: { name: s.mentor?.user?.name || s.mentor?.name || 'Unknown Mentor' },
      ment_inf_id: Number(s.mentor?.ment_inf_id ?? s.mentor?.id ?? 0),
      id: String(s.mentor?.id ?? s.mentor?.ment_inf_id ?? '')
    },
    learner: {
      id: String(s.learner?.id ?? s.learner?._id ?? ''),
      name: s.learner?.name || ''
    },
    date: s.date ? String(s.date) : '',
    time: s.time || '',
    location: s.location || '',
    files: s.files || []
  }));
};