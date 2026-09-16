import {
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
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

  @OneToOne(() => Profile, (profile) => profile.user, {
    cascade: true,
  })
  profile: Profile;
}
