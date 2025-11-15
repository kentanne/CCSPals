'use client';

import Navbar from '@/components/organisms/Navbar';
import HeroSection from '@/components/molecules/homepage/HeroSection';
import LearnersSection from '@/components/molecules/homepage/LearnersSection';
import MentorsSection from '@/components/molecules/homepage/MentorsSection';
import HowItWorksSection from '@/components/molecules/homepage/HowItWorksSection';
import PricingSection from '@/components/molecules/homepage/PricingSection';
import JoinSection from '@/components/molecules/homepage/JoinSection';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.homeContainer}>
      <Navbar />
      <HeroSection />
      <LearnersSection />
      <MentorsSection />
      <HowItWorksSection />
      <PricingSection />
      <JoinSection />
    </div>
  );
}