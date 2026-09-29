import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { ServicePackage } from './entities/service-package.entity';
import { CreateServicePackageDto } from './dto/create-service-package.dto';
import { UpdateServicePackageDto } from './dto/update-service-package.dto';

@Injectable()
export class ServicePackagesService {
  constructor(
    @InjectRepository(ServicePackage)
    private readonly packageRepository: Repository<ServicePackage>,
  ) {}

  async create(createServicePackageDto: CreateServicePackageDto): Promise<ServicePackage> {
    const newPackage = this.packageRepository.create(createServicePackageDto as DeepPartial<ServicePackage>);
    return this.packageRepository.save(newPackage);
  }

  async findAll(): Promise<ServicePackage[]> {
    return this.packageRepository.find();
  }

  async findOne(id: string): Promise<ServicePackage> {
    const pkg = await this.packageRepository.findOne({ where: { id } });
    if (!pkg) throw new NotFoundException(`Service Package with ID ${id} not found`);
    return pkg;
  }

  async update(id: string, updateServicePackageDto: UpdateServicePackageDto): Promise<ServicePackage> {
    const pkg = await this.findOne(id);
    Object.assign(pkg, updateServicePackageDto);
    return this.packageRepository.save(pkg);
  }

  async remove(id: string): Promise<void> {
    const result = await this.packageRepository.delete(id);
    if (!result.affected) throw new NotFoundException(`Service Package with ID ${id} not found`);
  }
}
