'use client';

import FeatureStep from '@/components/atoms/homepage/FeatureStep';
import { useHomepageNavigation } from '@/hooks/useNavigation';
import styles from '@/app/page.module.css';

export default function HowItWorksSection() {
  const { goToLearnMore } = useHomepageNavigation();

  const features = [
    { icon: "/img/icon1.png", title: "Find a Mentor or Learner", description: "Search and filter peers based on subjects, expertise, availability, and ratings." },
    { icon: "/img/icon2.png", title: "Check Profiles & Qualifications", description: "View mentor and learner profiles, including expertise, experience, and session availability." },
    { icon: "/img/icon3.png", title: "Learn & Teach", description: "Expand your knowledge or share your expertise by joining peer-assisted sessions." },
    { icon: "/img/icon4.png", title: "Schedule Your Session", description: "Book a tutoring session at a time that works best for both you and your peer." },
    { icon: "/img/icon5.png", title: "Get Notified", description: "Receive email reminders for upcoming sessions, booking changes, or cancellations." },
    { icon: "/img/icon6.png", title: "Rate & Review", description: "Provide feedback on completed sessions to help improve the learning experience for others." }
  ];

  return (
    <section id="how-it-works" className={styles.howItWorks}>
      <h2>HOW IT WORKS</h2>
      <div className={styles.howItWorksGrid}>
        <div className={styles.row}>
          {features.slice(0, 3).map((feature, index) => (
            <FeatureStep
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
        <div className={styles.row}>
          {features.slice(3, 6).map((feature, index) => (
            <FeatureStep
              key={index + 3}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
      <button className={styles.learnMoreBtn} onClick={goToLearnMore}>LEARN MORE</button>
    </section>
  );
}