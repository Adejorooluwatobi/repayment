import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsBoolean } from 'class-validator';

export class CreateNotificationDto {
  @ApiProperty({ example: '60d5ecb8b392d7001f8e8e1a', description: 'The User ID to send the notification to' })
  @IsString()
  @IsNotEmpty()
  userId: string;

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
  isRead?: boolean;
}
