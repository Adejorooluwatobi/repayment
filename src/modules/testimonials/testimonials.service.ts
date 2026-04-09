import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Testimonial } from './schemas/testimonial.schema';
import { CreateTestimonialDto } from './dto/create-testimonial.dto';
import { UpdateTestimonialDto } from './dto/update-testimonial.dto';

@Injectable()
export class TestimonialsService {
  constructor(@InjectModel(Testimonial.name) private testimonialModel: Model<Testimonial>) {}

  async create(createTestimonialDto: CreateTestimonialDto | any): Promise<Testimonial> {
    if (createTestimonialDto.clientId === '' || createTestimonialDto.clientId === 'null') {
      createTestimonialDto.clientId = null;
    }
    const newTestimonial = new this.testimonialModel(createTestimonialDto);
    return newTestimonial.save();
  }

  async findAll(): Promise<Testimonial[]> {
    try {
      return await this.testimonialModel.find().populate('clientId').exec();
    } catch (error) {
      // If population fails due to bad data (empty strings), return without population
      return this.testimonialModel.find().exec();
    }
  }

  async findOne(id: string): Promise<Testimonial> {
    try {
      const testimonial = await this.testimonialModel.findById(id).populate('clientId').exec();
      if (!testimonial) throw new NotFoundException(`Testimonial with ID ${id} not found`);
      return testimonial;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      const testimonial = await this.testimonialModel.findById(id).exec();
      if (!testimonial) throw new NotFoundException(`Testimonial with ID ${id} not found`);
      return testimonial;
    }
  }

  async update(id: string, updateTestimonialDto: UpdateTestimonialDto | any): Promise<Testimonial> {
    if (updateTestimonialDto.clientId === '' || updateTestimonialDto.clientId === 'null') {
      updateTestimonialDto.clientId = null;
    }
    const updatedTestimonial = await this.testimonialModel
      .findByIdAndUpdate(id, updateTestimonialDto, { new: true })
      .exec();
    if (!updatedTestimonial) throw new NotFoundException(`Testimonial with ID ${id} not found`);
    return updatedTestimonial;
  }

  async remove(id: string): Promise<void> {
    const result = await this.testimonialModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException(`Testimonial with ID ${id} not found`);
  }
}
