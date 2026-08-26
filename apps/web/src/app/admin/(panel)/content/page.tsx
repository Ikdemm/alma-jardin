'use client';

import { useEffect, useState } from 'react';

type BannerRow = {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  ctaLabel?: string;
  ctaHref?: string;
  placement: 'home_hero' | 'home_mid';
  orderIndex: number;
  isActive: boolean;
};

type FeaturedRow = {
  id: string;
  title: string;
  subtitle?: string;
  body?: string;
  imageUrl?: string;
  ctaLabel?: string;
  ctaHref?: string;
  orderIndex: number;
  isActive: boolean;
};

type TestimonialRow = {
  id: string;
  quote: string;
  authorName: string;
  authorRole?: string;
  orderIndex: number;
  isActive: boolean;
};

export default function ContentAdminPage() {
  const [banners, setBanners] = useState<BannerRow[]>([]);
  const [featured, setFeatured] = useState<FeaturedRow[]>([]);
  const [testimonials, setTestimonials] = useState<TestimonialRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [bannerForm, setBannerForm] = useState<{
    title: string;
    subtitle: string;
    imageUrl: string;
    ctaLabel: string;
    ctaHref: string;
    placement: 'home_hero' | 'home_mid';
  }>({
    title: '',
    subtitle: '',
    imageUrl: '',
    ctaLabel: '',
    ctaHref: '',
    placement: 'home_mid',
  });
  const [featuredForm, setFeaturedForm] = useState({
    title: '',
    subtitle: '',
    body: '',
    imageUrl: '',
    ctaLabel: '',
    ctaHref: '',
  });
  const [testimonialForm, setTestimonialForm] = useState({
    quote: '',
    authorName: '',
    authorRole: '',
  });

  async function loadAll() {
    const [bannersResponse, featuredResponse, testimonialsResponse] =
      await Promise.all([
        fetch('/api/admin/content/admin/banners'),
        fetch('/api/admin/content/admin/featured-sections'),
        fetch('/api/admin/content/admin/testimonials'),
      ]);

    if (!bannersResponse.ok || !featuredResponse.ok || !testimonialsResponse.ok) {
      throw new Error('No se pudo cargar el contenido visual');
    }

    setBanners(await bannersResponse.json());
    setFeatured(await featuredResponse.json());
    setTestimonials(await testimonialsResponse.json());
  }

  useEffect(() => {
    loadAll().catch((err: Error) => setError(err.message));
  }, []);

  async function createBanner(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    const response = await fetch('/api/admin/content/admin/banners', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...bannerForm,
        subtitle: bannerForm.subtitle || undefined,
        ctaLabel: bannerForm.ctaLabel || undefined,
        ctaHref: bannerForm.ctaHref || undefined,
      }),
    });
    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      setError(body.message ?? 'No se pudo crear el banner');
      return;
    }
    setBannerForm({
      title: '',
      subtitle: '',
      imageUrl: '',
      ctaLabel: '',
      ctaHref: '',
      placement: 'home_mid',
    });
    await loadAll();
  }

  async function createFeatured(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    const response = await fetch('/api/admin/content/admin/featured-sections', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...featuredForm,
        subtitle: featuredForm.subtitle || undefined,
        body: featuredForm.body || undefined,
        imageUrl: featuredForm.imageUrl || undefined,
        ctaLabel: featuredForm.ctaLabel || undefined,
        ctaHref: featuredForm.ctaHref || undefined,
      }),
    });
    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      setError(body.message ?? 'No se pudo crear la sección');
      return;
    }
    setFeaturedForm({
      title: '',
      subtitle: '',
      body: '',
      imageUrl: '',
      ctaLabel: '',
      ctaHref: '',
    });
    await loadAll();
  }

  async function createTestimonial(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    const response = await fetch('/api/admin/content/admin/testimonials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...testimonialForm,
        authorRole: testimonialForm.authorRole || undefined,
      }),
    });
    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      setError(body.message ?? 'No se pudo crear el testimonio');
      return;
    }
    setTestimonialForm({ quote: '', authorName: '', authorRole: '' });
    await loadAll();
  }

  async function toggleActive(
    kind: 'banners' | 'featured-sections' | 'testimonials',
    id: string,
    isActive: boolean,
  ) {
    const response = await fetch(`/api/admin/content/admin/${kind}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !isActive }),
    });
    if (!response.ok) {
      setError('No se pudo actualizar');
      return;
    }
    await loadAll();
  }

  async function remove(
    kind: 'banners' | 'featured-sections' | 'testimonials',
    id: string,
  ) {
    if (!confirm('¿Eliminar este elemento?')) return;
    const response = await fetch(`/api/admin/content/admin/${kind}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      setError('No se pudo eliminar');
      return;
    }
    await loadAll();
  }

  return (
    <section style={{ display: 'grid', gap: '2.5rem' }}>
      <div>
        <h1>Contenido visual</h1>
        <p style={{ color: '#6b5b4f' }}>
          Banners, secciones destacadas y testimonios del sitio público.
        </p>
        {error ? <p style={{ color: '#9a3412' }}>{error}</p> : null}
      </div>

      <div>
        <h2>Banners</h2>
        <form
          onSubmit={createBanner}
          style={{ display: 'grid', gap: '0.6rem', maxWidth: 560, marginBottom: '1rem' }}
        >
          <input
            required
            placeholder="Título"
            value={bannerForm.title}
            onChange={(event) =>
              setBannerForm({ ...bannerForm, title: event.target.value })
            }
          />
          <input
            placeholder="Subtítulo"
            value={bannerForm.subtitle}
            onChange={(event) =>
              setBannerForm({ ...bannerForm, subtitle: event.target.value })
            }
          />
          <input
            required
            placeholder="URL de imagen"
            value={bannerForm.imageUrl}
            onChange={(event) =>
              setBannerForm({ ...bannerForm, imageUrl: event.target.value })
            }
          />
          <input
            placeholder="CTA label"
            value={bannerForm.ctaLabel}
            onChange={(event) =>
              setBannerForm({ ...bannerForm, ctaLabel: event.target.value })
            }
          />
          <input
            placeholder="CTA href"
            value={bannerForm.ctaHref}
            onChange={(event) =>
              setBannerForm({ ...bannerForm, ctaHref: event.target.value })
            }
          />
          <select
            value={bannerForm.placement}
            onChange={(event) =>
              setBannerForm({
                ...bannerForm,
                placement: event.target.value as 'home_hero' | 'home_mid',
              })
            }
          >
            <option value="home_hero">Hero</option>
            <option value="home_mid">Mitad de página</option>
          </select>
          <button type="submit">Crear banner</button>
        </form>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th align="left">Título</th>
              <th align="left">Placement</th>
              <th align="left">Estado</th>
              <th align="left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {banners.map((banner) => (
              <tr key={banner.id}>
                <td>{banner.title}</td>
                <td>{banner.placement}</td>
                <td>{banner.isActive ? 'Activo' : 'Oculto'}</td>
                <td style={{ display: 'flex', gap: '0.35rem' }}>
                  <button
                    type="button"
                    onClick={() =>
                      toggleActive('banners', banner.id, banner.isActive)
                    }
                  >
                    {banner.isActive ? 'Ocultar' : 'Activar'}
                  </button>
                  <button
                    type="button"
                    onClick={() => remove('banners', banner.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <h2>Secciones destacadas</h2>
        <form
          onSubmit={createFeatured}
          style={{ display: 'grid', gap: '0.6rem', maxWidth: 560, marginBottom: '1rem' }}
        >
          <input
            required
            placeholder="Título"
            value={featuredForm.title}
            onChange={(event) =>
              setFeaturedForm({ ...featuredForm, title: event.target.value })
            }
          />
          <input
            placeholder="Subtítulo"
            value={featuredForm.subtitle}
            onChange={(event) =>
              setFeaturedForm({ ...featuredForm, subtitle: event.target.value })
            }
          />
          <textarea
            rows={3}
            placeholder="Texto"
            value={featuredForm.body}
            onChange={(event) =>
              setFeaturedForm({ ...featuredForm, body: event.target.value })
            }
          />
          <input
            placeholder="URL de imagen"
            value={featuredForm.imageUrl}
            onChange={(event) =>
              setFeaturedForm({ ...featuredForm, imageUrl: event.target.value })
            }
          />
          <input
            placeholder="CTA label"
            value={featuredForm.ctaLabel}
            onChange={(event) =>
              setFeaturedForm({ ...featuredForm, ctaLabel: event.target.value })
            }
          />
          <input
            placeholder="CTA href"
            value={featuredForm.ctaHref}
            onChange={(event) =>
              setFeaturedForm({ ...featuredForm, ctaHref: event.target.value })
            }
          />
          <button type="submit">Crear sección</button>
        </form>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th align="left">Título</th>
              <th align="left">Estado</th>
              <th align="left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {featured.map((section) => (
              <tr key={section.id}>
                <td>{section.title}</td>
                <td>{section.isActive ? 'Activa' : 'Oculta'}</td>
                <td style={{ display: 'flex', gap: '0.35rem' }}>
                  <button
                    type="button"
                    onClick={() =>
                      toggleActive(
                        'featured-sections',
                        section.id,
                        section.isActive,
                      )
                    }
                  >
                    {section.isActive ? 'Ocultar' : 'Activar'}
                  </button>
                  <button
                    type="button"
                    onClick={() => remove('featured-sections', section.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <h2>Testimonios</h2>
        <form
          onSubmit={createTestimonial}
          style={{ display: 'grid', gap: '0.6rem', maxWidth: 560, marginBottom: '1rem' }}
        >
          <textarea
            required
            rows={3}
            placeholder="Cita"
            value={testimonialForm.quote}
            onChange={(event) =>
              setTestimonialForm({
                ...testimonialForm,
                quote: event.target.value,
              })
            }
          />
          <input
            required
            placeholder="Autor"
            value={testimonialForm.authorName}
            onChange={(event) =>
              setTestimonialForm({
                ...testimonialForm,
                authorName: event.target.value,
              })
            }
          />
          <input
            placeholder="Rol / contexto"
            value={testimonialForm.authorRole}
            onChange={(event) =>
              setTestimonialForm({
                ...testimonialForm,
                authorRole: event.target.value,
              })
            }
          />
          <button type="submit">Crear testimonio</button>
        </form>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th align="left">Autor</th>
              <th align="left">Cita</th>
              <th align="left">Estado</th>
              <th align="left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {testimonials.map((item) => (
              <tr key={item.id}>
                <td>{item.authorName}</td>
                <td>{item.quote}</td>
                <td>{item.isActive ? 'Activo' : 'Oculto'}</td>
                <td style={{ display: 'flex', gap: '0.35rem' }}>
                  <button
                    type="button"
                    onClick={() =>
                      toggleActive('testimonials', item.id, item.isActive)
                    }
                  >
                    {item.isActive ? 'Ocultar' : 'Activar'}
                  </button>
                  <button
                    type="button"
                    onClick={() => remove('testimonials', item.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
