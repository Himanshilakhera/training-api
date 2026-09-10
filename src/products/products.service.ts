import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Category } from '../categories/entities/category.entity';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) { }
  @InjectRepository(Category)
  private categoryRepository: Repository<Category>

  private readonly logger = new Logger(ProductsService.name);

  /**
   * Retrieve all products
   * @returns Array of all products
   */
  async findAll(): Promise<Product[]> {
    return this.productsRepository.find({
      relations: {
        category: true,
      },
    });
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
  async create(createProductDto: CreateProductDto): Promise<Product> {
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
      category: { id: categoryId },
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
    // const product = await this.findOne(id);

    // await this.productsRepository.remove(product);
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
