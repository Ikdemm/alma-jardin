import Image from 'next/image';
import styles from './alma-logo.module.css';

type AlmaLogoProps = {
  className?: string;
  tone?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg' | 'hero';
  priority?: boolean;
};

const MARK_HEIGHT = {
  sm: 28,
  md: 36,
  lg: 48,
  hero: 72,
} as const;

const MARK_ASPECT = 127 / 200;

export function AlmaLogo({
  className,
  tone = 'light',
  size = 'md',
  priority = false,
}: AlmaLogoProps) {
  const markHeight = MARK_HEIGHT[size];
  const markWidth = Math.round(markHeight * MARK_ASPECT);

  return (
    <span
      className={[styles.logo, styles[tone], styles[size], className]
        .filter(Boolean)
        .join(' ')}
    >
      <Image
        src="/colibri-icon.png"
        alt=""
        aria-hidden
        width={markWidth}
        height={markHeight}
        priority={priority}
        className={styles.mark}
      />
      <span className={styles.wordmark}>alma</span>
    </span>
  );
}
