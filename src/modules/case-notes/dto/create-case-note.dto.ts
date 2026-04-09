import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCaseNoteDto {
  @ApiProperty({ example: '60d5ecb8b392d7001f8e8e1a', description: 'The related Case ID' })
  @IsString()
  @IsNotEmpty()
  caseId: string;

  @ApiProperty({ example: '60d5ecb8b392d7001f8e8e1b', description: 'The Admin ID who wrote the note' })
  @IsString()
  @IsNotEmpty()
  adminId: string;

  @ApiProperty({ example: 'Client called today...', description: 'The content of the note' })
  @IsString()
  @IsNotEmpty()
  content: string;
}
