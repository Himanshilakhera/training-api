import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Product } from '../products/entities/product.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderItem } from './entities/order-item.entity';
import { Order } from './entities/order.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemsRepository: Repository<OrderItem>,
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {

    const productIds = createOrderDto.items.map((item) => item.productId);
    const products = await this.productsRepository.findBy({
      id: In(productIds),
    });
    const productsById = new Map(
      products.map((product) => [product.id, product]),
    );
    const missingProductIds = productIds.filter(
      (productId) => !productsById.has(productId),
    );

    if (missingProductIds.length > 0) {
      throw new NotFoundException(
        `Products not found: ${missingProductIds.join(', ')}`,
      );
    }

    const orderItems = createOrderDto.items.map((item) => {
      const product = productsById.get(item.productId);
      if (!product) {
        throw new NotFoundException(`Product ${item.productId} not found`);
      }

      return this.orderItemsRepository.create({
        product,
        quantity: item.quantity,
        unitPrice: Number(product.price),
      });
    });

    const totalAmount = Number(
      orderItems
        .reduce((total, item) => total + item.quantity * Number(item.unitPrice), 0)
        .toFixed(2),
    );
    const order = this.ordersRepository.create({
      status: 'PENDING',
      totalAmount,
      items: orderItems,
    });

    return this.ordersRepository.save(order);
  }
}
