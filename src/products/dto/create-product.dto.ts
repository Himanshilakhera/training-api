import { Type } from 'class-transformer';
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

    @IsUUID()
    @IsOptional()
    categoryId?: string;

    @Type(() => Number)
    @IsOptional()
    stock?: number;
}