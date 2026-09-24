import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export enum ProductSortBy {
  PRICE = 'price',
  CREATED_AT = 'createdAt',
  NAME = 'name',
}

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class FilterProductsDto {
  @ApiPropertyOptional({
    description: 'Page number for pagination. Must be at least 1.',
    type: Number,
    minimum: 1,
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({
    description: 'Number of results per page. Must be between 1 and 100.',
    type: Number,
    minimum: 1,
    maximum: 100,
    example: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit: number = 10;

  @ApiPropertyOptional({
    description: 'Search string used to match product names and descriptions.',
    example: 'wireless headphones',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'UUID of the category to filter products by.',
    format: 'uuid',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @ApiPropertyOptional({
    description: 'Minimum product price. Must be greater than or equal to 0.',
    type: Number,
    minimum: 0,
    example: 50,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @ApiPropertyOptional({
    description: 'Maximum product price.',
    type: Number,
    example: 250,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxPrice?: number;

  @ApiPropertyOptional({
    description: 'Field used to sort the product list.',
    enum: ProductSortBy,
    enumName: 'ProductSortBy',
    example: ProductSortBy.CREATED_AT,
  })
  @IsOptional()
  @IsEnum(ProductSortBy)
  sortBy: ProductSortBy = ProductSortBy.CREATED_AT;

  @ApiPropertyOptional({
    description: 'Sort direction for the selected field.',
    enum: SortOrder,
    enumName: 'SortOrder',
    example: SortOrder.DESC,
  })
  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder: SortOrder = SortOrder.DESC;
}