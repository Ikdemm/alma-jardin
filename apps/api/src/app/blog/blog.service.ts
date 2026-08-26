import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import type { BlogCategory, BlogPostPublic } from '@alma-jardin/shared';
import { slugify } from '../common/slug.util';
import { BlogPost, BlogPostDocument } from '../schemas/blog-post.schema';
import { CreateBlogPostDto, UpdateBlogPostDto } from './dto/blog.dto';

@Injectable()
export class BlogService {
  constructor(
    @InjectModel(BlogPost.name)
    private readonly blogModel: Model<BlogPostDocument>,
  ) {}

  listPublic(category?: BlogCategory): Promise<BlogPostPublic[]> {
    const filter: Record<string, unknown> = { status: 'published' };
    if (category) {
      filter.category = category;
    }

    return this.blogModel
      .find(filter)
      .sort({ publishedAt: -1, createdAt: -1 })
      .then((posts) => posts.map((post) => this.toPublic(post)));
  }

  listFeatured(): Promise<BlogPostPublic[]> {
    return this.blogModel
      .find({ status: 'published', featured: true })
      .sort({ publishedAt: -1 })
      .limit(6)
      .then((posts) => posts.map((post) => this.toPublic(post)));
  }

  async getPublicBySlug(slug: string): Promise<BlogPostPublic> {
    const post = await this.blogModel.findOne({ slug, status: 'published' });

    if (!post) {
      throw new NotFoundException('Artículo no encontrado');
    }

    return this.toPublic(post);
  }

  listAdmin(): Promise<BlogPostPublic[]> {
    return this.blogModel
      .find()
      .sort({ updatedAt: -1 })
      .then((posts) => posts.map((post) => this.toPublic(post)));
  }

  async getAdmin(id: string): Promise<BlogPostPublic> {
    const post = await this.blogModel.findById(id);

    if (!post) {
      throw new NotFoundException('Artículo no encontrado');
    }

    return this.toPublic(post);
  }

  async create(dto: CreateBlogPostDto): Promise<BlogPostPublic> {
    const slug = slugify(dto.slug ?? dto.title);
    const existing = await this.blogModel.findOne({ slug });

    if (existing) {
      throw new ConflictException('Ya existe un artículo con ese slug');
    }

    const status = dto.status ?? 'draft';
    const post = await this.blogModel.create({
      title: dto.title.trim(),
      slug,
      excerpt: dto.excerpt.trim(),
      content: dto.content.trim(),
      category: dto.category,
      coverImageUrl: dto.coverImageUrl,
      status,
      featured: dto.featured ?? false,
      publishedAt: status === 'published' ? new Date() : undefined,
    });

    return this.toPublic(post);
  }

  async update(id: string, dto: UpdateBlogPostDto): Promise<BlogPostPublic> {
    const post = await this.blogModel.findById(id);

    if (!post) {
      throw new NotFoundException('Artículo no encontrado');
    }

    if (dto.title) post.title = dto.title.trim();
    if (dto.slug) post.slug = slugify(dto.slug);
    if (dto.excerpt) post.excerpt = dto.excerpt.trim();
    if (dto.content) post.content = dto.content.trim();
    if (dto.category) post.category = dto.category;
    if (dto.coverImageUrl !== undefined) post.coverImageUrl = dto.coverImageUrl;
    if (dto.featured !== undefined) post.featured = dto.featured;

    if (dto.status) {
      if (dto.status === 'published' && post.status !== 'published') {
        post.publishedAt = new Date();
      }
      post.status = dto.status;
    }

    await post.save();
    return this.toPublic(post);
  }

  async delete(id: string) {
    const post = await this.blogModel.findById(id);

    if (!post) {
      throw new NotFoundException('Artículo no encontrado');
    }

    await post.deleteOne();
    return { deleted: true };
  }

  private toPublic(post: BlogPostDocument): BlogPostPublic {
    return {
      id: post._id.toString(),
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      coverImageUrl: post.coverImageUrl,
      status: post.status,
      featured: post.featured,
      publishedAt: post.publishedAt?.toISOString(),
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
    };
  }
}
