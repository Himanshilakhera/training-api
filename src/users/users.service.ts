import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from './entities/profile.entity';
import { User } from './entities/user.entity';

export interface CreateUserWithProfileInput {
  email: string;
  name: string;
  profile: Pick<Profile, 'bio' | 'phoneNumber' | 'address'>;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async createWithProfile(
    input: CreateUserWithProfileInput,
  ): Promise<User> {
    const user = this.usersRepository.create({
      email: input.email,
      name: input.name,
      profile: this.usersRepository.manager.create(Profile, input.profile),
    });

    return this.usersRepository.save(user);
  }

  async remove(id: string): Promise<{ message: string }> {
    const user = await this.usersRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    await this.usersRepository.delete(user.id);

    return {
      message: 'User deleted successfully',
    };
  }
}
