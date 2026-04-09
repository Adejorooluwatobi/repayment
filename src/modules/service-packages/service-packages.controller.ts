import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ServicePackagesService } from './service-packages.service';
import { ServicePackage } from './schemas/service-package.schema';
import { CreateServicePackageDto } from './dto/create-service-package.dto';
import { UpdateServicePackageDto } from './dto/update-service-package.dto';

@ApiTags('Service Packages')
@Controller('service-packages')
export class ServicePackagesController {
  constructor(private readonly servicePackagesService: ServicePackagesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new service package' })
  @ApiResponse({ status: 201, description: 'Package created successfully', type: ServicePackage })
  async create(@Body() createServicePackageDto: CreateServicePackageDto): Promise<ServicePackage> {
    return this.servicePackagesService.create(createServicePackageDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all service packages' })
  @ApiResponse({ status: 200, description: 'Return all packages', type: [ServicePackage] })
  async findAll(): Promise<ServicePackage[]> {
    return this.servicePackagesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a package by ID' })
  @ApiResponse({ status: 200, description: 'Return a single package', type: ServicePackage })
  async findOne(@Param('id') id: string): Promise<ServicePackage> {
    return this.servicePackagesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a package' })
  @ApiResponse({ status: 200, description: 'Package updated successfully', type: ServicePackage })
  async update(@Param('id') id: string, @Body() updateServicePackageDto: UpdateServicePackageDto): Promise<ServicePackage> {
    return this.servicePackagesService.update(id, updateServicePackageDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a package' })
  @ApiResponse({ status: 200, description: 'Package deleted successfully' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.servicePackagesService.remove(id);
  }
}
