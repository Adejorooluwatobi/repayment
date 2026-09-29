import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { Consultation } from './entities/consultation.entity';
import { CreateConsultationDto } from './dto/create-consultation.dto';
import { UpdateConsultationDto } from './dto/update-consultation.dto';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class ConsultationsService {
  private readonly logger = new Logger(ConsultationsService.name);

  constructor(
    @InjectRepository(Consultation)
    private readonly consultationRepository: Repository<Consultation>,
    private readonly notificationsService: NotificationsService,
  ) {}

  private sanitizeConsultationData(data: any) {
    if (data.clientId === '' || data.clientId === 'null') data.clientId = null;
    if (data.handledBy === '' || data.handledBy === 'null') data.handledBy = null;
    return data;
  }

  async create(createConsultationDto: CreateConsultationDto): Promise<Consultation> {
    const sanitizedData = this.sanitizeConsultationData({ ...createConsultationDto });
    const newConsultation = this.consultationRepository.create(sanitizedData as DeepPartial<Consultation>);
    const consultation = await this.consultationRepository.save(newConsultation);

    // Notify admins about new consultation
    await this.notificationsService.notifyAdmins({
      title: 'New Consultation Booking',
      message: `New consultation from ${consultation.firstName} ${consultation.lastName} (${consultation.email}).`,
      type: 'CONSULTATION',
      refId: consultation.id,
      refModel: 'Consultation',
    });

    return consultation;
  }

  async findAll(): Promise<Consultation[]> {
    return this.consultationRepository.find({
      relations: { client: true, handler: true },
    });
  }

  async findOne(id: string): Promise<Consultation> {
    const consultation = await this.consultationRepository.findOne({
      where: { id },
      relations: { client: true, handler: true },
    });
    if (!consultation) throw new NotFoundException(`Consultation with ID ${id} not found`);
    return consultation;
  }

  async update(id: string, updateConsultationDto: UpdateConsultationDto): Promise<Consultation> {
    const consultation = await this.findOne(id);
    const sanitizedData = this.sanitizeConsultationData({ ...updateConsultationDto });
    Object.assign(consultation, sanitizedData);
    return this.consultationRepository.save(consultation);
  }

  async remove(id: string): Promise<void> {
    const result = await this.consultationRepository.delete(id);
    if (!result.affected) throw new NotFoundException(`Consultation with ID ${id} not found`);
  }
}
