import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { BlogPost } from './entities/blog-post.entity';
import { CreateBlogPostDto } from './dto/create-blog-post.dto';
import { UpdateBlogPostDto } from './dto/update-blog-post.dto';

@Injectable()
export class BlogPostsService {
  constructor(
    @InjectRepository(BlogPost)
    private readonly blogPostRepository: Repository<BlogPost>,
  ) {}

  async create(createBlogPostDto: CreateBlogPostDto): Promise<BlogPost> {
    const newPost = this.blogPostRepository.create(createBlogPostDto as DeepPartial<BlogPost>);
    return this.blogPostRepository.save(newPost);
  }

  async findAll(): Promise<BlogPost[]> {
    return this.blogPostRepository.find();
  }

  async findOne(id: string): Promise<BlogPost> {
    const post = await this.blogPostRepository.findOne({ where: { id } });
    if (!post) throw new NotFoundException(`Blog Post with ID ${id} not found`);
    return post;
  }

  async update(id: string, updateBlogPostDto: UpdateBlogPostDto): Promise<BlogPost> {
    const post = await this.findOne(id);
    Object.assign(post, updateBlogPostDto);
    return this.blogPostRepository.save(post);
  }

  async remove(id: string): Promise<void> {
    const result = await this.blogPostRepository.delete(id);
    if (!result.affected) throw new NotFoundException(`Blog Post with ID ${id} not found`);
  }
}
