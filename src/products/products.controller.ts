import { Controller, Get, Post, Delete, Param, Body, Patch } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import type { Product } from './products.service';
import { UpdateProductDto } from './dto/update-product.dto';

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


  @Patch(':id')
update(
  @Param('id') id: string,
  @Body() updateProductDto: UpdateProductDto,
): Product {
  return this.productsService.update(Number(id), updateProductDto);
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
