export const SPECIALIZATIONS = ['all', 'programming', 'mathematics', 'science', 'language', 'business', 'design', 'data-science', 'cybersecurity'] as const;

export const STATUSES = ['all', 'pending', 'approved', 'rejected'] as const;

export type Specialization = typeof SPECIALIZATIONS[number];
export type SubmissionStatus = typeof STATUSES[number];