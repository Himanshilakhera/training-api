import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Role } from '../../auth/enums/role.enum';
import { Product } from '../../products/entities/product.entity';

@Injectable()
export class OwnershipGuard implements CanActivate {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const productId = request.params?.id;
    const user = request.user;

    if (!productId) {
      throw new NotFoundException('Resource not found');
    }

    const product = await this.productsRepository.findOne({
      where: { id: productId },
      relations: { creator: true },
    });

    if (!product) {
      throw new NotFoundException('Resource not found');
    }

    if (user?.role === Role.ADMIN) {
      return true;
    }

    if (user?.role === Role.VENDOR) {
      if (product.creator?.id === user.id) {
        return true;
      }

      throw new ForbiddenException(
        'You do not have permission to modify or delete this resource',
      );
    }

    throw new ForbiddenException(
      'You do not have permission to modify or delete this resource',
    );
  }
}
