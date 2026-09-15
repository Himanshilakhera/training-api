import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { OrderItem } from './order-item.entity';
import { User } from '../../users/entities/user.entity';

@Entity('orders')
export class Order {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    totalAmount: number;

    @Column({
        type: 'enum',
        enum: ['PENDING', 'COMPLETED', 'CANCELLED'],
        default: 'PENDING',
    })
    status: string;

    @ManyToOne(() => User)
    user: User;

    @OneToMany(() => OrderItem, (item) => item.order, {
        cascade: true,
    })
    items: OrderItem[];

    @CreateDateColumn() 
    createdAt: Date; 

    @UpdateDateColumn() 
    updatedAt: Date;

}