import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import type { PermissionCode } from '@alma-jardin/shared';
import { PasswordService } from '../common/password.service';
import { slugify } from '../common/slug.util';
import { Admin, AdminDocument } from '../schemas/admin.schema';
import { BlogPost, BlogPostDocument } from '../schemas/blog-post.schema';
import {
  MenuCategory,
  MenuCategoryDocument,
} from '../schemas/menu-category.schema';
import { MenuItem, MenuItemDocument } from '../schemas/menu-item.schema';
import {
  RestaurantSettings,
  RestaurantSettingsDocument,
} from '../schemas/restaurant-settings.schema';
import { Role, RoleDocument } from '../schemas/role.schema';
import {
  ShopCategory,
  ShopCategoryDocument,
} from '../schemas/shop-category.schema';
import { ShopProduct, ShopProductDocument } from '../schemas/shop-product.schema';

const EDITOR_PERMISSIONS: PermissionCode[] = [
  'menu_categories.read',
  'menu_categories.create',
  'menu_categories.update',
  'menu_items.read',
  'menu_items.create',
  'menu_items.update',
  'shop_categories.read',
  'shop_categories.create',
  'shop_categories.update',
  'shop_products.read',
  'shop_products.create',
  'shop_products.update',
  'blog_posts.read',
  'blog_posts.create',
  'blog_posts.update',
  'blog_posts.delete',
  'reservations.read',
  'reservations.update',
  'contact_messages.read',
  'contact_messages.update',
  'banners.read',
  'banners.create',
  'banners.update',
  'featured_sections.read',
  'featured_sections.create',
  'featured_sections.update',
  'settings.read',
  'settings.update',
];

const BLOG_SEED = [
  {
    title: 'El colibrí que visita el jardín',
    excerpt:
      'Cada atardecer, un colibrí recorre las flores del huerto. Así nació el símbolo de Alma Jardín.',
    content:
      'Hay un momento del día en que el jardín se detiene. La luz se filtra entre las hojas y, casi sin aviso, aparece el colibrí.\n\nEsa visita silenciosa inspira nuestra cocina: precisión, delicadeza y respeto por lo vivo. Cada plato busca esa misma gracia — ingredientes de estación, fuego lento y una mesa abierta al verde.',
    category: 'historias' as const,
    featured: true,
  },
  {
    title: 'Receta de temporada: pesto del huerto',
    excerpt:
      'Albahaca fresca, piñones tostados y el aceite justo: el pesto que acompaña nuestras pastas.',
    content:
      'Cosechamos la albahaca por la mañana, cuando el aroma está más intenso.\n\nTrituramos con piñones tostados, ajo suave y parmesano añejo. El secreto no es la cantidad, sino el equilibrio: suficiente aceite para unir, nunca para ahogar.\n\nSirve sobre tagliatelle frescos o como base de nuestra pizza Colibrí verde.',
    category: 'recetas' as const,
    featured: true,
  },
  {
    title: 'Cena bajo los árboles — próximo evento',
    excerpt:
      'Una noche especial con menú degustación en el jardín. Cupos limitados.',
    content:
      'Abrimos las mesas del jardín para una cena íntima de temporada.\n\nMenú degustación de cinco tiempos, maridaje opcional y música en vivo suave. Reserva con anticipación desde el sitio o por WhatsApp.',
    category: 'eventos' as const,
    featured: false,
  },
];

const SHOP_SEED = [
  {
    category: {
      name: 'Pinturas',
      slug: 'pinturas',
      description: 'Obras inspiradas en el jardín y la luz del bosque.',
      orderIndex: 1,
    },
    products: [
      {
        name: 'Colibrí al atardecer',
        description: 'Acuarela sobre papel de algodón.',
        story:
          'Captura el instante en que el colibrí cruza el jardín bajo la luz dorada.',
        artistName: 'Colectivo Alma',
        technique: 'Acuarela',
        medium: 'Papel de algodón',
        dimensions: '40 × 50 cm',
        priceCents: 45000000,
        featured: true,
      },
      {
        name: 'Hojas de lluvia',
        description: 'Óleo con texturas vegetales.',
        artistName: 'Colectivo Alma',
        technique: 'Óleo',
        medium: 'Lienzo',
        dimensions: '60 × 80 cm',
        priceCents: 78000000,
        featured: false,
      },
    ],
  },
  {
    category: {
      name: 'Cerámica',
      slug: 'ceramica',
      description: 'Piezas utilitarias y decorativas del taller.',
      orderIndex: 2,
    },
    products: [
      {
        name: 'Cuenco de barro verde',
        description: 'Esmalte mate inspirado en el musgo del jardín.',
        artistName: 'Taller Alma',
        technique: 'Torneado',
        medium: 'Cerámica esmaltada',
        dimensions: 'Ø 18 cm',
        priceCents: 18000000,
        featured: true,
      },
    ],
  },
];

const MENU_SEED = [
  {
    category: {
      name: 'Entradas del jardín',
      slug: 'entradas',
      description: 'Pequeños tributos al huerto y al bosque.',
      orderIndex: 1,
    },
    items: [
      {
        name: 'Bruschetta albahaca y tomate',
        description: 'Pan de masa madre, tomates confitados y aceite de oliva.',
        ingredients: 'Pan, tomate, albahaca, aceite de oliva',
        priceCents: 1200000,
        featured: true,
      },
      {
        name: 'Carpaccio de remolacha',
        description: 'Remolacha, ricotta de cabra, nueces y microgreens.',
        ingredients: 'Remolacha, ricotta, nueces',
        priceCents: 1400000,
      },
    ],
  },
  {
    category: {
      name: 'Pizzas',
      slug: 'pizzas',
      description: 'Masa longamente fermentada, horno y fuego lento.',
      orderIndex: 2,
    },
    items: [
      {
        name: 'Margherita del huerto',
        description: 'Salsa de tomate, mozzarella fior di latte y albahaca fresca.',
        ingredients: 'Tomate, mozzarella, albahaca',
        priceCents: 2300000,
        featured: true,
      },
      {
        name: 'Colibrí verde',
        description: 'Pesto de albahaca, zucchini, burrata y limón.',
        ingredients: 'Pesto, zucchini, burrata, limón',
        priceCents: 2600000,
        featured: true,
      },
      {
        name: 'Prosciutto e rucola',
        description: 'Mozzarella, prosciutto crudo, rúcula y parmesano.',
        ingredients: 'Mozzarella, prosciutto, rúcula, parmesano',
        priceCents: 2800000,
      },
    ],
  },
  {
    category: {
      name: 'Pastas',
      slug: 'pastas',
      description: 'Pastas artesanales con salsas de estación.',
      orderIndex: 3,
    },
    items: [
      {
        name: 'Tagliatelle al pesto',
        description: 'Pasta fresca, pesto genovés y piñones tostados.',
        ingredients: 'Tagliatelle, albahaca, piñones, parmesano',
        priceCents: 2400000,
      },
      {
        name: 'Ravioli de ricotta y espinaca',
        description: 'Mantequilla de salvia y parmesano añejo.',
        ingredients: 'Ravioli, ricotta, espinaca, salvia',
        priceCents: 2700000,
        featured: true,
      },
    ],
  },
  {
    category: {
      name: 'Postres',
      slug: 'postres',
      description: 'Finales dulces inspirados en el jardín.',
      orderIndex: 4,
    },
    items: [
      {
        name: 'Tarta de limón y merengue',
        description: 'Corteza mantecosa, curd cítrico y merengue suizo.',
        ingredients: 'Limón, huevo, mantequilla',
        priceCents: 1100000,
      },
      {
        name: 'Panna cotta de lavanda',
        description: 'Crema delicada con coulis de frutos rojos.',
        ingredients: 'Crema, lavanda, frutos rojos',
        priceCents: 1000000,
      },
    ],
  },
];

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectModel(Admin.name) private readonly adminModel: Model<AdminDocument>,
    @InjectModel(Role.name) private readonly roleModel: Model<RoleDocument>,
    @InjectModel(RestaurantSettings.name)
    private readonly settingsModel: Model<RestaurantSettingsDocument>,
    @InjectModel(MenuCategory.name)
    private readonly categoryModel: Model<MenuCategoryDocument>,
    @InjectModel(MenuItem.name)
    private readonly itemModel: Model<MenuItemDocument>,
    @InjectModel(ShopCategory.name)
    private readonly shopCategoryModel: Model<ShopCategoryDocument>,
    @InjectModel(ShopProduct.name)
    private readonly shopProductModel: Model<ShopProductDocument>,
    @InjectModel(BlogPost.name)
    private readonly blogModel: Model<BlogPostDocument>,
    private readonly passwordService: PasswordService,
    private readonly config: ConfigService,
  ) {}

  async onModuleInit() {
    await this.seedRoles();
    await this.seedSuperAdmin();
    await this.seedRestaurantContent();
    await this.seedShopContent();
    await this.seedBlogContent();
  }

  private async seedRoles() {
    const editorExists = await this.roleModel.findOne({ name: 'Editor' });

    if (!editorExists) {
      await this.roleModel.create({
        name: 'Editor',
        description: 'Gestión de contenido del restaurante',
        color: '#4a7c59',
        permissions: EDITOR_PERMISSIONS,
        isActive: true,
      });
      this.logger.log('Default role "Editor" created');
    }
  }

  private async seedSuperAdmin() {
    const count = await this.adminModel.countDocuments();

    if (count > 0) {
      return;
    }

    const email = this.config.get<string>(
      'SEED_SUPER_ADMIN_EMAIL',
      'admin@almajardin.com',
    );
    const password = this.config.get<string>(
      'SEED_SUPER_ADMIN_PASSWORD',
      'Admin1234!',
    );

    await this.adminModel.create({
      firstName: 'Super',
      lastName: 'Admin',
      email: email.toLowerCase(),
      passwordHash: await this.passwordService.hash(password),
      status: 'active',
      isSuperAdmin: true,
      roleIds: [],
      directPermissions: [],
    });

    this.logger.log(`Super admin seeded (${email})`);
  }

  private async seedRestaurantContent() {
    const settingsCount = await this.settingsModel.countDocuments();

    if (settingsCount === 0) {
      await this.settingsModel.create({
        name: 'Alma Jardín',
        tagline: 'Restaurante · Jardín · Cocina de autor',
        heroTitle: 'Donde el jardín se encuentra con la alta cocina',
        heroSubtitle:
          'Un refugio verde donde la naturaleza, el fuego lento y el vuelo del colibrí inspiran cada plato.',
        aboutText:
          'Alma Jardín nace del encuentro entre la cocina gourmet y un jardín vivo. Trabajamos ingredientes de estación, hierbas del huerto y técnicas de fuego lento para crear una experiencia sensorial: aromas de tierra húmeda, luz filtrada entre las hojas y la gracia silenciosa del colibrí que nos visita al atardecer.',
        address: 'Camino del Bosque 123, Ciudad Jardín',
        phone: '+57 300 123 4567',
        whatsappPhone: '573001234567',
        whatsappMessage:
          'Hola Alma Jardín, me gustaría hacer una reserva.',
        email: 'hola@almajardin.com',
        staffNotificationEmail: 'hola@almajardin.com',
        instagramUrl: 'https://instagram.com/almajardin',
        openingHours: 'Mar–Dom · Almuerzo 12:00–16:00 · Cena 18:00–23:00',
      });
      this.logger.log('Restaurant settings seeded');
    }

    const categoryCount = await this.categoryModel.countDocuments();

    if (categoryCount > 0) {
      return;
    }

    for (const group of MENU_SEED) {
      const category = await this.categoryModel.create(group.category);

      for (const [itemIndex, item] of group.items.entries()) {
        await this.itemModel.create({
          categoryId: category._id,
          name: item.name,
          slug: slugify(item.name),
          description: item.description,
          ingredients: item.ingredients,
          priceCents: item.priceCents,
          featured: item.featured ?? false,
          orderIndex: itemIndex,
          status: 'active',
        });
      }

      this.logger.log(`Seeded category "${group.category.name}"`);
    }
  }

  private async seedShopContent() {
    const count = await this.shopCategoryModel.countDocuments();

    if (count > 0) {
      return;
    }

    for (const group of SHOP_SEED) {
      const category = await this.shopCategoryModel.create(group.category);

      for (const [index, product] of group.products.entries()) {
        await this.shopProductModel.create({
          categoryId: category._id,
          name: product.name,
          slug: slugify(product.name),
          description: product.description,
          story: product.story,
          artistName: product.artistName,
          technique: product.technique,
          medium: product.medium,
          dimensions: product.dimensions,
          priceCents: product.priceCents,
          imageUrls: [],
          featured: product.featured,
          orderIndex: index,
          status: 'active',
        });
      }

      this.logger.log(`Seeded shop category "${group.category.name}"`);
    }
  }

  private async seedBlogContent() {
    const count = await this.blogModel.countDocuments();

    if (count > 0) {
      return;
    }

    for (const post of BLOG_SEED) {
      await this.blogModel.create({
        title: post.title,
        slug: slugify(post.title),
        excerpt: post.excerpt,
        content: post.content,
        category: post.category,
        status: 'published',
        featured: post.featured,
        publishedAt: new Date(),
      });
    }

    this.logger.log(`Seeded ${BLOG_SEED.length} blog posts`);
  }
}
