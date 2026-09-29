import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsBoolean } from 'class-validator';

export class CreateNotificationDto {
  @ApiProperty({ example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', description: 'The User ID to send the notification to' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiPropertyOptional({ example: 'User', default: 'User' })
  @IsString()
  @IsOptional()
  onModel?: string;

  @ApiProperty({ example: 'Case Update', description: 'The subject/title of the notification' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Your case has been updated...', description: 'The body of the notification' })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiPropertyOptional({ example: 'SYSTEM', description: 'The type of notification', default: 'SYSTEM' })
  @IsString()
  @IsOptional()
  type?: string;

  @ApiPropertyOptional({ example: false, description: 'Whether the notification has been read', default: false })
  @IsBoolean()
  @IsOptional()
  read?: boolean;

  @ApiPropertyOptional({ example: false, description: 'Whether the notification has been read (alias)', default: false })
  @IsBoolean()
  @IsOptional()
  isRead?: boolean;

  @ApiPropertyOptional({ example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12' })
  @IsString()
  @IsOptional()
  refId?: string;

  @ApiPropertyOptional({ example: 'Case' })
  @IsString()
  @IsOptional()
  refModel?: string;
}
