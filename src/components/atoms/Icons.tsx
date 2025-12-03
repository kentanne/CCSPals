
export const Icons = {

// ANALYTICS ICONS

  Chart: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M3 3V21H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M7 15L11 9L15 13L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),

  Refresh: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M23 4V10H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M1 20V14H7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3.51 9C4.017 7.56 4.879 6.28 6.015 5.27C7.15 4.26 8.52 3.56 10.00 3.22C11.49 2.89 13.03 2.93 14.49 3.35C15.95 3.78 17.28 4.56 18.36 5.64L23 10M1 14L5.64 18.36C6.71 19.43 8.04 20.22 9.50 20.64C10.96 21.06 12.50 21.11 13.99 20.77C15.47 20.44 16.84 19.73 17.98 18.72C19.12 17.71 19.98 16.43 20.49 15" 
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),

  Book: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M4 19.5C4 18.84 4.26 18.20 4.73 17.73C5.20 17.26 5.84 17 6.5 17H20" 
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M6.5 2H20V22H6.5C5.84 22 5.20 21.73 4.73 21.26C4.26 20.79 4 20.16 4 19.5V4.5C4 3.84 4.26 3.20 4.73 2.73C5.20 2.26 5.84 2 6.5 2Z" 
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),

  Graduation: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M12 14L22 9L12 4L2 9L12 14Z" stroke="currentColor" strokeWidth="2"/>
      <path d="M22 9V17C22 18.1 21.53 19.08 20.73 19.88C19.93 20.68 18.95 21 18 21H6C5.04 21 4.06 20.68 3.26 19.88C2.46 19.08 2 18.1 2 17V9" 
        stroke="currentColor" strokeWidth="2"/>
      <path d="M6 12V18" stroke="currentColor" strokeWidth="2"/>
      <path d="M10 11V17" stroke="currentColor" strokeWidth="2"/>
      <path d="M14 13V19" stroke="currentColor" strokeWidth="2"/>
      <path d="M18 12V18" stroke="currentColor" strokeWidth="2"/>
    </svg>
  ),

  Clock: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
      <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2"/>
    </svg>
  ),

  Calendar: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
      <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2"/>
      <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2"/>
      <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2"/>
    </svg>
  ),

  Filter: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M22 3H2L10 12.46V19L14 21V12.46L22 3Z" 
        stroke="currentColor" strokeWidth="2"/>
    </svg>
  ),

  ChevronDown: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2"/>
    </svg>
  ),

  TotalSessions: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M9 19V13C9 11.9 9.9 11 11 11H13C14.1 11 15 11.9 15 13V19C15 20.1 15.9 21 17 21H19C20.1 21 21 20.1 21 19V13C21 11.9 20.1 11 19 11H18" 
        stroke="currentColor" strokeWidth="2"/>
      <path d="M3 5C3 3.9 3.9 3 5 3H7C8.1 3 9 3.9 9 5V19C9 20.1 8.1 21 7 21H5C3.9 21 3 20.1 3 19V5Z" 
        stroke="currentColor" strokeWidth="2"/>
      <path d="M9 7H15" stroke="currentColor" strokeWidth="2"/>
    </svg>
  ),

  GroupSessions: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M17 21V19C17 17.93 16.58 16.92 15.83 16.17C15.07 15.42 14.06 15 13 15H5C3.93 15 2.92 15.42 2.17 16.17C1.42 16.92 1 17.93 1 19V21" 
        stroke="currentColor" strokeWidth="2"/>
      <path d="M9 11C11.21 11 13 9.21 13 7C13 4.79 11.21 3 9 3C6.79 3 5 4.79 5 7C5 9.21 6.79 11 9 11Z" 
        stroke="currentColor" strokeWidth="2"/>
      <path d="M23 21V19C23 17.11 21.76 15.45 20 15.13" 
        stroke="currentColor" strokeWidth="2"/>
      <path d="M16 3.13C17.87 3.58 19.01 5.20 19.01 7C19.01 8.80 17.87 10.42 16 10.88" 
        stroke="currentColor" strokeWidth="2"/>
    </svg>
  ),

  OneOnOne: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M20 21V19C20 17.93 19.58 16.92 18.83 16.17C18.07 15.42 17.06 15 16 15H8C6.93 15 5.92 15.42 5.17 16.17C4.42 16.92 4 17.93 4 19V21" 
        stroke="currentColor" strokeWidth="2"/>
      <path d="M12 11C14.21 11 16 9.21 16 7C16 4.79 14.21 3 12 3C9.79 3 8 4.79 8 7C8 9.21 9.79 11 12 11Z" 
        stroke="currentColor" strokeWidth="2"/>
      <path d="M8 8H16" stroke="currentColor" strokeWidth="2"/>
      <path d="M8 12H16" stroke="currentColor" strokeWidth="2"/>
    </svg>
  ),

  Attendance: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2"/>
      <path d="M21 12C21 16.41 17.41 20 13 20C8.59 20 5 16.41 5 12C5 7.58 8.59 4 13 4C17.41 4 21 7.58 21 12Z" 
        stroke="currentColor" strokeWidth="2"/>
    </svg>
  ),

// COMMUNITY FORUM ICONS  

  Upvote: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M12 5L5 12H10V19H14V12H19L12 5Z" stroke="currentColor" strokeWidth="2"/>
    </svg>
  ),

  Downvote: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M12 19L19 12H14V5H10V12H5L12 19Z" stroke="currentColor" strokeWidth="2"/>
    </svg>
  ),

  Comments: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M21 11C21 6.58 16.97 3 12 3C7.03 3 3 6.58 3 11C3 15.42 7.03 19 12 19C13.44 19 14.81 18.72 16.02 18.22L21 19L19.52 15.51C20.46 14.29 21 12.72 21 11Z" 
        stroke="currentColor" strokeWidth="2"/>
    </svg>
  ),

  Edit: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M3 21V17L14.5 5.5L18.5 9.5L7 21H3Z" stroke="currentColor" strokeWidth="2"/>
    </svg>
  ),

  Delete: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M3 6H21" stroke="currentColor" strokeWidth="2"/>
      <path d="M8 6V4H16V6" stroke="currentColor" strokeWidth="2"/>
      <path d="M6 6L7 20H17L18 6" stroke="currentColor" strokeWidth="2"/>
    </svg>
  ),

  Close: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2"/>
    </svg>
  ),

  FilterCommunity: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M4 6H20M7 12H17M10 18H14" stroke="currentColor" strokeWidth="2"/>
    </svg>
  )
};
