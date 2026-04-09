import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Consultation } from './schemas/consultation.schema';
import { CreateConsultationDto } from './dto/create-consultation.dto';
import { UpdateConsultationDto } from './dto/update-consultation.dto';

@Injectable()
export class ConsultationsService {
  constructor(@InjectModel(Consultation.name) private stmtModel: Model<Consultation>) {}

  async create(createConsultationDto: CreateConsultationDto | any): Promise<Consultation> {
    const newStmt = new this.stmtModel(createConsultationDto);
    return newStmt.save();
  }

  async findAll(): Promise<Consultation[]> {
    return this.stmtModel.find().populate('clientId caseId handledBy').exec();
  }

  async findOne(id: string): Promise<Consultation> {
    const stmt = await this.stmtModel.findById(id).populate('clientId caseId handledBy').exec();
    if (!stmt) throw new NotFoundException(`Consultation with ID ${id} not found`);
    return stmt;
  }

  async update(id: string, updateConsultationDto: UpdateConsultationDto): Promise<Consultation> {
    const updatedStmt = await this.stmtModel
      .findByIdAndUpdate(id, updateConsultationDto, { new: true })
      .exec();
    if (!updatedStmt) throw new NotFoundException(`Consultation with ID ${id} not found`);
    return updatedStmt;
  }

  async remove(id: string): Promise<void> {
    const result = await this.stmtModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException(`Consultation with ID ${id} not found`);
  }
}
