import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import {
  FilterProductsDto,
  ProductSortBy,
} from './dto/filter-products.dto';
import { Category } from '../categories/entities/category.entity';
import { User } from '../users/entities/user.entity';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,

    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  private readonly logger = new Logger(ProductsService.name);

  /**
   * Retrieve filtered products with pagination.
   */
  async findAll(filter: FilterProductsDto): Promise<{
    items: Product[];
    meta: {
      totalItems: number;
      itemCount: number;
      itemsPerPage: number;
      totalPages: number;
      currentPage: number;
    };
  }> {
    const {
      page,
      limit,
      search,
      categoryId,
      minPrice,
      maxPrice,
      sortBy,
      sortOrder,
    } = filter;
    const sortColumn: Record<ProductSortBy, string> = {
      [ProductSortBy.PRICE]: 'product.price',
      [ProductSortBy.CREATED_AT]: 'product.createdAt',
      [ProductSortBy.NAME]: 'product.name',
    };
    const orderByColumn = sortColumn[sortBy];

    if (!orderByColumn) {
      throw new BadRequestException('Invalid sortBy value');
    }

    const queryBuilder = this.productsRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category');

    if (search) {
      queryBuilder.andWhere(
        '(LOWER(product.name) LIKE LOWER(:search) OR LOWER(product.description) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    if (categoryId) {
      queryBuilder.andWhere('category.id = :categoryId', { categoryId });
    }
    if (minPrice !== undefined) {
      queryBuilder.andWhere('product.price >= :minPrice', { minPrice });
    }
    if (maxPrice !== undefined) {
      queryBuilder.andWhere('product.price <= :maxPrice', { maxPrice });
    }

    const [items, total] = await queryBuilder
      .orderBy(orderByColumn, sortOrder)
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

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

  /**
   * Retrieve a product by ID
   * @param id - The product ID
   * @returns The product object
   * @throws NotFoundException if product does not exist
   */
  async findOne(id: string): Promise<Product> {
    const product = await this.productsRepository.findOneBy({ id });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  /**
   * Create a new product
   * @param createProductDto - Product creation data
   * @returns The created product
   */
  async create(
    createProductDto: CreateProductDto,
    userId?: string,
  ): Promise<Product> {
    const existingProduct = await this.productsRepository.findOneBy({
      name: createProductDto.name,
    });

    if (existingProduct) {
      throw new ConflictException(
        `Product with name "${createProductDto.name}" already exists`,
      );
    }

    const { categoryId, ...productData } = createProductDto;

    let category;

    if (categoryId) {
      category = await this.categoryRepository.findOne({
        where: { id: categoryId },
      });

      if (!category) {
        throw new NotFoundException('Category not found');
      }
    }

    const product = this.productsRepository.create({
      ...productData,
      ...(categoryId ? { category: { id: categoryId } } : {}),
      ...(userId ? { creator: { id: userId } as User } : {}),
    });
    const savedProduct = await this.productsRepository.save(product);

    this.logger.log(`Product created: ${savedProduct.name}`);
    return savedProduct;
  }

  /**
   * Update a product by ID
   * @param id - The product ID
   * @param updateProductDto - Product update data
   * @returns The updated product
   */
  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.findOne(id);

    const { categoryId, ...productData } = updateProductDto;

    Object.assign(product, productData);
    if (categoryId) {
      product.category = { id: categoryId } as Category;
    }

    return this.productsRepository.save(product);
  }

  /**
   * Remove a product by ID
   * @param id - The product ID
   * @throws NotFoundException if product does not exist
   */
  async remove(id: string): Promise<{ message: string }> {
    const result = await this.productsRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException('Product not found');
    }
    this.logger.log(`Product deleted: ${id}`);
    return {
      message: 'Product deleted successfully',
    };
  }
}
