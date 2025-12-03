export interface User {
  id: number | null;
  name: string;
  email: string;
  role: string;
}

export interface Mentor {
  address: string;
  proficiency?: string;
  year: string;
  course: string;
  availability: string[];
  prefSessDur: string;
  bio: string;
  subjects: string[];
  image: string;
  phoneNum: string;
  teach_sty: string[];
  credentials: string[];
  exp: string;
  rating_ave: number;
  gender?: string;
  learn_modality?: string;
}

export interface UserData {
  user: User;
  ment: Mentor;
  image_url: string | null;
}

export type EditInformationComponentProps = {
  userData: any;
  onSave: (updatedData: any) => void;
  onCancel: () => void;
  onUpdateUserData?: (updatedData: Partial<any>) => void;
};

export type OptionItem = string | { label: string; value: string };

export type InputField = {
  field: string;
  type: 'text' | 'select' | 'checkbox';
  options?: OptionItem[];
  placeholder?: string;
};

export type BioField = {
  field: string;
  column: number;
  placeholder?: string;
};