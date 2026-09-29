import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../users/user.service';
import { AdminService } from '../admin/admin.service';
import { AdminLoginDto, UserLoginDto } from './dto/login.dto';
import { NotificationsService } from '../notifications/notifications.service';

interface AuthResponse {
  access_token: string;
  user?: { id: string; isAdmin: boolean; isActive: boolean; name: string; role: string };
  admin?: { id: string; isAdmin: boolean; isActive: boolean; name: string; role: string; permissions: string[] };
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
    private notificationsService: NotificationsService,
  ) {
    this.jwtSecret = this.configService.get<string>('JWT_SECRET') || 'your_super_secret_jwt_key_change_in_production';
  }

  async registerUser(userData: any): Promise<void> {
    const user = await this.userService.create(userData);
    
    // Notify admins about new user registration
    await this.notificationsService.notifyAdmins({
      title: 'New User Registration',
      message: `A new user ${user.firstName} ${user.lastName} has registered.`,
      type: 'REGISTRATION',
      refId: user.id,
      refModel: 'User',
    });
  }

  async loginUser(userLog: UserLoginDto): Promise<AuthResponse> {
    const user = await this.userService.findByEmail(userLog.email as any);
    if (!user || !(await bcrypt.compare(userLog.password, user.passwordHash))) {
      throw new BadRequestException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    return {
      access_token: accessToken,
      user: { id: user.id, isAdmin: false, isActive: true, name: user.firstName, role: user.role },
    };
  }

  async registerAdmin(adminData: any): Promise<void> {
    await this.adminService.create(adminData);
  }

  async loginAdmin(adminLog: AdminLoginDto): Promise<AuthResponse> {
    const email = (adminLog.email || '').trim().toLowerCase();
    const password = (adminLog.password || '').trim();

    const admin = await this.adminService.findByEmail(email);
    if (!admin) {
      this.logger.warn(`Admin login attempt failed: no admin found matching ${email}`);
      throw new BadRequestException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      this.logger.warn(`Admin login attempt failed: incorrect password for ${email}`);
      throw new BadRequestException('Invalid credentials');
    }

    const payload = { sub: admin.id, email: admin.email, role: 'ADMIN', permissions: admin.permissions };
    const accessToken = this.jwtService.sign(payload);

    return {
      access_token: accessToken,
      admin: { 
        id: admin.id,
        isAdmin: true, 
        isActive: true, 
        name: admin.firstName || admin.username, 
        role: 'ADMIN', 
        permissions: admin.permissions 
      },
    };
  }

  async seedAdmin(): Promise<any> {
    return this.adminService.seedInitialAdmin();
  }

  async logout(): Promise<{ message: string }> {
    return { message: 'Logged out successfully' };
  }
}
