import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsNumber, IsArray } from 'class-validator';

export class CreateCaseDto {
  @ApiProperty({ example: '60d5ecb8b392d7001f8e8e1a', description: 'The User ID of the client' })
  @IsString()
  @IsNotEmpty()
  clientId: string;

  @ApiPropertyOptional({ example: '60d5ecb8b392d7001f8e8e1b', description: 'The Admin ID assigned to this case' })
  @IsString()
  @IsOptional()
  assignedAdminId?: string;

  @ApiProperty({ example: 'CASE-12345', description: 'The case number' })
  @IsString()
  @IsNotEmpty()
  caseNumber: string;

  @ApiProperty({ example: 'Phishing', description: 'The type of scam' })
  @IsString()
  @IsNotEmpty()
  scamType: string;

  @ApiPropertyOptional({ example: 'PENDING', description: 'The status of the case', default: 'PENDING' })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiProperty({ example: 1500, description: 'The amount lost' })
  @IsNumber()
  @IsNotEmpty()
  amountLost: number;

  @ApiPropertyOptional({ example: 'USD', description: 'The currency of the amount lost', default: 'USD' })
  @IsString()
  @IsOptional()
  currency?: string;

  @ApiProperty({ example: 'Description of the incident...', description: 'Detailed description of the case' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({ example: ['url1', 'url2'], description: 'List of evidence URLs' })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  evidence?: string[];

  @ApiPropertyOptional({ description: 'The action plan for the case' })
  @IsOptional()
  actionPlan?: any;
}
