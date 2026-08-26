import type { Metadata } from 'next';
import type {
  BlogPostPublic,
  RestaurantSettingsPublic,
  ShopProductPublic,
} from '@alma-jardin/shared';

export const SITE_NAME = 'Alma Jardín';

export const DEFAULT_DESCRIPTION =
  'Restaurante Alma Jardín — cocina gourmet en un jardín vivo, inspirada en la naturaleza y el vuelo del colibrí.';

export function getSiteUrl(): string {
  const configured =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    process.env.WEB_ORIGIN?.trim() ||
    '';

  if (configured) {
    return configured.replace(/\/$/, '');
  }

  return 'http://localhost:4200';
}

export function absoluteUrl(path = '/'): string {
  const base = getSiteUrl();
  if (!path || path === '/') return base;
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

export function truncateText(value: string, max = 160): string {
  const normalized = value.replace(/\s+/g, ' ').trim();
  if (normalized.length <= max) return normalized;
  return `${normalized.slice(0, max - 1).trimEnd()}…`;
}

type BuildPageMetadataInput = {
  title: string;
  description?: string;
  path: string;
  imageUrl?: string | null;
  type?: 'website' | 'article';
  noIndex?: boolean;
  absoluteTitle?: boolean;
};

export function buildPageMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  path,
  imageUrl,
  type = 'website',
  noIndex = false,
  absoluteTitle = false,
}: BuildPageMetadataInput): Metadata {
  const url = absoluteUrl(path);
  const descriptionText = truncateText(description);
  const images = imageUrl
    ? [{ url: imageUrl, alt: title }]
    : undefined;

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description: descriptionText,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description: descriptionText,
      url,
      siteName: SITE_NAME,
      locale: 'es_ES',
      type,
      images,
    },
    twitter: {
      card: imageUrl ? 'summary_large_image' : 'summary',
      title,
      description: descriptionText,
      images: imageUrl ? [imageUrl] : undefined,
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}

export function restaurantJsonLd(
  settings: RestaurantSettingsPublic,
  options?: { imageUrl?: string | null },
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: settings.name,
    description: truncateText(
      settings.aboutText || settings.tagline || DEFAULT_DESCRIPTION,
    ),
    url: absoluteUrl('/'),
    telephone: settings.phone,
    email: settings.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: settings.address,
    },
    image: options?.imageUrl || undefined,
    sameAs: [settings.instagramUrl, settings.mapUrl].filter(Boolean),
    servesCuisine: 'Gourmet',
    priceRange: '$$',
    openingHours: settings.openingHours || undefined,
    potentialAction: {
      '@type': 'ReserveAction',
      target: absoluteUrl('/reservar'),
    },
  };
}

export function blogPostingJsonLd(post: BlogPostPublic) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: truncateText(post.excerpt),
    image: post.coverImageUrl || undefined,
    datePublished: post.publishedAt || post.createdAt,
    dateModified: post.updatedAt || post.publishedAt || post.createdAt,
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
    author: {
      '@type': 'Organization',
      name: SITE_NAME,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: absoluteUrl('/'),
    },
    articleSection: post.category,
  };
}

export function productJsonLd(product: ShopProductPublic) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: truncateText(
      product.description || product.story || product.name,
    ),
    image: product.imageUrls?.length ? product.imageUrls : undefined,
    sku: product.slug,
    brand: {
      '@type': 'Brand',
      name: product.artistName || SITE_NAME,
    },
    offers: {
      '@type': 'Offer',
      url: absoluteUrl(`/tienda/${product.slug}`),
      priceCurrency: 'COP',
      price: (product.priceCents / 100).toFixed(2),
      availability:
        product.status === 'sold_out'
          ? 'https://schema.org/SoldOut'
          : 'https://schema.org/InStock',
    },
  };
}
