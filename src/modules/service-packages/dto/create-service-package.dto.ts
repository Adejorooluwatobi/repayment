import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsNumber, IsArray, IsBoolean } from 'class-validator';

export class CreateServicePackageDto {
  @ApiProperty({ example: 'Basic Package', description: 'The name of the service package' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'basic-package', description: 'The slug for the URL' })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({ example: 49.99, description: 'The price of the package' })
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiPropertyOptional({ example: 0.50, description: 'The price per transaction if applicable' })
  @IsNumber()
  @IsOptional()
  pricePerTx?: number;

  @ApiPropertyOptional({ example: ['Feature 1', 'Feature 2'], description: 'List of features included' })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  features?: string[];

  @ApiPropertyOptional({ example: true, description: 'Whether the package is active' })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
