import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import type { PermissionCode } from '@alma-jardin/shared';
import { PasswordService } from '../common/password.service';
import { Admin, AdminDocument } from '../schemas/admin.schema';
import { Role, RoleDocument } from '../schemas/role.schema';

const EDITOR_PERMISSIONS: PermissionCode[] = [
  'menu_categories.read',
  'menu_categories.create',
  'menu_categories.update',
  'menu_items.read',
  'menu_items.create',
  'menu_items.update',
  'blog_posts.read',
  'blog_posts.create',
  'blog_posts.update',
  'reservations.read',
  'reservations.update',
  'contact_messages.read',
  'banners.read',
  'banners.create',
  'banners.update',
  'featured_sections.read',
  'featured_sections.create',
  'featured_sections.update',
  'settings.read',
  'settings.update',
];

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectModel(Admin.name) private readonly adminModel: Model<AdminDocument>,
    @InjectModel(Role.name) private readonly roleModel: Model<RoleDocument>,
    private readonly passwordService: PasswordService,
    private readonly config: ConfigService,
  ) {}

  async onModuleInit() {
    await this.seedRoles();
    await this.seedSuperAdmin();
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
}
