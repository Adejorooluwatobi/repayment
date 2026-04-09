import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email, password } = createUserDto;

    const existing = await this.userModel.findOne({ email }).exec();
    if (existing) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new this.userModel({
      ...createUserDto,
      passwordHash: hashedPassword,
    });

    return newUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).select('+passwordHash').exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const dataToUpdate: any = { ...updateUserDto };

    if (dataToUpdate.password) {
      dataToUpdate.passwordHash = await bcrypt.hash(dataToUpdate.password, 12);
      delete dataToUpdate.password;
    }

    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, dataToUpdate, { new: true })
      .exec();
    if (!updatedUser) throw new NotFoundException(`User with ID ${id} not found`);
    return updatedUser;
  }

  async remove(id: string): Promise<void> {
    const result = await this.userModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException(`User with ID ${id} not found`);
  }
}
