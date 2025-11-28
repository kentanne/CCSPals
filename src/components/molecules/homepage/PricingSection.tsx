'use client';

import PricingCard from '@/components/atoms/homepage/PricingCard';
import { useHomepageNavigation } from '@/hooks/useNavigation';
import styles from '@/app/page.module.css';

export default function PricingSection() {
  const { goToSignup } = useHomepageNavigation();

  const pricingPlans = [
    {
      name: 'Free Plan',
      price: '$0',
      period: '/forever',
      features: [
        'Access to basic mentor matching',
        'Schedule up to 3 sessions per week',
        'Community support forum',
        'Basic profile customization',
        'Email notifications'
      ],
      buttonText: 'Get Started Free',
      type: 'free'
    },
    {
      name: 'Pro Plan',
      price: '$9',
      period: '/month',
      badge: 'Most Popular',
      features: [
        'Unlimited session scheduling',
        'Priority mentor matching',
        'Advanced analytics dashboard',
        'Custom learning paths',
        'Group session hosting',
        'Premium support 24/7'
      ],
      buttonText: 'Upgrade to Pro',
      type: 'pro'
    },
    {
      name: 'Premium Plan',
      price: '$19',
      period: '/month',
      features: [
        'All Pro features included',
        'One-on-one expert mentoring',
        'Custom certification programs',
        'Career guidance sessions',
        'Exclusive webinars & workshops',
        'Dedicated success manager'
      ],
      buttonText: 'Go Premium',
      type: 'premium'
    }
  ];

  return (
    <section id="pricing" className={styles.pricingSection}>
      <div className={styles.pricingContainer}>
        <h2 className={styles.pricingTitle}>CHOOSE YOUR PLAN</h2>
        <p className={styles.pricingSubtitle}>Free access with premium features for everyone</p>
        <div className={styles.pricingCards}>
          {pricingPlans.map((plan, index) => (
            <PricingCard key={index} plan={plan} onButtonClick={goToSignup} />
          ))}
        </div>
      </div>
    </section>
  );
}