import type { MetadataRoute } from 'next';
import {
  getBlogPosts,
  getShopProducts,
} from '@/lib/public-api';
import { absoluteUrl } from '@/lib/seo';

const STATIC_ROUTES: Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
  priority: number;
}> = [
  { path: '/', changeFrequency: 'weekly', priority: 1 },
  { path: '/menu', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/reservar', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/tienda', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/blog', changeFrequency: 'weekly', priority: 0.7 },
  { path: '/contacto', changeFrequency: 'yearly', priority: 0.5 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, products] = await Promise.all([
    getBlogPosts(),
    getShopProducts(),
  ]);

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: absoluteUrl(route.path),
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const blogEntries: MetadataRoute.Sitemap = (posts ?? []).map((post) => ({
    url: absoluteUrl(`/blog/${post.slug}`),
    lastModified: new Date(post.updatedAt || post.publishedAt || post.createdAt),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  const productEntries: MetadataRoute.Sitemap = (products ?? [])
    .filter((product) => product.status !== 'hidden')
    .map((product) => ({
      url: absoluteUrl(`/tienda/${product.slug}`),
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.65,
    }));

  return [...staticEntries, ...blogEntries, ...productEntries];
}
