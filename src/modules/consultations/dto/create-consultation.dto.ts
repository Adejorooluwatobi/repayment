import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsEmail, IsNumber } from 'class-validator';

export class CreateConsultationDto {
  @ApiPropertyOptional({ example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', description: 'The User ID of the client, if registered' })
  @IsString()
  @IsOptional()
  clientId?: string;

  @ApiPropertyOptional({ description: 'The related Case type' })
  @IsString()
  @IsOptional()
  caseType?: string;

  @ApiPropertyOptional({ example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', description: 'The Admin ID assigned to this consultation' })
  @IsString()
  @IsOptional()
  handledBy?: string;

  @ApiProperty({ example: 'Jane', description: 'The first name of the client' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Smith', description: 'The last name of the client' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: 'jane.smith@example.com', description: 'The email address' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiPropertyOptional({ example: '+1987654321', description: 'The phone number' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ example: 'Romance Scam', description: 'The type of scam involved' })
  @IsString()
  @IsOptional()
  scamType?: string;

  @ApiPropertyOptional({ example: 5000, description: 'The approximate amount lost' })
  @IsNumber()
  @IsOptional()
  amountLost?: number;

  @ApiPropertyOptional({ example: 'I need help recovering my funds...', description: 'A message from the client' })
  @IsString()
  @IsOptional()
  message?: string;

  @ApiPropertyOptional({ example: 'PENDING', description: 'The status of the consultation', default: 'PENDING' })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiPropertyOptional({ example: 'Client was contacted on Monday.', description: 'Internal admin notes' })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional({ example: '2026-11-20T10:00:00.000Z', description: 'The scheduled time for the consultation' })
  @IsOptional()
  scheduledAt?: Date;
}
