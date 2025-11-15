import Image from 'next/image';
import styles from '@/app/page.module.css';

export default function MentorsSection() {
  return (
    <section id="mentors" className={`${styles.contentSection} ${styles.mentorsSection}`}>
      <Image
        className={styles.mentorsImage}
        src="/img/mentors.png"
        alt="Mentors Illustration"
        width={290}
        height={290}
      />
      <div className={`${styles.contentBox} ${styles.mentorContentBox}`}>
        <h2 className={styles.mentorsHeading}>MENTORS</h2>
        <p>
          Being a mentor is more than just sharing what you know, it's about
          helping others grow. By guiding fellow students through their academic
          hurdles, you strengthen your own understanding while making a positive
          difference. It's a fulfilling way to develop leadership skills,
          improve communication, and contribute to a supportive student
          community.
        </p>
      </div>
    </section>
  );
}