export function formatPriceCents(priceCents: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(priceCents / 100);
}

export function whatsappUrl(phone: string, message: string): string {
  const params = new URLSearchParams({ text: message });
  return `https://wa.me/${phone}?${params.toString()}`;
}

export const RESERVATION_STATUS_LABELS: Record<string, string> = {
  pending: 'Pendiente',
  confirmed: 'Confirmada',
  rejected: 'Rechazada',
  cancelled: 'Cancelada',
};

export const MENU_ITEM_STATUS_LABELS: Record<string, string> = {
  active: 'Activo',
  sold_out: 'Agotado',
  hidden: 'Oculto',
};

export const CONTACT_STATUS_LABELS: Record<string, string> = {
  new: 'Nuevo',
  read: 'Leído',
  archived: 'Archivado',
};
