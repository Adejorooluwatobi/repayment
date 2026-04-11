import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ConsultationsService } from './consultations.service';
import { Consultation } from './schemas/consultation.schema';
import { CreateConsultationDto } from './dto/create-consultation.dto';
import { UpdateConsultationDto } from './dto/update-consultation.dto';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { AdminGuard } from 'src/modules/auth/guards/admin.guard';

@ApiTags('Consultations')
@ApiBearerAuth()
@Controller('consultations')
export class ConsultationsController {
  constructor(private readonly consultationsService: ConsultationsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new consultation' })
  @ApiResponse({ status: 201, description: 'Consultation created successfully', type: Consultation })
  async create(@Body() createConsultationDto: CreateConsultationDto): Promise<Consultation> {
    return this.consultationsService.create(createConsultationDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiOperation({ summary: 'Get all consultations' })
  @ApiResponse({ status: 200, description: 'Return all consultations', type: [Consultation] })
  async findAll(): Promise<Consultation[]> {
    return this.consultationsService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiOperation({ summary: 'Get a consultation by ID' })
  @ApiResponse({ status: 200, description: 'Return a single consultation', type: Consultation })
  async findOne(@Param('id') id: string): Promise<Consultation> {
    return this.consultationsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a consultation' })
  @ApiResponse({ status: 200, description: 'Consultation updated successfully', type: Consultation })
  async update(@Param('id') id: string, @Body() updateConsultationDto: UpdateConsultationDto): Promise<Consultation> {
    return this.consultationsService.update(id, updateConsultationDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a consultation' })
  @ApiResponse({ status: 200, description: 'Consultation deleted successfully' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.consultationsService.remove(id);
  }
}
