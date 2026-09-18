import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Product } from '../../products/entities/product.entity';
import { Profile } from './profile.entity';

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

  @OneToMany(() => Product, (product) => product.creator)
  products: Product[];

  @OneToOne(() => Profile, (profile) => profile.user, {
    cascade: true,
  })
  profile: Profile;
}
