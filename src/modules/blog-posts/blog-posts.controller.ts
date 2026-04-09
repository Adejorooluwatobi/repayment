import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BlogPostsService } from './blog-posts.service';
import { BlogPost } from './schemas/blog-post.schema';
import { CreateBlogPostDto } from './dto/create-blog-post.dto';
import { UpdateBlogPostDto } from './dto/update-blog-post.dto';

@ApiTags('Blog Posts')
@Controller('blog-posts')
export class BlogPostsController {
  constructor(private readonly blogPostsService: BlogPostsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new blog post' })
  @ApiResponse({ status: 201, description: 'Post created successfully', type: BlogPost })
  async create(@Body() createBlogPostDto: CreateBlogPostDto): Promise<BlogPost> {
    return this.blogPostsService.create(createBlogPostDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all blog posts' })
  @ApiResponse({ status: 200, description: 'Return all posts', type: [BlogPost] })
  async findAll(): Promise<BlogPost[]> {
    return this.blogPostsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a post by ID' })
  @ApiResponse({ status: 200, description: 'Return a single post', type: BlogPost })
  async findOne(@Param('id') id: string): Promise<BlogPost> {
    return this.blogPostsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a post' })
  @ApiResponse({ status: 200, description: 'Post updated successfully', type: BlogPost })
  async update(@Param('id') id: string, @Body() updateBlogPostDto: UpdateBlogPostDto): Promise<BlogPost> {
    return this.blogPostsService.update(id, updateBlogPostDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a post' })
  @ApiResponse({ status: 200, description: 'Post deleted successfully' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.blogPostsService.remove(id);
  }
}
