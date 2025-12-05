import React from 'react';
import { getCurrentDateTime } from '@/utils/dateUtils';

interface DatePopupProps {
  showDatePopup: boolean;
  datePopupRef: React.RefObject<HTMLDivElement>;
  styles: any;
}

export const DatePopup: React.FC<DatePopupProps> = ({ showDatePopup, datePopupRef, styles }) => {
  if (!showDatePopup) return null;
  
  const { date, time } = getCurrentDateTime();
  
  return (
    <div className={styles.datePopup} ref={datePopupRef}>
      <div className={styles.dateContent}>
        <div className={styles.currentDate}>{date}</div>
        <div className={styles.currentTime}>{time}</div>
      </div>
      <div className={styles.popupArrow}></div>
    </div>
  );
};