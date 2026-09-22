import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../auth/enums/role.enum';
import { User } from '../users/entities/user.entity';

export interface GetUsersQuery {
  page?: number;
  limit?: number;
  role?: Role;
}

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async getUsers({ page = 1, limit = 10, role }: GetUsersQuery) {
    const queryBuilder = this.usersRepository
      .createQueryBuilder('user')
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('user.createdAt', 'DESC');

    if (role) {
      queryBuilder.andWhere('user.role = :role', { role });
    }

    const [items, total] = await queryBuilder.getManyAndCount();

    return {
      items,
      meta: {
        totalItems: total,
        itemCount: items.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      },
    };
  }

  async updateUserStatus(id: string, isActive: boolean): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.isActive = isActive;

    if (!isActive) {
      user.currentHashedRefreshToken = null;
    }

    return this.usersRepository.save(user);
  }
}
