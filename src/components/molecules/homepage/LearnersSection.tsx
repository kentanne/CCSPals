import Image from 'next/image';
import styles from '@/app/page.module.css';

export default function LearnersSection() {
  return (
    <section id="learners" className={`${styles.contentSection} ${styles.learnersSection}`}>
      <div className={`${styles.contentBox} ${styles.learnersContentBox}`}>
        <h2 className={styles.learnersHeading}>LEARNERS</h2>
        <p className={styles.learnerText}>
          As a learner, you get the chance to boost your knowledge and sharpen
          your skills in subjects that matter to you. Whether you're prepping
          for exams, struggling with tricky topics, or just eager to learn more,
          our platform connects you with mentors who can help. It's all about
          learning at your own pace, with flexible and personalized support to
          help you reach your academic goals.
        </p>
      </div>
      <Image
        className={styles.learnersImage}
        src="/img/learners.png"
        alt="Learners Illustration"
        width={320}
        height={320}
      />
    </section>
  );
}