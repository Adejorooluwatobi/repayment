import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsArray, IsEmail, MinLength } from 'class-validator';

export class CreateAdminDto {
  @ApiProperty({ example: 'admin@example.com', description: 'The email address of the admin' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'admin_user', description: 'The unique username of the admin' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'SecurePassword123!', description: 'The plain text password' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @ApiPropertyOptional({ example: 'John', description: 'The first name' })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiPropertyOptional({ example: 'Doe', description: 'The last name' })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiPropertyOptional({ example: 'Support', description: 'The department the admin belongs to' })
  @IsString()
  @IsOptional()
  department?: string;

  @ApiPropertyOptional({ example: ['read:cases', 'write:cases'], description: 'List of permissions' })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  permissions?: string[];
}
