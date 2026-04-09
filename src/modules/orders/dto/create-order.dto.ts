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

  @ApiPropertyOptional({ example: 'USD', description: 'The currency of the amount', default: 'USD' })
  @IsString()
  @IsOptional()
  currency?: string;

  @ApiPropertyOptional({ example: 'Credit Card', description: 'The payment method used' })
  @IsString()
  @IsOptional()
  paymentMethod?: string;

  @ApiPropertyOptional({ example: 'TXN-123456789', description: 'The payment gateway reference' })
  @IsString()
  @IsOptional()
  paymentRef?: string;
}
