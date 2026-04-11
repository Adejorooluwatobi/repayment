import { Injectable, NotFoundException, OnModuleInit, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from './schemas/order.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class OrdersService implements OnModuleInit {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    private readonly notificationsService: NotificationsService,
  ) {}

  async onModuleInit() {
    this.logger.log('Running production data cleanup for Orders...');
    
    // Convert empty strings to null for reference fields to prevent population crashes
    await this.orderModel.updateMany({ clientId: "" }, { $set: { clientId: null } });
    await this.orderModel.updateMany({ caseId: "" }, { $set: { caseId: null } });
    await this.orderModel.updateMany({ packageId: "" }, { $set: { packageId: null } });
    
    this.logger.log('Orders data cleanup completed.');
  }

  private sanitizeOrderData(data: any) {
    if (data.clientId === "") data.clientId = null;
    if (data.caseId === "") data.caseId = null;
    if (data.packageId === "") data.packageId = null;
    return data;
  }

  async create(createOrderDto: CreateOrderDto | any): Promise<Order> {
    const sanitizedData = this.sanitizeOrderData({ ...createOrderDto });
    const newOrder = new this.orderModel(sanitizedData);
    const order = await newOrder.save();

    // Notify admins about new order
    await this.notificationsService.notifyAdmins({
      title: 'New Order Placed (Manual Finalization Required)',
      message: `A new order has been placed by ${order.email}. Phone: ${order.phone}. Please contact the user to finalize the order.`,
      type: 'ORDER',
      refId: order._id as any,
      refModel: 'Order',
    });

    return order;
  }

  async findAll(user: any): Promise<Order[]> {
    const query = user.role === 'ADMIN' ? {} : { clientId: user.id };
    return this.orderModel.find(query).populate('clientId caseId packageId').exec();
  }

  async findOne(id: string, user: any): Promise<Order> {
    const query = user.role === 'ADMIN' ? { _id: id } : { _id: id, clientId: user.id };
    const order = await this.orderModel.findOne(query).populate('clientId caseId packageId').exec();
    if (!order) throw new NotFoundException(`Order with ID ${id} not found`);
    return order;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const sanitizedData = this.sanitizeOrderData({ ...updateOrderDto });
    const updatedOrder = await this.orderModel
      .findByIdAndUpdate(id, sanitizedData, { new: true })
      .exec();
    if (!updatedOrder) throw new NotFoundException(`Order with ID ${id} not found`);
    return updatedOrder;
  }

  async remove(id: string): Promise<void> {
    const result = await this.orderModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException(`Order with ID ${id} not found`);
  }
}
