import Image from 'next/image';
import styles from './alma-logo.module.css';

type AlmaLogoProps = {
  className?: string;
  tone?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg' | 'hero';
  priority?: boolean;
};

const HEIGHT = {
  sm: 28,
  md: 36,
  lg: 48,
  hero: 72,
} as const;

export function AlmaLogo({
  className,
  tone = 'light',
  size = 'md',
  priority = false,
}: AlmaLogoProps) {
  const height = HEIGHT[size];
  const width = Math.round((height * 98) / 150);

  return (
    <span
      className={[styles.logo, styles[tone], styles[size], className]
        .filter(Boolean)
        .join(' ')}
    >
      <Image
        src="/logo-alma.png"
        alt="alma"
        width={width}
        height={height}
        priority={priority}
        className={styles.image}
      />
    </span>
  );
}
