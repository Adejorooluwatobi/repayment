import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { Admin } from './schemas/admin.schema';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new admin' })
  @ApiResponse({ status: 201, description: 'Admin created successfully', type: Admin })
  async create(@Body() createAdminDto: CreateAdminDto): Promise<Admin> {
    return this.adminService.create(createAdminDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all admins' })
  @ApiResponse({ status: 200, description: 'Return all admins', type: [Admin] })
  async findAll(): Promise<Admin[]> {
    return this.adminService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an admin by ID' })
  @ApiResponse({ status: 200, description: 'Return a single admin', type: Admin })
  async findOne(@Param('id') id: string): Promise<Admin> {
    return this.adminService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an admin' })
  @ApiResponse({ status: 200, description: 'Admin updated successfully', type: Admin })
  async update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto): Promise<Admin> {
    return this.adminService.update(id, updateAdminDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an admin' })
  @ApiResponse({ status: 200, description: 'Admin deleted successfully' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.adminService.remove(id);
  }
}
