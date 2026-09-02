import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { ProductsService } from './products.service';
import type { Product, CreateProductDto } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  /**
   * Retrieve all products
   * GET /products
   * @returns Array of all products
   */
  @Get()
  findAll(): Product[] {
    return this.productsService.findAll();
  }

  /**
   * Retrieve a product by ID
   * GET /products/:id
   * @param id - The product ID
   * @returns The product object
   */
  @Get(':id')
  findOne(@Param('id') id: string): Product {
    return this.productsService.findOne(Number(id));
  }

  /**
   * Create a new product
   * POST /products
   * @param createProductDto - Product creation data
   * @returns The created product
   */
  @Post()
  create(@Body() createProductDto: CreateProductDto): Product {
    return this.productsService.create(createProductDto);
  }

  /**
   * Remove a product by ID
   * DELETE /products/:id
   * @param id - The product ID
   */
  @Delete(':id')
  remove(@Param('id') id: string): void {
    this.productsService.remove(Number(id));
  }
}
