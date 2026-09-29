import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { Order } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly notificationsService: NotificationsService,
  ) {}

  private sanitizeOrderData(data: any) {
    if (data.clientId === '' || data.clientId === 'null') data.clientId = null;
    if (data.caseId === '' || data.caseId === 'null') data.caseId = null;
    if (data.packageId === '' || data.packageId === 'null') data.packageId = null;
    return data;
  }

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const sanitizedData = this.sanitizeOrderData({ ...createOrderDto });
    const newOrder = this.orderRepository.create(sanitizedData as DeepPartial<Order>);
    const order = await this.orderRepository.save(newOrder);

    // Notify admins about new order
    await this.notificationsService.notifyAdmins({
      title: 'New Order Placed (Manual Finalization Required)',
      message: `A new order has been placed by ${order.email || 'customer'}. Phone: ${order.phone || 'N/A'}. Please contact the user to finalize the order.`,
      type: 'ORDER',
      refId: order.id,
      refModel: 'Order',
    });

    return order;
  }

  async findAll(user: any): Promise<Order[]> {
    const where = user.role === 'ADMIN' ? {} : { clientId: user.id };
    return this.orderRepository.find({
      where,
      relations: { client: true, case: true, package: true },
    });
  }

  async findOne(id: string, user: any): Promise<Order> {
    const where = user.role === 'ADMIN' ? { id } : { id, clientId: user.id };
    const order = await this.orderRepository.findOne({
      where,
      relations: { client: true, case: true, package: true },
    });
    if (!order) throw new NotFoundException(`Order with ID ${id} not found`);
    return order;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.orderRepository.findOne({ where: { id } });
    if (!order) throw new NotFoundException(`Order with ID ${id} not found`);
    const sanitizedData = this.sanitizeOrderData({ ...updateOrderDto });
    Object.assign(order, sanitizedData);
    return this.orderRepository.save(order);
  }

  async remove(id: string): Promise<void> {
    const result = await this.orderRepository.delete(id);
    if (!result.affected) throw new NotFoundException(`Order with ID ${id} not found`);
  }
}
