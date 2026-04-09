import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsArray } from 'class-validator';

export class CreateBlogPostDto {
  @ApiPropertyOptional({ example: 'John Doe', description: 'The name of the author' })
  @IsString()
  @IsOptional()
  author?: string;

  @ApiProperty({ example: 'How to Avoid Scams', description: 'The title of the blog post' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'how-to-avoid-scams', description: 'The unique URL slug' })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({ example: 'Full article content here...', description: 'The body content of the post' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiPropertyOptional({ example: ['scams', 'finance'], description: 'Tags for the blog post' })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiPropertyOptional({ example: 'DRAFT', description: 'Publication status', default: 'DRAFT' })
  @IsString()
  @IsOptional()
  status?: string;
}
