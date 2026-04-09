import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { Notification } from './schemas/notification.schema';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new notification' })
  @ApiResponse({ status: 201, description: 'Notification created successfully', type: Notification })
  async create(@Body() createNotificationDto: CreateNotificationDto): Promise<Notification> {
    return this.notificationsService.create(createNotificationDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all notifications' })
  @ApiResponse({ status: 200, description: 'Return all notifications', type: [Notification] })
  async findAll(): Promise<Notification[]> {
    return this.notificationsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a notification by ID' })
  @ApiResponse({ status: 200, description: 'Return a single notification', type: Notification })
  async findOne(@Param('id') id: string): Promise<Notification> {
    return this.notificationsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a notification' })
  @ApiResponse({ status: 200, description: 'Notification updated successfully', type: Notification })
  async update(@Param('id') id: string, @Body() updateNotificationDto: UpdateNotificationDto): Promise<Notification> {
    return this.notificationsService.update(id, updateNotificationDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a notification' })
  @ApiResponse({ status: 200, description: 'Notification deleted successfully' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.notificationsService.remove(id);
  }
}
