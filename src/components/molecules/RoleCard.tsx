import React from 'react';
import Image from 'next/image';

interface RoleCardProps {
  role: 'learner' | 'mentor';
  onFocus: () => void;
  onClick: () => void;
  cardRef: React.RefObject<HTMLDivElement>;
  styles: any;
}

const roleDetails = {
  learner: {
    label: 'LEARNER',
    img: '/img/learners.png',
    alt: 'Learner Icon',
  },
  mentor: {
    label: 'MENTOR',
    img: '/img/mentors.png',
    alt: 'Mentor Icon',
  },
};

const RoleCard: React.FC<RoleCardProps> = ({ role, onFocus, onClick, cardRef, styles }) => (
  <div 
    ref={cardRef}
    className={`${styles.joinCard} ${role === 'learner' ? styles.learnerCard : styles.mentorCard}`}
    onFocus={onFocus}
    tabIndex={0}
  >
    <div className={styles.cardContent}>
      <div className={styles.roleTitle}>
        <span>PROCEED AS</span>
        <h3>{roleDetails[role].label}</h3>
        <hr className={styles.divider} />
      </div>
      <div className={styles.cardIcon}>
        <Image 
          src={roleDetails[role].img} 
          alt={roleDetails[role].alt} 
          width={230}
          height={200}
        />
      </div>
      <button
        type="button"
        className={styles.joinBtn}
        onClick={onClick}
        aria-label={`Sign up as ${roleDetails[role].label}`}
      >
        Get Started
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  </div>
);

export default RoleCard;
