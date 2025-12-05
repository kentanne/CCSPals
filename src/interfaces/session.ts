import { ReactNode } from 'react';

export interface SessionUser {
  id: string | number;
  name: string;
  image?: string;
  program?: string;
  yearLevel?: string;
  ment_inf_id?: number;
  user?: {
    name: string;
  };
}

export interface SessionItem {
  id: string | number;
  subject: string;
  date: string;
  time: string;
  location: string;
  learner?: SessionUser;
  mentor?: SessionUser;
  learners?: Array<{ id: string; name: string }>;
  sessionType?: 'one-on-one' | 'group';
  groupName?: string;
  maxParticipants?: number;
  files?: any[];
}

export interface FileItem {
  id: string | number;
  file_name: string;
  file_id: string;
  owner_id: string | number;
  webViewLink?: string;
  webContentLink?: string;
}

export interface SessionComponentProps {
  schedule?: SessionItem[];
  upcomingSchedule?: SessionItem[];
  mentFiles?: { files: FileItem[] };
  schedForReview?: SessionItem[];
  userInformation?: any[];
  userData?: any;
  onScheduleCreated?: () => Promise<void>;
}

export interface PopupOption {
  label: string;
  icon: ReactNode;
  onClick: (item: SessionItem, event: React.MouseEvent) => void;
  variant?: 'default' | 'danger';
}

export interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'default' | 'danger' | 'warning';
}

// Mock data interfaces
export interface MockSessionData {
  schedule: SessionItem[];
  upcomingSchedule: SessionItem[];
  mentFiles: { files: FileItem[] };
}