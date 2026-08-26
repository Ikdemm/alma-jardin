import type { Metadata } from 'next';
import Link from 'next/link';
import { AlmaLogo } from '@/components/site/alma-logo';
import { JsonLd } from '@/components/site/json-ld';
import { MenuCard } from '@/components/site/menu-card';
import { Reveal } from '@/components/site/reveal';
import { whatsappUrl } from '@/lib/format';
import {
  getBanners,
  getFeaturedItems,
  getFeaturedSections,
  getPublicSettings,
  getTestimonials,
} from '@/lib/public-api';
import {
  DEFAULT_DESCRIPTION,
  SITE_NAME,
  buildPageMetadata,
  restaurantJsonLd,
} from '@/lib/seo';
import styles from './site.module.css';

const FALLBACK_HERO =
  'https://images.unsplash.com/photo-1466692476866-aef1dfb1e735?auto=format&fit=crop&w=2000&q=80';
const FALLBACK_ABOUT =
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1600&q=80';

export async function generateMetadata(): Promise<Metadata> {
  const [settings, banners] = await Promise.all([
    getPublicSettings(),
    getBanners(),
  ]);
  const heroBanner =
    (banners ?? []).find((banner) => banner.placement === 'home_hero') ??
    (banners ?? [])[0];

  return buildPageMetadata({
    title: settings?.name ?? SITE_NAME,
    description:
      settings?.heroSubtitle ||
      settings?.tagline ||
      settings?.aboutText ||
      DEFAULT_DESCRIPTION,
    path: '/',
    imageUrl: heroBanner?.imageUrl ?? FALLBACK_HERO,
    absoluteTitle: true,
  });
}

export default async function HomePage() {
  const [settings, featured, banners, featuredSections, testimonials] =
    await Promise.all([
      getPublicSettings(),
      getFeaturedItems(),
      getBanners(),
      getFeaturedSections(),
      getTestimonials(),
    ]);

  const heroBanner =
    (banners ?? []).find((banner) => banner.placement === 'home_hero') ??
    (banners ?? [])[0];
  const midBanner = (banners ?? []).find(
    (banner) => banner.placement === 'home_mid',
  );

  const heroTitle =
    settings?.heroTitle ?? 'Donde el jardín se encuentra con la alta cocina';
  const heroSubtitle =
    settings?.heroSubtitle ??
    'Un refugio verde donde la naturaleza, el fuego lento y el vuelo del colibrí inspiran cada plato.';
  const heroImage = heroBanner?.imageUrl ?? FALLBACK_HERO;
  const aboutText =
    settings?.aboutText ??
    'Cocina gourmet en un entorno vivo, con ingredientes de estación y el susurro del bosque.';
  const waLink = settings
    ? whatsappUrl(settings.whatsappPhone, settings.whatsappMessage)
    : '#';

  return (
    <>
      {settings ? (
        <JsonLd
          data={restaurantJsonLd(settings, { imageUrl: heroImage })}
        />
      ) : null}
      <section className={styles.heroBleed}>
        <div
          className={styles.heroMedia}
          style={{ backgroundImage: `url(${heroImage})` }}
          role="img"
          aria-label="Jardín de Alma Jardín"
        />
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <div className={styles.brandLockup}>
            <AlmaLogo tone="light" size="hero" />
          </div>
          <h1>{heroTitle}</h1>
          <p>{heroSubtitle}</p>
          <div className={styles.heroActions}>
            <Link href="/reservar" className={styles.primaryButton}>
              {heroBanner?.ctaLabel ?? 'Reservar mesa'}
            </Link>
            <Link href="/menu" className={styles.ghostButton}>
              Ver menú
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.gridTwo}>
            <Reveal>
              <p className={styles.eyebrow}>Nuestra alma</p>
              <h2 className={styles.sectionTitle}>Un jardín que se come</h2>
              <p className={styles.sectionLead}>{aboutText}</p>
            </Reveal>
            <Reveal delayMs={120}>
              <div
                className={styles.atmosphereImage}
                style={{ backgroundImage: `url(${FALLBACK_ABOUT})` }}
                role="img"
                aria-label="Mesa en el jardín"
              />
            </Reveal>
          </div>
        </div>
      </section>

      <section className={styles.sectionAlt}>
        <div className={styles.container}>
          <Reveal>
            <p className={styles.eyebrow}>Carta destacada</p>
            <h2 className={styles.sectionTitle}>Sabores del huerto</h2>
            <p className={styles.sectionLead}>
              Platos que capturan la esencia del jardín y la cocina gourmet.
            </p>
          </Reveal>

          <div className={styles.menuGrid}>
            {(featured ?? []).map((item, index) => (
              <Reveal key={item.id} delayMs={index * 80}>
                <MenuCard item={item} />
              </Reveal>
            ))}
          </div>

          <div className={styles.heroActions} style={{ marginTop: '2rem' }}>
            <Link href="/menu" className={styles.primaryButton}>
              Explorar menú completo
            </Link>
          </div>
        </div>
      </section>

      {midBanner ? (
        <section className={styles.promoBand}>
          <div
            className={styles.promoBandMedia}
            style={{ backgroundImage: `url(${midBanner.imageUrl})` }}
          />
          <div className={styles.promoBandOverlay} />
          <div className={styles.promoBandContent}>
            <Reveal>
              <h2>{midBanner.title}</h2>
              {midBanner.subtitle ? <p>{midBanner.subtitle}</p> : null}
              {midBanner.ctaHref && midBanner.ctaLabel ? (
                <Link href={midBanner.ctaHref} className={styles.primaryButton}>
                  {midBanner.ctaLabel}
                </Link>
              ) : null}
            </Reveal>
          </div>
        </section>
      ) : null}

      {(featuredSections ?? []).length > 0 ? (
        <section className={styles.section}>
          <div className={styles.container}>
            <Reveal>
              <p className={styles.eyebrow}>Explora</p>
              <h2 className={styles.sectionTitle}>Más del jardín</h2>
            </Reveal>
            <div className={styles.featureGrid}>
              {(featuredSections ?? []).map((section, index) => (
                <Reveal key={section.id} delayMs={index * 90}>
                  <article className={styles.featureCard}>
                    {section.imageUrl ? (
                      <div
                        className={styles.atmosphereImage}
                        style={{
                          minHeight: 160,
                          marginBottom: '1rem',
                          borderRadius: '0.85rem',
                          backgroundImage: `url(${section.imageUrl})`,
                        }}
                      />
                    ) : null}
                    {section.subtitle ? (
                      <p className={styles.eyebrow}>{section.subtitle}</p>
                    ) : null}
                    <h3>{section.title}</h3>
                    {section.body ? <p>{section.body}</p> : null}
                    {section.ctaHref && section.ctaLabel ? (
                      <p style={{ marginTop: '0.85rem' }}>
                        <Link href={section.ctaHref}>{section.ctaLabel}</Link>
                      </p>
                    ) : null}
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {(testimonials ?? []).length > 0 ? (
        <section className={styles.sectionAlt}>
          <div className={styles.container}>
            <Reveal>
              <p className={styles.eyebrow}>Voces del jardín</p>
              <h2 className={styles.sectionTitle}>Lo que cuentan nuestros huéspedes</h2>
            </Reveal>
            <div className={styles.testimonials}>
              {(testimonials ?? []).map((item, index) => (
                <Reveal key={item.id} delayMs={index * 100}>
                  <blockquote className={styles.testimonial}>
                    <p>“{item.quote}”</p>
                    <footer>
                      <strong>{item.authorName}</strong>
                      {item.authorRole ? ` · ${item.authorRole}` : ''}
                    </footer>
                  </blockquote>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.gridTwo}>
            <Reveal>
              <p className={styles.eyebrow}>Visítanos</p>
              <h2 className={styles.sectionTitle}>Horarios y ubicación</h2>
              <div className={styles.infoCard}>
                <strong>Dirección</strong>
                <span>{settings?.address ?? 'Camino del Bosque 123'}</span>
              </div>
              <div className={styles.infoCard} style={{ marginTop: '1rem' }}>
                <strong>Horario</strong>
                <span>
                  {settings?.openingHours ??
                    'Mar–Dom · Almuerzo 12:00–16:00 · Cena 18:00–23:00'}
                </span>
              </div>
            </Reveal>

            <Reveal delayMs={100}>
              <div className={styles.ctaBand}>
                <div>
                  <h3
                    style={{
                      margin: '0 0 0.5rem',
                      fontFamily: 'var(--font-display)',
                    }}
                  >
                    Reserva tu mesa
                  </h3>
                  <p>
                    Cuéntanos cuántos vienen y si celebran algo especial. Te
                    confirmamos pronto.
                  </p>
                </div>
                <div className={styles.heroActions}>
                  <Link href="/reservar" className={styles.secondaryButton}>
                    Reservar en línea
                  </Link>
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.secondaryButton}
                  >
                    WhatsApp
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
