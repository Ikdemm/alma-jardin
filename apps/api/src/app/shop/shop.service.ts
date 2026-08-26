import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import type {
  ShopCategoryAdmin,
  ShopCategoryPublic,
  ShopProductPublic,
} from '@alma-jardin/shared';
import { slugify } from '../common/slug.util';
import {
  ShopCategory,
  ShopCategoryDocument,
} from '../schemas/shop-category.schema';
import { ShopProduct, ShopProductDocument } from '../schemas/shop-product.schema';
import {
  CreateShopCategoryDto,
  CreateShopProductDto,
  UpdateShopCategoryDto,
  UpdateShopProductDto,
} from './dto/shop.dto';

@Injectable()
export class ShopService {
  constructor(
    @InjectModel(ShopCategory.name)
    private readonly categoryModel: Model<ShopCategoryDocument>,
    @InjectModel(ShopProduct.name)
    private readonly productModel: Model<ShopProductDocument>,
  ) {}

  async listPublicCategories(): Promise<ShopCategoryPublic[]> {
    const categories = await this.categoryModel
      .find({ isActive: true })
      .sort({ orderIndex: 1, name: 1 });
    return categories.map((category) => this.toCategoryPublic(category));
  }

  async listPublicProducts(categorySlug?: string): Promise<ShopProductPublic[]> {
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

    const products = await this.productModel
      .find(filter)
      .sort({ orderIndex: 1, name: 1 });
    return this.mapProducts(products);
  }

  async listFeaturedProducts(): Promise<ShopProductPublic[]> {
    const products = await this.productModel
      .find({ featured: true, status: { $in: ['active', 'sold_out'] } })
      .sort({ orderIndex: 1 })
      .limit(8);
    return this.mapProducts(products);
  }

  async getPublicBySlug(slug: string): Promise<ShopProductPublic> {
    const product = await this.productModel.findOne({
      slug,
      status: { $in: ['active', 'sold_out'] },
    });

    if (!product) {
      throw new NotFoundException('Obra no encontrada');
    }

    const category = await this.categoryModel.findById(product.categoryId);

    if (!category) {
      throw new NotFoundException('Categoría no encontrada');
    }

    return this.toProductPublic(product, category);
  }

  async listAdminCategories(): Promise<ShopCategoryAdmin[]> {
    const categories = await this.categoryModel.find().sort({ orderIndex: 1 });
    return categories.map((category) => this.toCategoryAdmin(category));
  }

  async getAdminCategory(id: string): Promise<ShopCategoryAdmin> {
    const category = await this.categoryModel.findById(id);

    if (!category) {
      throw new NotFoundException('Categoría no encontrada');
    }

    return this.toCategoryAdmin(category);
  }

  async listAdminProducts(categoryId?: string): Promise<ShopProductPublic[]> {
    const filter = categoryId
      ? { categoryId: new Types.ObjectId(categoryId) }
      : {};
    const products = await this.productModel.find(filter).sort({ orderIndex: 1 });
    return this.mapProducts(products);
  }

  async getAdminProduct(id: string): Promise<ShopProductPublic> {
    const product = await this.productModel.findById(id);

    if (!product) {
      throw new NotFoundException('Obra no encontrada');
    }

    const category = await this.categoryModel.findById(product.categoryId);

    if (!category) {
      throw new NotFoundException('Categoría no encontrada');
    }

    return this.toProductPublic(product, category);
  }

  async createCategory(dto: CreateShopCategoryDto): Promise<ShopCategoryAdmin> {
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

  async updateCategory(
    id: string,
    dto: UpdateShopCategoryDto,
  ): Promise<ShopCategoryAdmin> {
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

  async deleteCategory(id: string) {
    const category = await this.categoryModel.findById(id);

    if (!category) {
      throw new NotFoundException('Categoría no encontrada');
    }

    const productCount = await this.productModel.countDocuments({
      categoryId: category._id,
    });

    if (productCount > 0) {
      throw new BadRequestException(
        'No se puede eliminar una categoría con obras asociadas',
      );
    }

    await category.deleteOne();
    return { deleted: true };
  }

  async createProduct(dto: CreateShopProductDto): Promise<ShopProductPublic> {
    const category = await this.categoryModel.findById(dto.categoryId);

    if (!category) {
      throw new BadRequestException('Categoría no válida');
    }

    const slug = slugify(dto.slug ?? dto.name);
    const existing = await this.productModel.findOne({ slug });

    if (existing) {
      throw new ConflictException('Ya existe una obra con ese slug');
    }

    const product = await this.productModel.create({
      categoryId: category._id,
      name: dto.name.trim(),
      slug,
      description: dto.description?.trim(),
      story: dto.story?.trim(),
      artistName: dto.artistName?.trim(),
      technique: dto.technique?.trim(),
      medium: dto.medium?.trim(),
      dimensions: dto.dimensions?.trim(),
      priceCents: dto.priceCents,
      imageUrls: dto.imageUrls ?? [],
      status: dto.status ?? 'active',
      featured: dto.featured ?? false,
      orderIndex: dto.orderIndex ?? 0,
      whatsappInquiryMessage: dto.whatsappInquiryMessage?.trim(),
    });

    return this.toProductPublic(product, category);
  }

  async updateProduct(
    id: string,
    dto: UpdateShopProductDto,
  ): Promise<ShopProductPublic> {
    const product = await this.productModel.findById(id);

    if (!product) {
      throw new NotFoundException('Obra no encontrada');
    }

    let category = await this.categoryModel.findById(product.categoryId);

    if (dto.categoryId) {
      category = await this.categoryModel.findById(dto.categoryId);

      if (!category) {
        throw new BadRequestException('Categoría no válida');
      }

      product.categoryId = category._id;
    }

    if (dto.name) product.name = dto.name.trim();
    if (dto.slug) product.slug = slugify(dto.slug);
    if (dto.description !== undefined) product.description = dto.description.trim();
    if (dto.story !== undefined) product.story = dto.story.trim();
    if (dto.artistName !== undefined) product.artistName = dto.artistName.trim();
    if (dto.technique !== undefined) product.technique = dto.technique.trim();
    if (dto.medium !== undefined) product.medium = dto.medium.trim();
    if (dto.dimensions !== undefined) product.dimensions = dto.dimensions.trim();
    if (dto.priceCents !== undefined) product.priceCents = dto.priceCents;
    if (dto.imageUrls !== undefined) product.imageUrls = dto.imageUrls;
    if (dto.status !== undefined) product.status = dto.status;
    if (dto.featured !== undefined) product.featured = dto.featured;
    if (dto.orderIndex !== undefined) product.orderIndex = dto.orderIndex;
    if (dto.whatsappInquiryMessage !== undefined) {
      product.whatsappInquiryMessage = dto.whatsappInquiryMessage.trim();
    }

    await product.save();
    return this.toProductPublic(product, category!);
  }

  async deleteProduct(id: string) {
    const product = await this.productModel.findById(id);

    if (!product) {
      throw new NotFoundException('Obra no encontrada');
    }

    await product.deleteOne();
    return { deleted: true };
  }

  private async mapProducts(
    products: ShopProductDocument[],
  ): Promise<ShopProductPublic[]> {
    const categories = await this.categoryModel.find({
      _id: { $in: products.map((product) => product.categoryId) },
    });
    const categoryMap = new Map(
      categories.map((category) => [category._id.toString(), category]),
    );

    return products
      .map((product) => {
        const category = categoryMap.get(product.categoryId.toString());
        if (!category) return null;
        return this.toProductPublic(product, category);
      })
      .filter((product): product is ShopProductPublic => product !== null);
  }

  private toCategoryPublic(category: ShopCategoryDocument): ShopCategoryPublic {
    return {
      id: category._id.toString(),
      name: category.name,
      slug: category.slug,
      description: category.description,
      orderIndex: category.orderIndex,
    };
  }

  private toCategoryAdmin(category: ShopCategoryDocument): ShopCategoryAdmin {
    return {
      ...this.toCategoryPublic(category),
      isActive: category.isActive,
    };
  }

  private toProductPublic(
    product: ShopProductDocument,
    category: ShopCategoryDocument,
  ): ShopProductPublic {
    return {
      id: product._id.toString(),
      categoryId: product.categoryId.toString(),
      categorySlug: category.slug,
      name: product.name,
      slug: product.slug,
      description: product.description,
      story: product.story,
      artistName: product.artistName,
      technique: product.technique,
      medium: product.medium,
      dimensions: product.dimensions,
      priceCents: product.priceCents,
      imageUrls: product.imageUrls ?? [],
      status: product.status,
      featured: product.featured,
      orderIndex: product.orderIndex,
      whatsappInquiryMessage: product.whatsappInquiryMessage,
    };
  }
}
