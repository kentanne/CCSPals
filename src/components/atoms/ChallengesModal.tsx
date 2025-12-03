import React from 'react';
import styles from '@/app/components/mentorpage/challenges/challenges.module.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  maxWidth?: string;
}

export const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  actions,
  maxWidth = '600px' 
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal} style={{ maxWidth }}>
        <div className={styles.modalHeader}>
          <h3>{title}</h3>
          <button 
            className={styles.closeButton}
            onClick={onClose}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className={styles.modalContent}>
          {children}
        </div>
        
        {actions && (
          <div className={styles.modalActions}>
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};