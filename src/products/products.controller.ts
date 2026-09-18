import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../auth/enums/role.enum';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FilterProductsDto } from './dto/filter-products.dto';
import type { Product } from './entities/product.entity';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  /**
   * Retrieve all products
   * GET /products
   * @returns Array of all products
   */
  @Get()
  async findAll(@Query() filterDto: FilterProductsDto) {
    return this.productsService.findAll(filterDto);
  }

  /**
   * Retrieve a product by ID
   * GET /products/:id
   * @param id - The product ID
   * @returns The product object
   */
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Product> {
    return this.productsService.findOne(id);
  }

  /**
   * Create a new product
   * POST /products
   * @param createProductDto - Product creation data
   * @returns The created product
   */
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.VENDOR)
  async create(
    @Body() createProductDto: CreateProductDto,
    @CurrentUser() user: Omit<User, 'password'>,
  ): Promise<Product> {
    return this.productsService.create(createProductDto, user.id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.VENDOR)
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @CurrentUser() user: Omit<User, 'password'>,
  ): Promise<Product> {
    const product = await this.productsService.findOne(id);

    if (user.role === Role.VENDOR && product.creator?.id !== user.id) {
      throw new ForbiddenException(
        'You do not have permission to modify this product',
      );
    }

    return this.productsService.update(id, updateProductDto);
  }

  /**
   * Remove a product by ID
   * DELETE /products/:id
   * @param id - The product ID
   */

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.productsService.remove(id);
  }
}
