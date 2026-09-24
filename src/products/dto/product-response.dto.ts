import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserResponseDto } from '../../users/dto/user-response.dto';

export class CategorySummaryResponseDto {
  @ApiProperty({
    description: 'Unique category identifier.',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Category name.',
    example: 'Electronics',
  })
  name: string;

  @ApiProperty({
    description: 'Category description.',
    example: 'Devices, accessories, and consumer electronics.',
    nullable: true,
  })
  description: string | null;

  @ApiProperty({
    description: 'URL-friendly category slug.',
    example: 'electronics',
  })
  slug: string;

  @ApiProperty({
    description: 'Date when the category was created.',
    example: '2026-09-23T12:00:00.000Z',
    type: String,
    format: 'date-time',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Date when the category was last updated.',
    example: '2026-09-23T12:30:00.000Z',
    type: String,
    format: 'date-time',
  })
  updatedAt: Date;
}

export class ProductSummaryResponseDto {
  @ApiProperty({
    description: 'Unique product identifier.',
    example: '01234567-89ab-cdef-0123-456789abcdef',
  })
  id: string;

  @ApiProperty({
    description: 'Product name.',
    example: 'Wireless Noise-Canceling Headphones',
  })
  name: string;

  @ApiProperty({
    description: 'Product description.',
    example: 'Bluetooth over-ear headphones with active noise cancellation and 30-hour battery life.',
    nullable: true,
  })
  description: string | null;

  @ApiProperty({
    description: 'Product price in the base currency.',
    example: 199.99,
    type: Number,
  })
  price: number;

  @ApiProperty({
    description: 'Current stock quantity available for sale.',
    example: 25,
    type: Number,
  })
  stock: number;

  @ApiProperty({
    description: 'Date when the product was created.',
    example: '2026-09-23T14:00:00.000Z',
    type: String,
    format: 'date-time',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Date when the product was last updated.',
    example: '2026-09-23T14:15:00.000Z',
    type: String,
    format: 'date-time',
  })
  updatedAt: Date;
}

export class ProductResponseDto extends ProductSummaryResponseDto {
  @ApiPropertyOptional({
    description: 'Category assigned to the product.',
    type: () => CategorySummaryResponseDto,
    nullable: true,
  })
  category?: CategorySummaryResponseDto | null;

  @ApiPropertyOptional({
    description: 'User who created the product.',
    type: () => UserResponseDto,
    nullable: true,
  })
  creator?: UserResponseDto | null;
}

export class ProductMetaResponseDto {
  @ApiProperty({
    description: 'Overall number of matching products.',
    example: 42,
    type: Number,
  })
  totalItems: number;

  @ApiProperty({
    description: 'Number of items in the current page.',
    example: 10,
    type: Number,
  })
  itemCount: number;

  @ApiProperty({
    description: 'Maximum number of items per page.',
    example: 10,
    type: Number,
  })
  itemsPerPage: number;

  @ApiProperty({
    description: 'Total number of pages based on the current page size.',
    example: 5,
    type: Number,
  })
  totalPages: number;

  @ApiProperty({
    description: 'Current page number.',
    example: 1,
    type: Number,
  })
  currentPage: number;
}

export class ProductListResponseDto {
  @ApiProperty({
    description: 'Products on the current page.',
    type: () => [ProductResponseDto],
  })
  items: ProductResponseDto[];

  @ApiProperty({
    description: 'Pagination metadata for the result set.',
    type: () => ProductMetaResponseDto,
  })
  meta: ProductMetaResponseDto;
}

export class CategoryProductsResponseDto extends CategorySummaryResponseDto {
  @ApiProperty({
    description: 'Products belonging to the category.',
    type: () => [ProductSummaryResponseDto],
  })
  products: ProductSummaryResponseDto[];
}
