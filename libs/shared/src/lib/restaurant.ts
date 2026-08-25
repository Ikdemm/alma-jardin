export interface RestaurantSettingsPublic {
  name: string;
  tagline: string;
  heroTitle: string;
  heroSubtitle: string;
  aboutText: string;
  address: string;
  phone: string;
  whatsappPhone: string;
  whatsappMessage: string;
  email: string;
  instagramUrl?: string;
  openingHours: string;
  mapUrl?: string;
}

export interface MenuCategoryPublic {
  id: string;
  name: string;
  slug: string;
  description?: string;
  orderIndex: number;
}

export type MenuItemStatus = 'active' | 'sold_out' | 'hidden';

export interface MenuItemPublic {
  id: string;
  categoryId: string;
  categorySlug: string;
  name: string;
  slug: string;
  description?: string;
  ingredients?: string;
  priceCents: number;
  imageUrl?: string;
  status: MenuItemStatus;
  featured: boolean;
  orderIndex: number;
}

export type ReservationStatus =
  | 'pending'
  | 'confirmed'
  | 'rejected'
  | 'cancelled';

export interface ReservationPublic {
  id: string;
  contactName: string;
  contactPhone: string;
  contactEmail?: string;
  date: string;
  time: string;
  pax: number;
  notes?: string;
  status: ReservationStatus;
  createdAt: string;
}

export interface CreateReservationInput {
  contactName: string;
  contactPhone: string;
  contactEmail?: string;
  date: string;
  time: string;
  pax: number;
  notes?: string;
}
