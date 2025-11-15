import styles from '@/app/page.module.css';

interface PricingCardProps {
  plan: any;
  onButtonClick: () => void;
}

export default function PricingCard({ plan, onButtonClick }: PricingCardProps) {
  return (
    <div className={`${styles.pricingCard} ${styles[`${plan.type}Card`]}`}>
      {plan.badge && <div className={styles.cardBadge}>{plan.badge}</div>}
      <div className={styles.cardHeader}>
        <h3>{plan.name}</h3>
        <div className={styles.price}>
          <span className={styles.priceAmount}>{plan.price}</span>
          <span className={styles.pricePeriod}>{plan.period}</span>
        </div>
      </div>
      <div className={styles.cardBody}>
        <ul className={styles.featuresList}>
          {plan.features.map((feature: string, index: number) => (
            <li key={index} className={styles.featureItem}>
              <span className={styles.featureIcon}>
                {plan.type === 'free' ? '✓' : plan.type === 'pro' ? '⚡' : '🎯'}
              </span>
              {feature}
            </li>
          ))}
        </ul>
        <button 
          className={`${styles.planButton} ${styles[`${plan.type}Button`]}`}
          onClick={onButtonClick}
        >
          {plan.buttonText}
        </button>
      </div>
    </div>
  );
}