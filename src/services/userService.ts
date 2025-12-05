import api from '@/lib/axios';

// Mock data fallbacks
const mockLearnerProfile = {
  userData: {
    _id: "1",
    userId: "user123",
    name: "John Learner",
    email: "john@example.com",
    address: "123 Main St",
    yearLevel: "3rd Year",
    program: "Computer Science",
    availability: ["Monday", "Wednesday", "Friday"],
    sessionDur: "1 hour",
    bio: "Passionate learner",
    subjects: ["Mathematics", "Programming", "Physics"],
    image: "https://placehold.co/100x100",
    phoneNumber: "123-456-7890",
    style: ["Visual", "Hands-on"],
    goals: "Improve programming skills",
    sex: "Male",
    status: "Active",
    modality: "Online",
    createdAt: new Date().toISOString(),
    __v: 0
  },
  rankData: { rank: "Beginner", progress: 5, requiredSessions: 10, sessionsToNextRank: 5 }
};

const mockMentorProfile = {
  userData: {
    _id: "2",
    userId: "user456", 
    name: "Jane Mentor",
    email: "jane@example.com",
    address: "456 Oak St",
    yearLevel: "Professor",
    program: "Computer Science",
    availability: ["Tuesday", "Thursday"],
    sessionDur: "2 hours",
    bio: "Experienced mentor",
    subjects: ["Advanced Programming", "Algorithms", "Data Structures"],
    image: "https://placehold.co/100x100",
    phoneNumber: "987-654-3210",
    style: ["Theoretical", "Practical"],
    goals: "Help students succeed",
    sex: "Female",
    status: "Active",
    modality: "Hybrid",
    createdAt: new Date().toISOString(),
    __v: 0
  },
  badges: []
};

export const userService = {
  async fetchProfile(role: 'learner' | 'mentor') {
    try {
      const endpoint = role === 'learner' ? '/api/learner/profile' : '/api/mentor/profile';
      console.log('Fetching profile from:', endpoint);
      
      const response = await api.get(endpoint, {
        timeout: 10000,
      });
      
      return response.data;
    } catch (error: any) {
      console.warn(`API failed for ${role} profile, using mock data:`, error.message);
      // Return mock data as fallback
      return role === 'learner' ? mockLearnerProfile : mockMentorProfile;
    }
  },

  async fetchSchedules(role: 'learner' | 'mentor') {
    try {
      const endpoint = role === 'learner' ? '/api/learner/schedules' : '/api/mentor/schedules';
      const response = await api.get(endpoint);
      return response.data;
    } catch (error) {
      console.warn(`API failed for ${role} schedules, using mock data`);
      return {
        todaySchedule: [],
        upcomingSchedule: [],
        schedForReview: []
      };
    }
  },

  async fetchMentors() {
    try {
      const response = await api.get('/api/learner/mentors');
      return response.data;
    } catch (error) {
      console.warn('API failed for mentors, using mock data');
      return [];
    }
  },

  async fetchLearners() {
    try {
      const response = await api.get('/api/mentor/learners');
      return response.data;
    } catch (error) {
      console.warn('API failed for learners, using mock data');
      return [];
    }
  },

  async fetchLearnerById(id: string) {
    try {
      const response = await api.get(`/api/learner/${encodeURIComponent(id)}`);
      return response.data;
    } catch (error) {
      console.warn(`API failed for learner ${id}:`, error);
      throw error;
    }
  },

  async fetchMentorById(id: string) {
    try {
      const response = await api.get(`/api/mentor/${encodeURIComponent(id)}`);
      return response.data;
    } catch (error) {
      console.warn(`API failed for mentor ${id}:`, error);
      throw error;
    }
  },
};