export interface DropdownOpenState {
  gender: boolean;
  yearLevel: boolean;
  program: boolean;
  modality: boolean;
  proficiency: boolean;
  availability: boolean;
  learningStyle: boolean;
  sessionDuration: boolean;
}

export interface ValidationErrors {
  address?: string;
  contactNumber?: string;
  gender?: string;
  selectedSubjects?: string;
  bio?: string;
  goals?: string;
  experience?: string;
  [key: string]: string | undefined;
}

export interface FormData {
  gender: string;
  yearLevel: string;
  program: string;
  contactNumber: string;
  address: string;
  selectedSubjects: string[];
  modality: string;
  selectedDays: string[];
  bio: string;
  proficiency: string;
  selectedSessionStyles: string[];
  sessionDuration: string;
  goals: string;
  experience: string;
  profileImage: string | null;
  profilePictureName: string;
}

export interface FileUploadState {
  profileImage: string | null;
  profilePictureName: string;
  credentials: File[];
  showFileList: boolean;
}