import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Product } from '../../products/entities/product.entity';
import { Profile } from './profile.entity';
import { Role } from '../../auth/enums/role.enum';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  name: string;

  @Column()
  @Exclude()
  password: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.CUSTOMER,
  })
  role: Role;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  @Exclude()
  currentHashedRefreshToken: string | null;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt: Date;

  @OneToMany(() => Product, (product) => product.creator)
  products: Product[];

  @OneToOne(() => Profile, (profile) => profile.user, {
    cascade: true,
  })
  profile: Profile;
}
