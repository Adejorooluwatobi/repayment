import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsNumber, Min, Max, IsBoolean } from 'class-validator';

export class CreateTestimonialDto {
  @ApiPropertyOptional({ example: '60d5ecb8b392d7001f8e8e1a', description: 'The User ID of the client providing the testimonial' })
  @IsString()
  @IsOptional()
  clientId?: string;

  @ApiProperty({ example: 'Anonymous', description: 'The name of the author' })
  @IsString()
  @IsNotEmpty()
  authorName: string;

  @ApiPropertyOptional({ example: 'USA', description: 'The country of the author' })
  @IsString()
  @IsOptional()
  country?: string;

  @ApiPropertyOptional({ example: 'Phishing', description: 'The type of scam they recovered from' })
  @IsString()
  @IsOptional()
  scamType?: string;

  @ApiPropertyOptional({ example: 5, description: 'Rating out of 5', minimum: 1, maximum: 5 })
  @IsNumber()
  @Min(1)
  @Max(5)
  @IsOptional()
  rating?: number;

  @ApiProperty({ example: 'They helped me recover everything!', description: 'The testimonial content' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiPropertyOptional({ example: 'https://youtube.com/...', description: 'A link to a video testimonial' })
  @IsString()
  @IsOptional()
  videoUrl?: string;

  @ApiPropertyOptional({ example: false, description: 'Whether the testimonial is approved for display', default: false })
  @IsBoolean()
  @IsOptional()
  approved?: boolean;
}
