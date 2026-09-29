import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { AdminService } from '../admin/admin.service';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    private readonly adminService: AdminService,
  ) {}

  async create(createNotificationDto: CreateNotificationDto): Promise<Notification> {
    const newNotification = this.notificationRepository.create({
      ...createNotificationDto,
      onModel: createNotificationDto.onModel || 'User',
    } as DeepPartial<Notification>);
    return this.notificationRepository.save(newNotification);
  }

  async notifyAdmins(data: { title: string; message: string; type: string; refId?: string; refModel?: string }): Promise<void> {
    const admins = await this.adminService.findAll();
    const notifications = admins.map(admin =>
      this.notificationRepository.create({
        userId: admin.id,
        onModel: 'Admin',
        title: data.title,
        message: data.message,
        type: data.type,
        refId: data.refId,
        refModel: data.refModel,
        read: false,
      } as DeepPartial<Notification>),
    );

    if (notifications.length > 0) {
      await this.notificationRepository.save(notifications);
    }
  }

  async findAllForUser(userId: string, onModel: string = 'Admin'): Promise<Notification[]> {
    return this.notificationRepository.find({
      where: { userId, onModel },
      order: { createdAt: 'DESC' },
    });
  }

  async getUnreadCount(userId: string, onModel: string = 'Admin'): Promise<number> {
    return this.notificationRepository.count({
      where: { userId, onModel, read: false },
    });
  }

  async markAllAsRead(userId: string, onModel: string = 'Admin'): Promise<void> {
    await this.notificationRepository.update(
      { userId, onModel, read: false },
      { read: true },
    );
  }

  async markAsRead(id: string): Promise<Notification> {
    const notification = await this.findOne(id);
    notification.read = true;
    return this.notificationRepository.save(notification);
  }

  async findAll(): Promise<Notification[]> {
    return this.notificationRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Notification> {
    const notification = await this.notificationRepository.findOne({ where: { id } });
    if (!notification) throw new NotFoundException(`Notification with ID ${id} not found`);
    
    // Automatically mark as read when fetching single
    if (!notification.read) {
      notification.read = true;
      await this.notificationRepository.save(notification);
    }
    
    return notification;
  }

  async update(id: string, updateNotificationDto: UpdateNotificationDto): Promise<Notification> {
    const notification = await this.findOne(id);
    Object.assign(notification, updateNotificationDto);
    return this.notificationRepository.save(notification);
  }

  async remove(id: string): Promise<void> {
    const result = await this.notificationRepository.delete(id);
    if (!result.affected) throw new NotFoundException(`Notification with ID ${id} not found`);
  }
}
