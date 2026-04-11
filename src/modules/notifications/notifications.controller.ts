import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { Notification } from './schemas/notification.schema';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new notification' })
  @ApiResponse({ status: 201, description: 'Notification created successfully', type: Notification })
  async create(@Body() createNotificationDto: CreateNotificationDto): Promise<Notification> {
    return this.notificationsService.create(createNotificationDto);
  }

  @Get('me')
  @ApiOperation({ summary: 'Get notifications for the logged in user' })
  @ApiResponse({ status: 200, description: 'Return personal notifications', type: [Notification] })
  async findMe(@Req() req: any): Promise<Notification[]> {
    const userId = req.user.sub || req.user.id;
    const onModel = req.user.role === 'ADMIN' ? 'Admin' : 'User';
    return this.notificationsService.findAllForUser(userId, onModel);
  }

  @Get('unread-count')
  @ApiOperation({ summary: 'Get unread notification count for the logged in user' })
  async getUnreadCount(@Req() req: any): Promise<{ count: number }> {
    const userId = req.user.sub || req.user.id;
    const onModel = req.user.role === 'ADMIN' ? 'Admin' : 'User';
    const count = await this.notificationsService.getUnreadCount(userId, onModel);
    return { count };
  }

  @Patch('mark-all-read')
  @ApiOperation({ summary: 'Mark all notifications as read for logged in user' })
  async markAllRead(@Req() req: any): Promise<{ succeeded: boolean }> {
    const userId = req.user.sub || req.user.id;
    const onModel = req.user.role === 'ADMIN' ? 'Admin' : 'User';
    await this.notificationsService.markAllAsRead(userId, onModel);
    return { succeeded: true };
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark a specific notification as read' })
  async markRead(@Param('id') id: string): Promise<Notification> {
    return this.notificationsService.markAsRead(id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all notifications (Admin only)' })
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
