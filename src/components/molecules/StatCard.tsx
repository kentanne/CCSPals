import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: React.ReactNode;
  icon: React.ReactNode;
  color: string;
  styles: any;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  subtitle, 
  trend, 
  icon, 
  color,
  styles 
}) => (
  <div className={styles.statCard}>
    <div className={styles.statContent}>
      <div className={styles.statMain}>
        <h3>{value}</h3>
        <p>{title}</p>
      </div>
      <div className={styles.statIcon} style={{ color: color }}>
        {icon}
      </div>
    </div>
    <div className={styles.statFooter}>
      {subtitle && <span className={styles.statSubtitle}>{subtitle}</span>}
      {trend && <div className={styles.statTrend}>{trend}</div>}
    </div>
  </div>
);

export default StatCard;