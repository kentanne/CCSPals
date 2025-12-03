import React from 'react';
import { TopbarItem } from '@/constants/navigation';

interface TopbarNavigationProps {
  items: TopbarItem[];
  activeComponent: string;
  focusedTopbarIndex: number;
  isTopbarFocused: boolean;
  onItemClick: (component: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onFocus: () => void;
  topbarRef: React.RefObject<HTMLDivElement>;
  styles: any;
}

export const TopbarNavigation: React.FC<TopbarNavigationProps> = ({
  items,
  activeComponent,
  focusedTopbarIndex,
  isTopbarFocused,
  onItemClick,
  onKeyDown,
  onFocus,
  topbarRef,
  styles
}) => (
  <div 
    ref={topbarRef}
    className={`
      ${styles.topbar} 
      ${isTopbarFocused ? styles['topbar-focused'] : ''}
    `}
    tabIndex={0}
    onKeyDown={onKeyDown}
    onFocus={onFocus}
    onClick={onFocus}
  >
    <div className={styles['topbar-left']}>
      {items.map((item, index) => (
        <div
          key={item.key}
          onClick={() => onItemClick(item.key)}
          className={`
            ${styles['topbar-option']} 
            ${activeComponent === item.key ? styles.active : ''}
            ${index === focusedTopbarIndex && isTopbarFocused ? styles.focused : ''}
          `}
        >
          <img src={item.icon} alt={item.label} className={styles['nav-icon']} />
          <span className={styles['nav-text']}>{item.label}</span>
        </div>
      ))}
    </div>
  </div>
);