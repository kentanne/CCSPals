import React from 'react';

interface LoadingSpinnerProps {
  styles: any;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ styles }) => (
  <div className={styles['loading-overlay']}>
    <div className={styles['loading-backdrop']}></div>
    <div className={styles['loading-spinner']}></div>
  </div>
);