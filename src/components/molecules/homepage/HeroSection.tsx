import Image from 'next/image';
import styles from '@/app/page.module.css';

export default function HeroSection() {
  return (
    <main className={styles.introSection} id="home">
      <div className={styles.introContent}>
        <Image 
          alt="Illustration" 
          src="/img/logo_gccoed.png"
          className={styles.introLogo} 
          width={500}
          height={300}
          priority
        />
        <div className={styles.introText}>
          <h1>Mind<span className={styles.highlightEd}>Mates</span>:</h1>
          <p>A Peer-Assisted Educational Sessions</p>
        </div>
      </div>
    </main>
  );
}