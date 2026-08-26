import { ColibriMark } from './colibri-mark';
import styles from './alma-logo.module.css';

type AlmaLogoProps = {
  className?: string;
  tone?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg' | 'hero';
};

export function AlmaLogo({
  className,
  tone = 'light',
  size = 'md',
}: AlmaLogoProps) {
  return (
    <span
      className={[styles.logo, styles[tone], styles[size], className]
        .filter(Boolean)
        .join(' ')}
    >
      <ColibriMark className={styles.mark} />
      <span className={styles.wordmark}>alma</span>
    </span>
  );
}
