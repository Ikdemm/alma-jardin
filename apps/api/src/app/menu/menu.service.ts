import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import type { MenuCategoryAdmin, MenuCategoryPublic, MenuItemPublic } from '@alma-jardin/shared';
import { slugify } from '../common/slug.util';
import {
  MenuCategory,
  MenuCategoryDocument,
} from '../schemas/menu-category.schema';
import { MenuItem, MenuItemDocument } from '../schemas/menu-item.schema';
import {
  CreateMenuCategoryDto,
  CreateMenuItemDto,
  UpdateMenuCategoryDto,
  UpdateMenuItemDto,
} from './dto/menu.dto';

@Injectable()
export class MenuService {
  constructor(
    @InjectModel(MenuCategory.name)
    private readonly categoryModel: Model<MenuCategoryDocument>,
    @InjectModel(MenuItem.name)
    private readonly itemModel: Model<MenuItemDocument>,
  ) {}

  async listPublicCategories(): Promise<MenuCategoryPublic[]> {
    const categories = await this.categoryModel
      .find({ isActive: true })
      .sort({ orderIndex: 1, name: 1 });

    return categories.map((category) => this.toCategoryPublic(category));
  }

  async listPublicItems(categorySlug?: string): Promise<MenuItemPublic[]> {
    const filter: Record<string, unknown> = {
      status: { $in: ['active', 'sold_out'] },
    };

    if (categorySlug) {
      const category = await this.categoryModel.findOne({
        slug: categorySlug,
        isActive: true,
      });

      if (!category) {
        throw new NotFoundException('Categoría no encontrada');
      }

      filter.categoryId = category._id;
    }

    const items = await this.itemModel.find(filter).sort({ orderIndex: 1, name: 1 });
    const categories = await this.categoryModel.find({
      _id: { $in: items.map((item) => item.categoryId) },
    });
    const categoryMap = new Map(
      categories.map((category) => [category._id.toString(), category]),
    );

    return items
      .map((item) => {
        const category = categoryMap.get(item.categoryId.toString());
        if (!category) return null;
        return this.toItemPublic(item, category);
      })
      .filter((item): item is MenuItemPublic => item !== null);
  }

  async listFeaturedItems(): Promise<MenuItemPublic[]> {
    const items = await this.itemModel
      .find({ featured: true, status: { $in: ['active', 'sold_out'] } })
      .sort({ orderIndex: 1 })
      .limit(8);

    const categories = await this.categoryModel.find({
      _id: { $in: items.map((item) => item.categoryId) },
    });
    const categoryMap = new Map(
      categories.map((category) => [category._id.toString(), category]),
    );

    return items
      .map((item) => {
        const category = categoryMap.get(item.categoryId.toString());
        if (!category) return null;
        return this.toItemPublic(item, category);
      })
      .filter((item): item is MenuItemPublic => item !== null);
  }

  async listAdminCategories(): Promise<MenuCategoryAdmin[]> {
    const categories = await this.categoryModel.find().sort({ orderIndex: 1 });
    return categories.map((category) => this.toCategoryAdmin(category));
  }

  async getAdminCategory(id: string): Promise<MenuCategoryAdmin> {
    const category = await this.categoryModel.findById(id);

    if (!category) {
      throw new NotFoundException('Categoría no encontrada');
    }

    return this.toCategoryAdmin(category);
  }

  async getAdminItem(id: string): Promise<MenuItemPublic> {
    const item = await this.itemModel.findById(id);

    if (!item) {
      throw new NotFoundException('Plato no encontrado');
    }

    const category = await this.categoryModel.findById(item.categoryId);

    if (!category) {
      throw new NotFoundException('Categoría no encontrada');
    }

    return this.toItemPublic(item, category);
  }

  async listAdminItems(categoryId?: string) {
    const filter = categoryId ? { categoryId: new Types.ObjectId(categoryId) } : {};
    const items = await this.itemModel.find(filter).sort({ orderIndex: 1 });
    const categories = await this.categoryModel.find({
      _id: { $in: items.map((item) => item.categoryId) },
    });
    const categoryMap = new Map(
      categories.map((category) => [category._id.toString(), category]),
    );

    return items.map((item) => {
      const category = categoryMap.get(item.categoryId.toString());
      return this.toItemPublic(item, category!);
    });
  }

  async createCategory(dto: CreateMenuCategoryDto) {
    const slug = slugify(dto.slug ?? dto.name);
    const existing = await this.categoryModel.findOne({ slug });

    if (existing) {
      throw new ConflictException('Ya existe una categoría con ese slug');
    }

    const category = await this.categoryModel.create({
      name: dto.name.trim(),
      slug,
      description: dto.description?.trim(),
      orderIndex: dto.orderIndex ?? 0,
      isActive: dto.isActive ?? true,
    });

    return this.toCategoryAdmin(category);
  }

  async updateCategory(id: string, dto: UpdateMenuCategoryDto) {
    const category = await this.categoryModel.findById(id);

    if (!category) {
      throw new NotFoundException('Categoría no encontrada');
    }

    if (dto.name) category.name = dto.name.trim();
    if (dto.slug) category.slug = slugify(dto.slug);
    if (dto.description !== undefined) category.description = dto.description.trim();
    if (dto.orderIndex !== undefined) category.orderIndex = dto.orderIndex;
    if (dto.isActive !== undefined) category.isActive = dto.isActive;

    await category.save();
    return this.toCategoryAdmin(category);
  }

  async createItem(dto: CreateMenuItemDto) {
    const category = await this.categoryModel.findById(dto.categoryId);

    if (!category) {
      throw new BadRequestException('Categoría no válida');
    }

    const slug = slugify(dto.slug ?? dto.name);
    const existing = await this.itemModel.findOne({ slug });

    if (existing) {
      throw new ConflictException('Ya existe un plato con ese slug');
    }

    const item = await this.itemModel.create({
      categoryId: category._id,
      name: dto.name.trim(),
      slug,
      description: dto.description?.trim(),
      ingredients: dto.ingredients?.trim(),
      priceCents: dto.priceCents,
      imageUrl: dto.imageUrl,
      status: dto.status ?? 'active',
      featured: dto.featured ?? false,
      orderIndex: dto.orderIndex ?? 0,
    });

    return this.toItemPublic(item, category);
  }

  async updateItem(id: string, dto: UpdateMenuItemDto) {
    const item = await this.itemModel.findById(id);

    if (!item) {
      throw new NotFoundException('Plato no encontrado');
    }

    let category = await this.categoryModel.findById(item.categoryId);

    if (dto.categoryId) {
      category = await this.categoryModel.findById(dto.categoryId);

      if (!category) {
        throw new BadRequestException('Categoría no válida');
      }

      item.categoryId = category._id;
    }

    if (dto.name) item.name = dto.name.trim();
    if (dto.slug) item.slug = slugify(dto.slug);
    if (dto.description !== undefined) item.description = dto.description.trim();
    if (dto.ingredients !== undefined) item.ingredients = dto.ingredients.trim();
    if (dto.priceCents !== undefined) item.priceCents = dto.priceCents;
    if (dto.imageUrl !== undefined) item.imageUrl = dto.imageUrl;
    if (dto.status !== undefined) item.status = dto.status;
    if (dto.featured !== undefined) item.featured = dto.featured;
    if (dto.orderIndex !== undefined) item.orderIndex = dto.orderIndex;

    await item.save();
    return this.toItemPublic(item, category!);
  }

  async deleteCategory(id: string) {
    const category = await this.categoryModel.findById(id);

    if (!category) {
      throw new NotFoundException('Categoría no encontrada');
    }

    const itemCount = await this.itemModel.countDocuments({ categoryId: category._id });

    if (itemCount > 0) {
      throw new BadRequestException(
        'No se puede eliminar una categoría con platos asociados',
      );
    }

    await category.deleteOne();
    return { deleted: true };
  }

  async deleteItem(id: string) {
    const item = await this.itemModel.findById(id);

    if (!item) {
      throw new NotFoundException('Plato no encontrado');
    }

    await item.deleteOne();
    return { deleted: true };
  }

  private toCategoryAdmin(category: MenuCategoryDocument): MenuCategoryAdmin {
    return {
      ...this.toCategoryPublic(category),
      isActive: category.isActive,
    };
  }

  private toCategoryPublic(category: MenuCategoryDocument): MenuCategoryPublic {
    return {
      id: category._id.toString(),
      name: category.name,
      slug: category.slug,
      description: category.description,
      orderIndex: category.orderIndex,
    };
  }

  private toItemPublic(
    item: MenuItemDocument,
    category: MenuCategoryDocument,
  ): MenuItemPublic {
    return {
      id: item._id.toString(),
      categoryId: item.categoryId.toString(),
      categorySlug: category.slug,
      name: item.name,
      slug: item.slug,
      description: item.description,
      ingredients: item.ingredients,
      priceCents: item.priceCents,
      imageUrl: item.imageUrl,
      status: item.status,
      featured: item.featured,
      orderIndex: item.orderIndex,
    };
  }
}
