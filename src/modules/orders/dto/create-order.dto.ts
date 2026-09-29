import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateOrderDto {
  @ApiPropertyOptional({ example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', description: 'The User ID of the client' })
  @IsString()
  @IsOptional()
  clientId?: string;

  @ApiPropertyOptional({ example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', description: 'The related Case ID' })
  @IsString()
  @IsOptional()
  caseId?: string;

  @ApiPropertyOptional({ example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', description: 'The purchased Service Package ID' })
  @IsString()
  @IsOptional()
  packageId?: string;

  @ApiPropertyOptional({ example: 'PENDING', description: 'The status of the order' })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiPropertyOptional({ example: 'user@example.com' })
  @IsString()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ example: '+1234567890' })
  @IsString()
  @IsOptional()
  phone?: string;
}
