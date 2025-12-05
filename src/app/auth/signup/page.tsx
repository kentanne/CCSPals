'use client';

import { useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useRoleSelection } from '@/hooks/useRoleSelection';
import { navigateToHome } from '@/utils/navigationHelpers';
import styles from './Signup.module.css';

const RoleCard = dynamic(() => import('@/components/molecules/RoleCard'), {
  loading: () => <div className={styles.loadingCard}>Loading...</div>,
  ssr: false
});

export default function SignupPage() {
  const router = useRouter();
  const {
    showConfirmationModal,
    selectedRole,
    initiateSignUp,
    confirmSelection,
    cancelSelection,
  } = useRoleSelection();

  // Refs
  const backButtonRef = useRef<HTMLButtonElement>(null);
  const learnerCardRef = useRef<HTMLDivElement>(null);
  const mentorCardRef = useRef<HTMLDivElement>(null);

  // Auto-focus back button on component mount
  useEffect(() => {
    backButtonRef.current?.focus();
  }, []);

  // JSX Return
  return (
    <div className={styles.signupContainer}>
      <button 
        ref={backButtonRef}
        onClick={() => navigateToHome(router, 'get-started')} 
        className={styles.backBtn}
        tabIndex={0}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M11.03 3.97a.75.75 0 010 1.06l-6.22 6.22H21a.75.75 0 010 1.5H4.81l6.22 6.22a.75.75 0 11-1.06 1.06l-7.5-7.5a.75.75 0 010-1.06l7.5-7.5a.75.75 0 011.06 0z"
            clipRule="evenodd"
          />
        </svg>
        Back
      </button>

      {/* Confirmation Modal */}
      {showConfirmationModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.confirmationModal}>
            <h3>Confirm Your Selection</h3>
            <p>
              You've selected to proceed as a <strong>{selectedRole.toUpperCase()}</strong>.
              <br />
              Continue with this role?
            </p>
            <div className={styles.modalActions}>
              <button className={styles.cancelBtn} onClick={cancelSelection}>
                Cancel
              </button>
              <button className={styles.confirmBtn} onClick={confirmSelection}>
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={styles.headerText}>
        <h1>Complete Your Account</h1>
        <p>Pick a role to proceed with your profile setup</p>
      </div>

      <section className={styles.joinSection} id="get-started">
        <RoleCard
          role="learner"
          onFocus={() => {}}
          onClick={() => initiateSignUp('learner')}
          cardRef={learnerCardRef}
          styles={styles}
        />
        <RoleCard
          role="mentor"
          onFocus={() => {}}
          onClick={() => initiateSignUp('mentor')}
          cardRef={mentorCardRef}
          styles={styles}
        />
      </section>
    </div>
  );
}