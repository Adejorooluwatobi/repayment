import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { Testimonial } from './entities/testimonial.entity';
import { CreateTestimonialDto } from './dto/create-testimonial.dto';
import { UpdateTestimonialDto } from './dto/update-testimonial.dto';

@Injectable()
export class TestimonialsService {
  constructor(
    @InjectRepository(Testimonial)
    private readonly testimonialRepository: Repository<Testimonial>,
  ) {}

  private sanitizeData(data: any) {
    if (data.clientId === '' || data.clientId === 'null') {
      data.clientId = null;
    }
    return data;
  }

  async create(createTestimonialDto: CreateTestimonialDto): Promise<Testimonial> {
    const sanitizedData = this.sanitizeData({ ...createTestimonialDto });
    const newTestimonial = this.testimonialRepository.create(sanitizedData as DeepPartial<Testimonial>);
    return this.testimonialRepository.save(newTestimonial);
  }

  async findAll(): Promise<Testimonial[]> {
    return this.testimonialRepository.find({
      relations: { client: true },
    });
  }

  async findOne(id: string): Promise<Testimonial> {
    const testimonial = await this.testimonialRepository.findOne({
      where: { id },
      relations: { client: true },
    });
    if (!testimonial) throw new NotFoundException(`Testimonial with ID ${id} not found`);
    return testimonial;
  }

  async update(id: string, updateTestimonialDto: UpdateTestimonialDto | any): Promise<Testimonial> {
    const testimonial = await this.findOne(id);
    const sanitizedData = this.sanitizeData({ ...updateTestimonialDto });
    Object.assign(testimonial, sanitizedData);
    return this.testimonialRepository.save(testimonial);
  }

  async remove(id: string): Promise<void> {
    const result = await this.testimonialRepository.delete(id);
    if (!result.affected) throw new NotFoundException(`Testimonial with ID ${id} not found`);
  }
}
