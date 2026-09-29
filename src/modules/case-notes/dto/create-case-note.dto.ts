import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCaseNoteDto {
  @ApiProperty({ example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', description: 'The related Case ID' })
  @IsString()
  @IsNotEmpty()
  caseId: string;

  @ApiProperty({ example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', description: 'The Admin ID who wrote the note' })
  @IsString()
  @IsNotEmpty()
  adminId: string;

  @ApiProperty({ example: 'Client called today...', description: 'The content of the note' })
  @IsString()
  @IsNotEmpty()
  content: string;
}
