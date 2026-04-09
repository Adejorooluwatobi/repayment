import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ServicePackage } from './schemas/service-package.schema';
import { CreateServicePackageDto } from './dto/create-service-package.dto';
import { UpdateServicePackageDto } from './dto/update-service-package.dto';

@Injectable()
export class ServicePackagesService {
  constructor(@InjectModel(ServicePackage.name) private packageModel: Model<ServicePackage>) {}

  async create(createServicePackageDto: CreateServicePackageDto | any): Promise<ServicePackage> {
    const newPackage = new this.packageModel(createServicePackageDto);
    return newPackage.save();
  }

  async findAll(): Promise<ServicePackage[]> {
    return this.packageModel.find().exec();
  }

  async findOne(id: string): Promise<ServicePackage> {
    const pkg = await this.packageModel.findById(id).exec();
    if (!pkg) throw new NotFoundException(`Service Package with ID ${id} not found`);
    return pkg;
  }

  async update(id: string, updateServicePackageDto: UpdateServicePackageDto): Promise<ServicePackage> {
    const updatedPkg = await this.packageModel
      .findByIdAndUpdate(id, updateServicePackageDto, { new: true })
      .exec();
    if (!updatedPkg) throw new NotFoundException(`Service Package with ID ${id} not found`);
    return updatedPkg;
  }

  async remove(id: string): Promise<void> {
    const result = await this.packageModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException(`Service Package with ID ${id} not found`);
  }
}
