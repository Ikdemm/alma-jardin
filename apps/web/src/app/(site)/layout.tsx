import { Cormorant_Garamond, DM_Sans } from 'next/font/google';
import { getPublicSettings } from '@/lib/public-api';
import { SiteFooter } from '@/components/site/site-footer';
import { SiteHeader } from '@/components/site/site-header';
import styles from './site.module.css';

const display = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-display',
});

const body = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-body',
});

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getPublicSettings();
  const siteName = settings?.name ?? 'Alma Jardín';

  return (
    <div className={`${styles.site} ${display.variable} ${body.variable}`}>
      <SiteHeader siteName={siteName} />
      <main className={styles.main}>{children}</main>
      {settings ? <SiteFooter settings={settings} /> : null}
    </div>
  );
}
