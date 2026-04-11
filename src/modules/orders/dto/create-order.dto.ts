import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';
import { ServicePackage } from 'src/modules/service-packages/schemas/service-package.schema';

export class CreateOrderDto {
  @ApiProperty({ example: '60d5ecb8b392d7001f8e8e1a', description: 'The User ID of the client' })
  @IsString()
  @IsNotEmpty()
  clientId: string;

  @ApiProperty({ example: '60d5ecb8b392d7001f8e8e1b', description: 'The related Case ID' })
  @IsString()
  @IsNotEmpty()
  caseId: string;

  @ApiProperty({ example: '60d5ecb8b392d7001f8e8e1c', description: 'The purchased Service Package ID' })
  @IsString()
  @IsNotEmpty()
  packageId: ServicePackage;

  @ApiProperty({ example: 'user@example.com' })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '+1234567890' })
  @IsString()
  @IsNotEmpty()
  phone: string;
}
