import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import type { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  category: string;
}

@Injectable()
export class ProductsService {

  private readonly logger = new Logger(ProductsService.name);
  private products: Product[] = [];
  private nextId: number = 1;

  /**
   * Retrieve all products
   * @returns Array of all products
   */
  findAll(): Product[] {
    return this.products;
  }

  /**
   * Retrieve a product by ID
   * @param id - The product ID
   * @returns The product object
   * @throws NotFoundException if product does not exist
   */
  findOne(id: number): Product {
    const product = this.products.find((p) => p.id === id);
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
  create(createProductDto: CreateProductDto): Product {

    const existingProduct = this.products.find(
      (product) =>
        product.name.toLowerCase() ===
        createProductDto.name.toLowerCase(),
    );

    if (existingProduct) {
      throw new ConflictException(
        `Product with name "${createProductDto.name}" already exists`,
      );
    }
    const product: Product = {
      id: this.nextId++,
      ...createProductDto,
    };
    this.products.push(product);
    this.logger.log(`Product created: ${product.name}`);
    return product;
  }


  /**
 * Update a product by ID
 * @param id - The product ID
 * @param updateProductDto - Product update data
 * @returns The updated product
 */
  update(id: number, updateProductDto: UpdateProductDto): Product {
    const product = this.findOne(id);

    Object.assign(product, updateProductDto);

    return product;
  }


  /**
   * Remove a product by ID
   * @param id - The product ID
   * @throws NotFoundException if product does not exist
   */
  remove(id: number) {
    const index = this.products.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    this.products.splice(index, 1);
    this.logger.log(`Product deleted: ${id}`);
    return {
      message: 'Product deleted successfully',
    };
  }
}
