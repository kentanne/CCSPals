import React from 'react';

interface CalendarButtonProps {
  onClick: () => void;
  styles: any;
}

export const CalendarButton: React.FC<CalendarButtonProps> = ({ onClick, styles }) => (
  <div className={styles.dateContainer}>
    <button 
      className={styles.calendarIconBtn}
      onClick={onClick}
      aria-label="Show current date and time"
    >
      <img src="/svg/time.svg" alt="Calendar" className={styles.calendarIcon} />
    </button>
  </div>
);