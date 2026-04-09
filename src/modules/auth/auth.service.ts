import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../users/user.service';
import { AdminService } from '../admin/admin.service';
import { AdminLoginDto, UserLoginDto } from './dto/login.dto';

interface AuthResponse {
  access_token: string;
  user?: { isAdmin: boolean; isActive: boolean; name: string; role: string };
  admin?: { isAdmin: boolean; isActive: boolean; name: string; role: string; permissions: string[] };
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly jwtSecret: string;

  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
    private userService: UserService,
    private adminService: AdminService,
  ) {
    this.jwtSecret = this.configService.get<string>('JWT_SECRET') || 'your_super_secret_jwt_key_change_in_production';
  }

  async registerUser(userData: any): Promise<void> {
    await this.userService.create(userData);
  }

  async loginUser(userLog: UserLoginDto): Promise<AuthResponse> {
    const user = await this.userService.findByEmail(userLog.email as any);
    if (!user || !(await bcrypt.compare(userLog.password, user.passwordHash))) {
      throw new BadRequestException('Invalid credentials');
    }

    const payload = { sub: user._id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    return {
      access_token: accessToken,
      user: { isAdmin: false, isActive: true, name: user.firstName, role: user.role },
    };
  }

  async registerAdmin(adminData: any): Promise<void> {
    await this.adminService.create(adminData);
  }

  async loginAdmin(adminLog: AdminLoginDto): Promise<AuthResponse> {
    const admin = await this.adminService.findByEmail(adminLog.email as any);
    if (!admin || !(await bcrypt.compare(adminLog.password, admin.password))) {
      throw new BadRequestException('Invalid credentials');
    }

    const payload = { sub: admin._id, email: admin.email, role: 'ADMIN', permissions: admin.permissions };
    const accessToken = this.jwtService.sign(payload);

    return {
      access_token: accessToken,
      admin: { 
        isAdmin: true, 
        isActive: true, 
        name: admin.firstName || admin.username, 
        role: 'ADMIN', 
        permissions: admin.permissions 
      },
    };
  }

  async logout(): Promise<{ message: string }> {
    // In a stateless JWT implementation, the server doesn't need to do anything.
    // The client is responsible for deleting the token.
    // This method provides a hook for future features like token blacklisting.
    return { message: 'Logged out successfully' };
  }
}
