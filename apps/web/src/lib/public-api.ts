import type {
  CreateContactInput,
  CreateReservationInput,
  MenuCategoryPublic,
  MenuItemPublic,
  ReservationPublic,
  RestaurantSettingsPublic,
  ContactMessagePublic,
} from '@alma-jardin/shared';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3333/api';

async function publicFetch<T>(path: string, init?: RequestInit): Promise<T | null> {
  try {
    const response = await fetch(`${API_URL}${path}`, {
      ...init,
      next: init?.cache === 'no-store' ? undefined : { revalidate: 60 },
    });

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch {
    return null;
  }
}

export function getPublicSettings(): Promise<RestaurantSettingsPublic | null> {
  return publicFetch('/settings/public');
}

export function getMenuCategories(): Promise<MenuCategoryPublic[] | null> {
  return publicFetch('/menu/categories');
}

export function getMenuItems(category?: string): Promise<MenuItemPublic[] | null> {
  const query = category ? `?category=${encodeURIComponent(category)}` : '';
  return publicFetch(`/menu/items${query}`);
}

export function getFeaturedItems(): Promise<MenuItemPublic[] | null> {
  return publicFetch('/menu/featured');
}

export async function createReservation(
  input: CreateReservationInput,
): Promise<{ data?: ReservationPublic; error?: string }> {
  return postPublic<ReservationPublic>('/reservations', input);
}

export async function createContactMessage(
  input: CreateContactInput,
): Promise<{ data?: ContactMessagePublic; error?: string }> {
  return postPublic<ContactMessagePublic>('/contact', input);
}

async function postPublic<T>(path: string, input: unknown): Promise<{ data?: T; error?: string }> {
  try {
    const response = await fetch(`${API_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
      cache: 'no-store',
    });

    const body = await response.json().catch(() => ({}));

    if (!response.ok) {
      const message =
        typeof body.message === 'string'
          ? body.message
          : Array.isArray(body.message)
            ? body.message.join(', ')
            : 'No se pudo completar la solicitud';
      return { error: message };
    }

    return { data: body as T };
  } catch {
    return { error: 'Error de conexión. Intenta de nuevo.' };
  }
}
