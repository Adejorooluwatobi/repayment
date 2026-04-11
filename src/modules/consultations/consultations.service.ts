import { Injectable, NotFoundException, OnModuleInit, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Consultation } from './schemas/consultation.schema';
import { CreateConsultationDto } from './dto/create-consultation.dto';
import { UpdateConsultationDto } from './dto/update-consultation.dto';

import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class ConsultationsService implements OnModuleInit {
  private readonly logger = new Logger(ConsultationsService.name);

  constructor(
    @InjectModel(Consultation.name) private stmtModel: Model<Consultation>,
    private readonly notificationsService: NotificationsService,
  ) {}

  async onModuleInit() {
    this.logger.log('Running production data cleanup for Consultations...');
    
    // Convert empty strings to null for reference fields to prevent population crashes
    await this.stmtModel.updateMany({ clientId: "" }, { $set: { clientId: null } });
    await this.stmtModel.updateMany({ handledBy: "" }, { $set: { handledBy: null } });
    
    this.logger.log('Consultations data cleanup completed.');
  }

  private sanitizeConsultationData(data: any) {
    if (data.clientId === "") data.clientId = null;
    if (data.handledBy === "") data.handledBy = null;
    return data;
  }

  async create(createConsultationDto: CreateConsultationDto | any): Promise<Consultation> {
    const sanitizedData = this.sanitizeConsultationData({ ...createConsultationDto });
    const newStmt = new this.stmtModel(sanitizedData);
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
    const sanitizedData = this.sanitizeConsultationData({ ...updateConsultationDto });
    const updatedStmt = await this.stmtModel
      .findByIdAndUpdate(id, sanitizedData, { new: true })
      .exec();
    if (!updatedStmt) throw new NotFoundException(`Consultation with ID ${id} not found`);
    return updatedStmt;
  }

  async remove(id: string): Promise<void> {
    const result = await this.stmtModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException(`Consultation with ID ${id} not found`);
  }
}
