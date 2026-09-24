import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsPositive,
    IsString,
    IsUUID,
    MinLength,
} from 'class-validator';

export class CreateProductDto {
    @ApiProperty({
        description: 'Name of the product. Must be a string with at least 3 characters.',
        minLength: 3,
        example: 'Wireless Noise-Canceling Headphones',
    })
    @IsString({ message: 'Name must be a string' })
    @IsNotEmpty({ message: 'Name is required and cannot be empty' })
    @MinLength(3, { message: 'Name must be at least 3 characters long' })
    name: string;

    @ApiProperty({
        description: 'Product price. Must be greater than 0.',
        type: Number,
        minimum: 0.01,
        example: 199.99,
    })
    @Type(() => Number)
    @IsNumber({}, { message: 'Price must be a number' })
    @IsPositive({ message: 'Price must be a positive number' })
    @IsNotEmpty({
        message: 'Price is required',
    })
    price: number;

    @ApiPropertyOptional({
        description: 'Optional product description.',
        example: 'Bluetooth over-ear headphones with active noise cancellation and 30-hour battery life.',
    })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiPropertyOptional({
        description: 'Optional UUID of the category to associate with this product.',
        format: 'uuid',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    @IsUUID()
    @IsOptional()
    categoryId?: string;

    @ApiPropertyOptional({
        description: 'Optional stock quantity for the product.',
        type: Number,
        example: 25,
    })
    @Type(() => Number)
    @IsOptional()
    stock?: number;
}