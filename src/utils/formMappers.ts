import { AvailableSubjects } from '@/types';

export const normalizeOptionValue = (opt: string | { label: string; value: string }): string => {
  return typeof opt === 'string' ? opt : opt.value;
};

export const normalizeOptionLabel = (opt: string | { label: string; value: string }): string => {
  return typeof opt === 'string' ? opt : opt.label;
};

export const capitalizeFirstLetter = (str: string): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const toCamelCase = (str: string): string => {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, '');
};

export const getAvailableSubjects = (program: string): AvailableSubjects => {
  switch (program) {
    case 'Bachelor of Science in Information Technology (BSIT)':
      return {
        coreSubjects: [
          'Web and Mobile Application Development',
          'Network Administration and Security Management',
          'Data Science and Software Design',
          'Service Management for Business Process Outsourcing',
          'Business Analytics',
          'Cloud Computing'
        ],
        gecSubjects: [],
        peNstpSubjects: []
      };
    case 'Bachelor of Science in Computer Science (BSCS)':
      return {
        coreSubjects: [
          'Software Engineering',
          'Artificial Intelligence and Machine Learning',
          'Data Science',
          'Cloud Computing',
          'Cybersecurity'
        ],
        gecSubjects: [],
        peNstpSubjects: []
      };
    case 'Bachelor of Science in Entertainment and Multimedia Computing (BSEMC)':
      return {
        coreSubjects: [
          'Game Development',
          'Digital Animation Technology',
          'Interactive Media and Web Development',
          'Virtual Reality and Augmented Reality',
          'Multimedia Design'
        ],
        gecSubjects: [],
        peNstpSubjects: []
      };
    default:
      return { coreSubjects: [], gecSubjects: [], peNstpSubjects: [] };
  }
};

// API response mappers
export const mapMentorResponse = (response: any) => {
  const mentor = response.data.mentor || response.data;
  return {
    sex: capitalizeFirstLetter(mentor.sex || ''),
    phoneNumber: mentor.phoneNumber || '',
    address: mentor.address || '',
    program: mentor.program === 'BSIT' ? 'Bachelor of Science in Information Technology (BSIT)' :
             mentor.program === 'BSCS' ? 'Bachelor of Science in Computer Science (BSCS)' :
             mentor.program === 'BSEMC' ? 'Bachelor of Science in Entertainment and Multimedia Computing (BSEMC)' :
             mentor.program || '',
    yearLevel: capitalizeFirstLetter(mentor.yearLevel || ''),
    subjects: mentor.subjects || [],
    proficiency: capitalizeFirstLetter(mentor.proficiency || ''),
    modality: capitalizeFirstLetter(mentor.modality || ''),
    style: (mentor.style || []).map((s: string) => 
      s.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    ),
    availability: (mentor.availability || []).map((d: string) => capitalizeFirstLetter(d)),
    sessionDur: (mentor.sessionDur || '').replace('1hr', '1 hour').replace('2hrs', '2 hours').replace('3hrs', '3 hours'),
    bio: mentor.bio || '',
    goals: mentor.exp || '',
  };
};

export const mapLearnerResponse = (response: any) => {
  const learner = response.data.learner || response.data;
  return {
    sex: capitalizeFirstLetter(learner.sex || ''),
    phoneNumber: learner.phoneNumber || '',
    address: learner.address || '',
    program: learner.program === 'BSIT' ? 'Bachelor of Science in Information Technology (BSIT)' :
             learner.program === 'BSCS' ? 'Bachelor of Science in Computer Science (BSCS)' :
             learner.program === 'BSEMC' ? 'Bachelor of Science in Entertainment and Multimedia Computing (BSEMC)' :
             learner.program || '',
    yearLevel: capitalizeFirstLetter(learner.yearLevel || ''),
    subjects: learner.subjects || [],
    modality: capitalizeFirstLetter(learner.modality || ''),
    style: (learner.style || []).map((s: string) => 
      s.split('-').map(word => capitalizeFirstLetter(word)).join(' ')
    ),
    availability: (learner.availability || []).map((d: string) => capitalizeFirstLetter(d)),
    sessionDur: (learner.sessionDur || '').replace('1hr', '1 hour').replace('2hrs', '2 hours').replace('3hrs', '3 hours'),
    bio: learner.bio || '',
    goals: learner.goals || '',
  };
};