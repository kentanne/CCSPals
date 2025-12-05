import { Feedback, FeedbackFromAPI, Reviewer } from '@/interfaces/reviews';

export const getReviewerName = (reviewer?: Reviewer, type: 'mentor' | 'learner' = 'mentor') => {
  return reviewer?.name || (type === 'mentor' ? 'Unknown Mentor' : 'Unknown Learner');
};

export const getReviewerCourse = (reviewer?: Reviewer) => {
  if (!reviewer?.course && !reviewer?.program) return 'N/A';
  const course = reviewer.course || reviewer.program || '';
  return course.match(/\(([^)]+)\)/)?.[1] || course;
};

export const getReviewerYear = (reviewer?: Reviewer) => {
  return reviewer?.year || reviewer?.yearLevel || 'N/A';
};

export const transformScheduleToFeedback = (
  schedule: any, 
  existingFeedbacks: FeedbackFromAPI[], 
  type: 'mentor' | 'learner' = 'learner'
): Feedback => {
  const existingFeedback = existingFeedbacks.find(feedback => 
    feedback.schedule === schedule.id || feedback.schedule === schedule._id
  );

  const reviewerInfo = type === 'learner' 
    ? {
        name: schedule.mentor?.user?.name || schedule.mentor?.name || "Unknown Mentor",
        course: schedule.mentor?.course || schedule.mentor?.program || "N/A",
        year: schedule.mentor?.year || schedule.mentor?.yearLevel || "N/A",
        image: schedule.mentor?.image || "https://placehold.co/600x400"
      }
    : {
        name: schedule.learner?.name || "Unknown Learner",
        course: schedule.learner?.program || "N/A",
        year: schedule.learner?.yearLevel || "N/A",
        image: schedule.learner?.image || ""
      };

  return {
    id: schedule.id || schedule._id,
    rating: existingFeedback?.rating || schedule.feedback?.rating || 0,
    comment: existingFeedback?.comments || schedule.feedback?.feedback || "",
    date: schedule.date,
    subject: schedule.subject,
    location: schedule.location,
    has_feedback: !!existingFeedback || schedule.has_feedback || false,
    reviewer: reviewerInfo,
    mentor: schedule.mentor,
    learner: schedule.learner,
    feedback: existingFeedback || schedule.feedback,
    mentorId: schedule.mentor?.id || schedule.mentor?._id || schedule.mentor,
    scheduleId: schedule.id || schedule._id
  };
};

export const hasFeedback = (record: Feedback) => {
  return record.rating > 0 && record.comment !== '';
};

export const filterRecords = (records: Feedback[], searchQuery: string, type: 'mentor' | 'learner' = 'mentor') => {
  return records.filter(record => {
    if (!record.reviewer) {
      return false;
    }

    const reviewer = record.reviewer;
    const searchTerm = searchQuery.toLowerCase();
    
    const searchFields = [
      reviewer.name?.toLowerCase() || '',
      reviewer.course?.toLowerCase() || '',
      reviewer.year?.toLowerCase() || '',
      record.subject?.toLowerCase() || '',
      record.location?.toLowerCase() || ''
    ];
    
    return searchFields.some(field => field.includes(searchTerm));
  });
};