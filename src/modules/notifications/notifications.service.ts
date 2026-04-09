import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification } from './schemas/notification.schema';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';

@Injectable()
export class NotificationsService {
  constructor(@InjectModel(Notification.name) private notificationModel: Model<Notification>) {}

  async create(createNotificationDto: CreateNotificationDto | any): Promise<Notification> {
    const newNotification = new this.notificationModel(createNotificationDto);
    return newNotification.save();
  }

  async findAll(): Promise<Notification[]> {
    return this.notificationModel.find().populate('userId').exec();
  }

  async findOne(id: string): Promise<Notification> {
    const notification = await this.notificationModel.findById(id).populate('userId').exec();
    if (!notification) throw new NotFoundException(`Notification with ID ${id} not found`);
    return notification;
  }

  async update(id: string, updateNotificationDto: UpdateNotificationDto): Promise<Notification> {
    const updatedNotification = await this.notificationModel
      .findByIdAndUpdate(id, updateNotificationDto, { new: true })
      .exec();
    if (!updatedNotification) throw new NotFoundException(`Notification with ID ${id} not found`);
    return updatedNotification;
  }

  async remove(id: string): Promise<void> {
    const result = await this.notificationModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException(`Notification with ID ${id} not found`);
  }
}
