import Image from 'next/image';
import styles from '@/app/page.module.css';

interface FeatureStepProps {
  icon: string;
  title: string;
  description: string;
}

export default function FeatureStep({ icon, title, description }: FeatureStepProps) {
  return (
    <div className={styles.step}>
      <Image src={icon} alt={title} width={85} height={85} />
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}