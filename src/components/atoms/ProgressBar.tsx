import React from 'react';

interface ProgressBarProps {
  percentage: number;
  color: string;
  styles: any;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ percentage, color, styles }) => (
  <div className={styles.progressBar}>
    <div 
      className={styles.progressFill} 
      style={{ 
        width: `${Math.min(percentage, 100)}%`, 
        backgroundColor: color 
      }}
    ></div>
  </div>
);

export default ProgressBar;