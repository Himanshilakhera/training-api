import { Type } from 'class-transformer';
import {
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsPositive,
    IsString,
    MinLength,
} from 'class-validator';

export enum ProductCategory {
    ELECTRONICS = 'ELECTRONICS',
    CLOTHING = 'CLOTHING',
    GROCERY = 'GROCERY',
}

export class CreateProductDto {
    @IsString({ message: 'Name must be a string' })
    @IsNotEmpty({ message: 'Name is required and cannot be empty' })
    @MinLength(3, { message: 'Name must be at least 3 characters long' })
    name: string;

    @Type(() => Number)
    @IsNumber({}, { message: 'Price must be a number' })
    @IsPositive({ message: 'Price must be a positive number' })
    @IsNotEmpty({
        message: 'Price is required',
    })
    price: number;

    @IsString()
    @IsOptional()
    description?: string;

    @IsEnum(ProductCategory)
    @IsNotEmpty()
    category: ProductCategory;
}