import { Injectable, NotFoundException } from '@nestjs/common';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
}

export interface CreateProductDto {
  name: string;
  description: string;
  price: number;
}

@Injectable()
export class ProductsService {
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
    const product: Product = {
      id: this.nextId++,
      ...createProductDto,
    };
    this.products.push(product);
    return product;
  }

  /**
   * Remove a product by ID
   * @param id - The product ID
   * @throws NotFoundException if product does not exist
   */
  remove(id: number): void {
    const index = this.products.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    this.products.splice(index, 1);
  }
}
