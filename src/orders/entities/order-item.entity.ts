import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import { Order } from './order.entity';

@Entity('order_items')
export class OrderItem {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Order, (order) => order.items, {
        onDelete: 'CASCADE',
    })
    order: Order;

    @ManyToOne(() => Product, (product) => product.orderItems, {
        onDelete: 'RESTRICT',
    })
    @JoinColumn({ name: 'product_id' })
    product: Product;

    @Column({ type: 'int', unsigned: true })
    quantity: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    unitPrice: number;
}