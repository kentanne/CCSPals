import { SessionItem, MockSessionData } from '@/interfaces/session';

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

export const formatTime = (timeString: string) => {
  // If time is in HH:MM format, convert to 12-hour format
  const [hours, minutes] = timeString.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
};

export const isOnlineSession = (location: string) => {
  if (!location) return false;
  const loc = location.toLowerCase().trim();
  return loc === 'online' || loc.includes('online');
};

export const getMentorId = (item: SessionItem): string | number => {
  return item.mentor?.id || item.mentor?.ment_inf_id || 0;
};

export const getLearnerName = (item: SessionItem) => {
  return item.learner?.name || "Unknown User";
};

export const getMentorName = (item: SessionItem) => {
  return item.mentor?.user?.name || item.mentor?.name || "Unknown Mentor";
};

// Mock data for testing
export const createMockSessionData = (): MockSessionData => {
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const dayAfterTomorrow = new Date(Date.now() + 172800000).toISOString().split('T')[0];

  return {
    schedule: [
      {
        id: 1,
        subject: "Mathematics",
        date: today,
        time: "10:00",
        location: "Room 201, Building A",
        learner: {
          id: 101,
          name: "John Student",
          image: "john.jpg",
          program: "Computer Science",
          yearLevel: "2nd Year"
        },
        mentor: {
          id: 201,
          name: "Dr. Smith",
          user: { name: "Dr. Smith" },
          ment_inf_id: 201
        }
      },
      {
        id: 2,
        subject: "Physics",
        date: today,
        time: "14:30",
        location: "Online via Zoom",
        learner: {
          id: 102,
          name: "Sarah Johnson",
          image: "sarah.jpg",
          program: "Engineering",
          yearLevel: "3rd Year"
        },
        mentor: {
          id: 202,
          name: "Prof. Brown",
          user: { name: "Prof. Brown" },
          ment_inf_id: 202
        }
      }
    ],
    upcomingSchedule: [
      {
        id: 3,
        subject: "Chemistry",
        date: tomorrow,
        time: "11:00",
        location: "Lab 305, Science Building",
        learner: {
          id: 103,
          name: "Michael Brown",
          image: "michael.jpg",
          program: "Chemistry",
          yearLevel: "1st Year"
        },
        mentor: {
          id: 203,
          name: "Dr. Wilson",
          user: { name: "Dr. Wilson" },
          ment_inf_id: 203
        }
      },
      {
        id: 4,
        subject: "Programming",
        date: dayAfterTomorrow,
        time: "15:00",
        location: "Computer Lab 101",
        learner: {
          id: 104,
          name: "Emily Davis",
          image: "emily.jpg",
          program: "Software Engineering",
          yearLevel: "4th Year"
        },
        mentor: {
          id: 204,
          name: "Ms. Garcia",
          user: { name: "Ms. Garcia" },
          ment_inf_id: 204
        }
      }
    ],
    mentFiles: {
      files: [
        {
          id: 1,
          file_name: "Math_Notes.pdf",
          file_id: "math123",
          owner_id: 201,
          webViewLink: "https://drive.google.com/file/d/math123/view",
          webContentLink: "https://drive.google.com/file/d/math123/download"
        },
        {
          id: 2,
          file_name: "Physics_Assignment.docx",
          file_id: "phys456",
          owner_id: 202,
          webViewLink: "https://drive.google.com/file/d/phys456/view",
          webContentLink: "https://drive.google.com/file/d/phys456/download"
        },
        {
          id: 3,
          file_name: "Chemistry_Lab_Guide.pdf",
          file_id: "chem789",
          owner_id: 203,
          webViewLink: "https://drive.google.com/file/d/chem789/view",
          webContentLink: "https://drive.google.com/file/d/chem789/download"
        },
        {
          id: 4,
          file_name: "Programming_Tutorial.pdf",
          file_id: "prog101",
          owner_id: 204,
          webViewLink: "https://drive.google.com/file/d/prog101/view",
          webContentLink: "https://drive.google.com/file/d/prog101/download"
        }
      ]
    }
  };
};

// For learner mock data
export const createLearnerMockData = () => {
  const mockData = createMockSessionData();
  return {
    schedule: mockData.schedule.map(session => ({
      ...session,
      mentor: {
        user: { name: session.mentor?.name || "Unknown Mentor" },
        ment_inf_id: session.mentor?.id || 0
      }
    })),
    upcomingSchedule: mockData.upcomingSchedule.map(session => ({
      ...session,
      mentor: {
        user: { name: session.mentor?.name || "Unknown Mentor" },
        ment_inf_id: session.mentor?.id || 0
      }
    })),
    mentFiles: mockData.mentFiles
  };
};