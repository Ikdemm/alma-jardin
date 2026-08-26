export const PERMISSION_MODULES = [
  'admins',
  'roles',
  'menu_categories',
  'menu_items',
  'shop_categories',
  'shop_products',
  'reservations',
  'blog_posts',
  'contact_messages',
  'banners',
  'featured_sections',
  'settings',
  'whatsapp',
] as const;

export type PermissionModule = (typeof PERMISSION_MODULES)[number];

export const PERMISSION_ACTIONS = ['read', 'create', 'update', 'delete'] as const;

export type PermissionAction = (typeof PERMISSION_ACTIONS)[number];

export type PermissionCode = `${PermissionModule}.${PermissionAction}`;

export const PERMISSION_LABELS: Record<PermissionModule, string> = {
  admins: 'Administradores',
  roles: 'Roles',
  menu_categories: 'Categorías del menú',
  menu_items: 'Ítems del menú',
  shop_categories: 'Categorías de tienda',
  shop_products: 'Productos de tienda',
  reservations: 'Reservas',
  blog_posts: 'Blog',
  contact_messages: 'Mensajes de contacto',
  banners: 'Banners',
  featured_sections: 'Secciones destacadas',
  settings: 'Configuración general',
  whatsapp: 'Integraciones WhatsApp',
};

export const ALL_PERMISSIONS: PermissionCode[] = PERMISSION_MODULES.flatMap(
  (module) =>
    PERMISSION_ACTIONS.map(
      (action) => `${module}.${action}` as PermissionCode,
    ),
);

export function buildPermissionCatalog() {
  return PERMISSION_MODULES.map((module) => ({
    module,
    label: PERMISSION_LABELS[module],
    permissions: PERMISSION_ACTIONS.map((action) => ({
      code: `${module}.${action}` as PermissionCode,
      action,
      label: `${PERMISSION_LABELS[module]} — ${action}`,
    })),
  }));
}

export function isPermissionCode(value: string): value is PermissionCode {
  return ALL_PERMISSIONS.includes(value as PermissionCode);
}
