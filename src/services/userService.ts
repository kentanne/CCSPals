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
  roleData: { role: "learner", altRole: "mentor" },
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
  roleData: { role: "mentor", altRole: "learner" },
  badges: []
};

export const userService = {
  async fetchProfile(role: 'learner' | 'mentor') {
    try {
      // Remove the /api prefix since your backend doesn't use it
      const endpoint = role === 'learner' ? '/learner/profile' : '/mentor/profile';
      console.log('Fetching profile from:', endpoint);
      
      const response = await api.get(endpoint, {
        timeout: 10000,
      });
      
      console.log('Profile API response:', response.data);
      return response.data;
    } catch (error: any) {
      console.warn(`API failed for ${role} profile, using mock data:`, error.message);
      // Return mock data as fallback
      return role === 'learner' ? mockLearnerProfile : mockMentorProfile;
    }
  },

  async fetchSchedules(role: 'learner' | 'mentor') {
    try {
      const endpoint = role === 'learner' ? '/learner/schedules' : '/mentor/schedules';
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
      const response = await api.get('/learner/mentors');
      return response.data;
    } catch (error) {
      console.warn('API failed for mentors, using mock data');
      return [];
    }
  },

  async fetchLearners() {
    try {
      const response = await api.get('/mentor/learners');
      return response.data;
    } catch (error) {
      console.warn('API failed for learners, using mock data');
      return [];
    }
  },

  async fetchForumData() {
    try {
      const response = await api.get('/forum/posts');
      return response.data;
    } catch (error) {
      console.warn('API failed for forum data, using mock data');
      return [];
    }
  },

  async fetchAnalytics(role: 'learner' | 'mentor') {
    try {
      const endpoint = role === 'learner' ? '/learner/analytics' : '/mentor/session/analytics';
      const response = await api.get(endpoint);
      return response.data;
    } catch (error) {
      console.warn(`API failed for ${role} analytics, using mock data`);
      return { data: null };
    }
  },

  async fetchFeedbacks() {
    try {
      const response = await api.get('/mentor/feedbacks');
      return response.data;
    } catch (error) {
      console.warn('API failed for feedbacks, using mock data');
      return [];
    }
  }
};