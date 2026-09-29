import { Injectable, NotFoundException, ConflictException, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Admin } from './entities/admin.entity';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';

@Injectable()
export class AdminService implements OnApplicationBootstrap {
  private readonly logger = new Logger(AdminService.name);

  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
    private readonly configService: ConfigService,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    await this.seedInitialAdmin();
  }

  async seedInitialAdmin(): Promise<void> {
    const adminEmail = this.configService.get<string>('ADMIN_EMAIL');
    const adminPassword = this.configService.get<string>('ADMIN_PASSWORD');

    if (!adminEmail || !adminPassword) {
      this.logger.log('ADMIN_EMAIL or ADMIN_PASSWORD not set in environment. Skipping initial admin seed.');
      return;
    }

    try {
      const existingAdmin = await this.adminRepository.findOne({
        where: { email: adminEmail },
      });

      if (existingAdmin) {
        this.logger.log(`Initial admin already exists with email: ${adminEmail}`);
        return;
      }

      const username = this.configService.get<string>('ADMIN_USERNAME') || adminEmail.split('@')[0];
      const firstName = this.configService.get<string>('ADMIN_FIRST_NAME') || 'Super';
      const lastName = this.configService.get<string>('ADMIN_LAST_NAME') || 'Admin';
      const department = this.configService.get<string>('ADMIN_DEPARTMENT') || 'Executive';

      const hashedPassword = await bcrypt.hash(adminPassword, 12);

      const initialAdmin = this.adminRepository.create({
        email: adminEmail,
        username,
        password: hashedPassword,
        firstName,
        lastName,
        department,
        permissions: ['ALL', 'SUPER_ADMIN', 'MANAGE_ADMINS', 'MANAGE_USERS', 'MANAGE_CASES'],
      });

      await this.adminRepository.save(initialAdmin);
      this.logger.log(`🚀 Default initial admin created successfully with email: ${adminEmail}`);
    } catch (error) {
      this.logger.error('Failed to seed initial admin:', error);
    }
  }

  async create(createAdminDto: CreateAdminDto): Promise<Admin> {
    const { email, username, password } = createAdminDto;

    // Check for duplicates
    const existing = await this.adminRepository.findOne({
      where: [{ email }, { username }],
    });

    if (existing) {
      throw new ConflictException('Admin with this email or username already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newAdmin = this.adminRepository.create({
      ...createAdminDto,
      password: hashedPassword,
    });

    return this.adminRepository.save(newAdmin);
  }

  async findAll(): Promise<Admin[]> {
    return this.adminRepository.find();
  }

  async findOne(id: string): Promise<Admin> {
    const admin = await this.adminRepository.findOne({ where: { id } });
    if (!admin) throw new NotFoundException(`Admin with ID ${id} not found`);
    return admin;
  }

  async findByEmail(email: string): Promise<Admin | null> {
    return this.adminRepository
      .createQueryBuilder('admin')
      .addSelect('admin.password')
      .where('admin.email = :email', { email })
      .getOne();
  }

  async update(id: string, updateAdminDto: UpdateAdminDto): Promise<Admin> {
    const admin = await this.findOne(id);
    const dataToUpdate = { ...updateAdminDto };

    if (dataToUpdate.password) {
      dataToUpdate.password = await bcrypt.hash(dataToUpdate.password, 12);
    }

    Object.assign(admin, dataToUpdate);
    return this.adminRepository.save(admin);
  }

  async remove(id: string): Promise<void> {
    const result = await this.adminRepository.delete(id);
    if (!result.affected) throw new NotFoundException(`Admin with ID ${id} not found`);
  }
}
