'use client';

import Navbar from '@/components/organisms/Navbar';
import Image from 'next/image';
import styles from '@/app/pages/Authentication/loginpage/login.module.css';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className={styles.container}>
      <Navbar />
      
      <main className={styles.main}>
        <div className={styles.mainImage}>
          <Image
            src="/logo_gccoed.png"
            alt="MindMates Logo"
            width={400}
            height={300}
            priority
          />
        </div>
        
        {children}
      </main>
    </div>
  );
}