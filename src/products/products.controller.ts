import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ApiErrorResponse } from '../common/swagger/api-error-response';
import { ApiSuccessResponse } from '../common/swagger/api-success-response';
import { User } from '../users/entities/user.entity';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../auth/enums/role.enum';
import { OwnershipGuard } from '../common/guards/ownership.guard';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { DeleteProductResponseDto } from './dto/delete-product-response.dto';
import {
  ProductListResponseDto,
  ProductResponseDto,
} from './dto/product-response.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import {
  FilterProductsDto,
  ProductSortBy,
  SortOrder,
} from './dto/filter-products.dto';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  /**
   * Retrieve all products
   * GET /products
   * @returns Array of all products
   */
  @Get()
  @ApiOperation({
    summary: 'Get all products',
    description:
      'Returns a paginated and filterable list of products. This endpoint does not require authentication.',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number for pagination. Minimum value is 1.',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of items per page. Minimum 1 and maximum 100.',
    example: 10,
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Keyword used to search product names and descriptions.',
    example: 'headphones',
  })
  @ApiQuery({
    name: 'categoryId',
    required: false,
    type: String,
    description: 'UUID of the category to filter products by.',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiQuery({
    name: 'minPrice',
    required: false,
    type: Number,
    description: 'Minimum product price.',
    example: 50,
  })
  @ApiQuery({
    name: 'maxPrice',
    required: false,
    type: Number,
    description: 'Maximum product price.',
    example: 200,
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: ProductSortBy,
    description: 'Field used to sort products.',
    example: ProductSortBy.CREATED_AT,
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    enum: SortOrder,
    description: 'Sort direction for the selected field.',
    example: SortOrder.DESC,
  })
  @ApiSuccessResponse(ProductListResponseDto, {
    status: 200,
    description: 'Products retrieved successfully.',
  })
  @ApiErrorResponse(400, 'Invalid query parameters or sortBy value.', 'Invalid query parameters')
  async findAll(@Query() filterDto: FilterProductsDto): Promise<ProductListResponseDto> {
    return this.productsService.findAll(filterDto) as Promise<ProductListResponseDto>;
  }

  /**
   * Retrieve a product by ID
   * GET /products/:id
   * @param id - The product ID
   * @returns The product object
   */
  @Get(':id')
  @ApiOperation({
    summary: 'Get a product by ID',
    description: 'Fetches a single product by its unique identifier.',
  })
  @ApiParam({
    name: 'id',
    description: 'The product ID.',
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiSuccessResponse(ProductResponseDto, {
    status: 200,
    description: 'Product retrieved successfully.',
  })
  @ApiErrorResponse(404, 'Product not found.', 'Product not found')
  async findOne(@Param('id') id: string): Promise<ProductResponseDto> {
    return this.productsService.findOne(id) as Promise<ProductResponseDto>;
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
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Create a product',
    description:
      'Creates a new product. Requires one of the following roles: admin, vendor.',
  })
  @ApiSuccessResponse(ProductResponseDto, {
    status: 201,
    description: 'Product created successfully.',
  })
  @ApiErrorResponse(400, 'Invalid product payload or validation failed.', 'Invalid product payload')
  @ApiErrorResponse(401, 'Authentication is required or invalid.', 'Unauthorized')
  @ApiErrorResponse(403, 'User does not have the required role to create a product.', 'Forbidden resource')
  @ApiErrorResponse(404, 'Referenced category was not found.', 'Category not found')
  async create(
    @Body() createProductDto: CreateProductDto,
    @CurrentUser() user: Omit<User, 'password'>,
  ): Promise<ProductResponseDto> {
    return this.productsService.create(createProductDto, user.id) as Promise<ProductResponseDto>;
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, OwnershipGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Update a product by ID',
    description:
      'Updates an existing product. Only the product owner vendor or an admin can modify it.',
  })
  @ApiParam({
    name: 'id',
    description: 'The product ID to update.',
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiSuccessResponse(ProductResponseDto, {
    status: 200,
    description: 'Product updated successfully.',
  })
  @ApiErrorResponse(400, 'Invalid update payload or validation failed.', 'Invalid product update payload')
  @ApiErrorResponse(401, 'Authentication is required or invalid.', 'Unauthorized')
  @ApiErrorResponse(403, 'User does not have permission to modify this product.', 'Forbidden resource')
  @ApiErrorResponse(404, 'Product or referenced resource was not found.', 'Product not found')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<ProductResponseDto> {
    return this.productsService.update(id, updateProductDto) as Promise<ProductResponseDto>;
  }

  /**
   * Remove a product by ID
   * DELETE /products/:id
   * @param id - The product ID
   */

  @Delete(':id')
  @UseGuards(JwtAuthGuard, OwnershipGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Delete a product by ID',
    description:
      'Deletes an existing product. Only the product owner vendor or an admin can remove it.',
  })
  @ApiParam({
    name: 'id',
    description: 'The product ID to delete.',
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiSuccessResponse(DeleteProductResponseDto, {
    status: 200,
    description: 'Product deleted successfully.',
  })
  @ApiErrorResponse(401, 'Authentication is required or invalid.', 'Unauthorized')
  @ApiErrorResponse(403, 'User does not have permission to delete this product.', 'Forbidden resource')
  @ApiErrorResponse(404, 'Product not found.', 'Product not found')
  async remove(@Param('id') id: string): Promise<DeleteProductResponseDto> {
    return this.productsService.remove(id) as Promise<DeleteProductResponseDto>;
  }
}
