import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Product } from '../products/entities/product.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderItem } from './entities/order-item.entity';
import { Order } from './entities/order.entity';

@Injectable()
export class OrdersService {
  constructor(
    private readonly dataSource: DataSource,
  ) {}

  async createOrder(dto: CreateOrderDto): Promise<Order> {
    const queryRunner = this.dataSource.createQueryRunner();
    let transactionStarted = false;

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      transactionStarted = true;

      const quantitiesByProductId = new Map<string, number>();
      for (const item of dto.items) {
        quantitiesByProductId.set(
          item.productId,
          (quantitiesByProductId.get(item.productId) ?? 0) + item.quantity,
        );
      }

      const orderItemsData: Array<{
        product: Product;
        quantity: number;
        unitPrice: number;
      }> = [];
      let totalAmount = 0;

      for (const [productId, quantity] of quantitiesByProductId) {
        const product = await queryRunner.manager.findOne(Product, {
          where: { id: productId },
          lock: { mode: 'pessimistic_write' },
        });

        if (!product) {
          throw new NotFoundException(`Product ${productId} not found`);
        }

        if (product.stock < quantity) {
          throw new BadRequestException(
            `Insufficient stock for product ${product.name}`,
          );
        }

        product.stock -= quantity;
        await queryRunner.manager.save(Product, product);

        const unitPrice = Number(product.price);
        totalAmount += quantity * unitPrice;
        orderItemsData.push({ product, quantity, unitPrice });
      }

      const order = queryRunner.manager.create(Order, {
        status: 'PENDING',
        totalAmount: Number(totalAmount.toFixed(2)),
      });
      const savedOrder = await queryRunner.manager.save(Order, order);

      const orderItems = orderItemsData.map((item) =>
        queryRunner.manager.create(OrderItem, {
          order: savedOrder,
          product: item.product,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        }),
      );
      const savedOrderItems = await queryRunner.manager.save(
        OrderItem,
        orderItems,
      );

      savedOrder.items = savedOrderItems;
      await queryRunner.commitTransaction();
      return savedOrder;
    } catch (error) {
      if (transactionStarted) {
        await queryRunner.rollbackTransaction();
      }
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
