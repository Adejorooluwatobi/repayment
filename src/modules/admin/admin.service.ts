import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Admin } from './schemas/admin.schema';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';

@Injectable()
export class AdminService {
  constructor(@InjectModel(Admin.name) private adminModel: Model<Admin>) {}

  async create(createAdminDto: CreateAdminDto): Promise<Admin> {
    const { email, username, password } = createAdminDto;

    // Check for duplicates
    const existing = await this.adminModel.findOne({
      $or: [{ email }, { username }]
    }).exec();

    if (existing) {
      throw new ConflictException('Admin with this email or username already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newAdmin = new this.adminModel({
      ...createAdminDto,
      password: hashedPassword,
    });

    return newAdmin.save();
  }

  async findAll(): Promise<Admin[]> {
    return this.adminModel.find().exec();
  }

  async findOne(id: string): Promise<Admin> {
    const admin = await this.adminModel.findById(id).exec();
    if (!admin) throw new NotFoundException(`Admin with ID ${id} not found`);
    return admin;
  }

  async findByEmail(email: string): Promise<Admin | null> {
    return this.adminModel.findOne({ email }).select('+password').exec();
  }

  async update(id: string, updateAdminDto: UpdateAdminDto): Promise<Admin> {
    const dataToUpdate = { ...updateAdminDto };

    if (dataToUpdate.password) {
      dataToUpdate.password = await bcrypt.hash(dataToUpdate.password, 12);
    }

    const updatedAdmin = await this.adminModel
      .findByIdAndUpdate(id, dataToUpdate, { new: true })
      .exec();
    if (!updatedAdmin) throw new NotFoundException(`Admin with ID ${id} not found`);
    return updatedAdmin;
  }

  async remove(id: string): Promise<void> {
    const result = await this.adminModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException(`Admin with ID ${id} not found`);
  }
}
