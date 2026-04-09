import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AdminLoginDto, UserLoginDto } from './dto/login.dto';
import { CreateAdminDto } from '../admin/dto/create-admin.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register-user')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  async registerUser(@Body() userData: CreateUserDto): Promise<void> {
    return this.authService.registerUser(userData);
  }

  @Post('login-user')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login a user' })
  @ApiResponse({ status: 200, description: 'User logged in successfully' })
  async loginUser(@Body() loginData: UserLoginDto): Promise<any> {
    return this.authService.loginUser(loginData);
  }

  @Post('register-admin')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new admin' })
  @ApiResponse({ status: 201, description: 'Admin registered successfully' })
  async registerAdmin(@Body() adminData: CreateAdminDto): Promise<void> {
    return this.authService.registerAdmin(adminData);
  }

  @Post('login-admin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login an admin' })
  @ApiResponse({ status: 200, description: 'Admin logged in successfully' })
  async loginAdmin(@Body() adminData: AdminLoginDto): Promise<any> {
    return this.authService.loginAdmin(adminData);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout a user or admin' })
  @ApiResponse({ status: 200, description: 'Logged out successfully' })
  async logout(): Promise<any> {
    return this.authService.logout();
  }
}