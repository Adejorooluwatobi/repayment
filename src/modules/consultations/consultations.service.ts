import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Consultation } from './schemas/consultation.schema';
import { CreateConsultationDto } from './dto/create-consultation.dto';
import { UpdateConsultationDto } from './dto/update-consultation.dto';

import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class ConsultationsService {
  constructor(
    @InjectModel(Consultation.name) private stmtModel: Model<Consultation>,
    private readonly notificationsService: NotificationsService,
  ) {}

  async create(createConsultationDto: CreateConsultationDto | any): Promise<Consultation> {
    const newStmt = new this.stmtModel(createConsultationDto);
    const consultation = await newStmt.save();

    // Notify admins about new consultation
    await this.notificationsService.notifyAdmins({
      title: 'New Consultation Booking',
      message: `New consultation from ${consultation.firstName} ${consultation.lastName} (${consultation.email}).`,
      type: 'CONSULTATION',
      refId: consultation._id as any,
      refModel: 'Consultation',
    });

    return consultation;
  }

  async findAll(): Promise<Consultation[]> {
    return this.stmtModel.find().populate('clientId handledBy').exec();
  }

  async findOne(id: string): Promise<Consultation> {
    const stmt = await this.stmtModel.findById(id).populate('clientId handledBy').exec();
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
