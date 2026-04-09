import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BlogPost } from './schemas/blog-post.schema';
import { CreateBlogPostDto } from './dto/create-blog-post.dto';
import { UpdateBlogPostDto } from './dto/update-blog-post.dto';

@Injectable()
export class BlogPostsService {
  constructor(@InjectModel(BlogPost.name) private postModel: Model<BlogPost>) {}

  async create(createBlogPostDto: CreateBlogPostDto | any): Promise<BlogPost> {
    const newPost = new this.postModel(createBlogPostDto);
    return newPost.save();
  }

  async findAll(): Promise<BlogPost[]> {
    return this.postModel.find().exec();
  }

  async findOne(id: string): Promise<BlogPost> {
    const post = await this.postModel.findById(id).exec();
    if (!post) throw new NotFoundException(`Blog Post with ID ${id} not found`);
    return post;
  }

  async update(id: string, updateBlogPostDto: UpdateBlogPostDto | any): Promise<BlogPost> {
    const updatedPost = await this.postModel
      .findByIdAndUpdate(id, updateBlogPostDto, { new: true })
      .exec();
    if (!updatedPost) throw new NotFoundException(`Blog Post with ID ${id} not found`);
    return updatedPost;
  }

  async remove(id: string): Promise<void> {
    const result = await this.postModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException(`Blog Post with ID ${id} not found`);
  }
}
