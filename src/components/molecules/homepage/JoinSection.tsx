'use client';

import { useHomepageNavigation } from '@/hooks/useNavigation';
import styles from '@/app/page.module.css';

export default function JoinSection() {
  const { goToSignup } = useHomepageNavigation();

  return (
    <section className={styles.joinSection} id="get-started">
      <div className={styles.getStartedCard}>
        <h2 className={styles.getStartedTitle}>Ready to Get Started?</h2>
        <div className={styles.getStartedContent}>
          <ul className={styles.benefitsList}>
            <li>
              <span className={styles.benefitIcon}>✓</span>
              Connect with mentors in various subjects
            </li>
            <li>
              <span className={styles.benefitIcon}>✓</span>
              Share your knowledge as a mentor
            </li>
            <li>
              <span className={styles.benefitIcon}>✓</span>
              Flexible scheduling for sessions
            </li>
            <li>
              <span className={styles.benefitIcon}>✓</span>
              Join our supportive learning community
            </li>
          </ul>
          <button className={styles.signupBtn} onClick={goToSignup}>JOIN NOW</button>
        </div>
      </div>
    </section>
  );
}