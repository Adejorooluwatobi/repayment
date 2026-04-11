import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from './schemas/order.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    private readonly notificationsService: NotificationsService,
  ) {}

  async create(createOrderDto: CreateOrderDto | any): Promise<Order> {
    const newOrder = new this.orderModel(createOrderDto);
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

  async findAll(): Promise<Order[]> {
    return this.orderModel.find().populate('clientId caseId packageId').exec();
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderModel.findById(id).populate('clientId caseId packageId').exec();
    if (!order) throw new NotFoundException(`Order with ID ${id} not found`);
    return order;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const updatedOrder = await this.orderModel
      .findByIdAndUpdate(id, updateOrderDto, { new: true })
      .exec();
    if (!updatedOrder) throw new NotFoundException(`Order with ID ${id} not found`);
    return updatedOrder;
  }

  async remove(id: string): Promise<void> {
    const result = await this.orderModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException(`Order with ID ${id} not found`);
  }
}
