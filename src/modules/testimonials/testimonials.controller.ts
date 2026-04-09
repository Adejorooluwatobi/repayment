import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TestimonialsService } from './testimonials.service';
import { Testimonial } from './schemas/testimonial.schema';
import { CreateTestimonialDto } from './dto/create-testimonial.dto';
import { UpdateTestimonialDto } from './dto/update-testimonial.dto';

@ApiTags('Testimonials')
@Controller('testimonials')
export class TestimonialsController {
  constructor(private readonly testimonialsService: TestimonialsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new testimonial' })
  @ApiResponse({ status: 201, description: 'Testimonial created successfully', type: Testimonial })
  async create(@Body() createTestimonialDto: CreateTestimonialDto): Promise<Testimonial> {
    return this.testimonialsService.create(createTestimonialDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all testimonials' })
  @ApiResponse({ status: 200, description: 'Return all testimonials', type: [Testimonial] })
  async findAll(): Promise<Testimonial[]> {
    return this.testimonialsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a testimonial by ID' })
  @ApiResponse({ status: 200, description: 'Return a single testimonial', type: Testimonial })
  async findOne(@Param('id') id: string): Promise<Testimonial> {
    return this.testimonialsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a testimonial' })
  @ApiResponse({ status: 200, description: 'Testimonial updated successfully', type: Testimonial })
  async update(@Param('id') id: string, @Body() updateTestimonialDto: UpdateTestimonialDto): Promise<Testimonial> {
    return this.testimonialsService.update(id, updateTestimonialDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a testimonial' })
  @ApiResponse({ status: 200, description: 'Testimonial deleted successfully' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.testimonialsService.remove(id);
  }
}
