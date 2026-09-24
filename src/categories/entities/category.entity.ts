import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import { ApiHideProperty } from '@nestjs/swagger';

@Entity('categories')
export class Category {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 100, unique: true })
    name: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    description: string;

    @ApiHideProperty()
    @OneToMany(() => Product, (product) => product.category)
    products: Product[];

    @CreateDateColumn({ type: 'datetime' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'datetime' })
    updatedAt: Date;

    @Column({ type: 'varchar', length: 255, unique: true })
    slug: string;
}
