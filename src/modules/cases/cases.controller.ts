import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CasesService } from './cases.service';
import { Case } from './schemas/case.schema';
import { CreateCaseDto } from './dto/create-case.dto';
import { UpdateCaseDto } from './dto/update-case.dto';

@ApiTags('Cases')
@Controller('cases')
export class CasesController {
  constructor(private readonly casesService: CasesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new case' })
  @ApiResponse({ status: 201, description: 'Case created successfully', type: Case })
  async create(@Body() createCaseDto: CreateCaseDto): Promise<Case> {
    return this.casesService.create(createCaseDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all cases' })
  @ApiResponse({ status: 200, description: 'Return all cases', type: [Case] })
  async findAll(): Promise<Case[]> {
    return this.casesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a case by ID' })
  @ApiResponse({ status: 200, description: 'Return a single case', type: Case })
  async findOne(@Param('id') id: string): Promise<Case> {
    return this.casesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a case' })
  @ApiResponse({ status: 200, description: 'Case updated successfully', type: Case })
  async update(@Param('id') id: string, @Body() updateCaseDto: UpdateCaseDto): Promise<Case> {
    return this.casesService.update(id, updateCaseDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a case' })
  @ApiResponse({ status: 200, description: 'Case deleted successfully' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.casesService.remove(id);
  }
}
