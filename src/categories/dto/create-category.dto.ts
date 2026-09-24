import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'Category name. Must be a string with at least 3 characters.',
    minLength: 3,
    example: 'Electronics',
  })
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required and cannot be empty' })
  @MinLength(3, { message: 'Name must be at least 3 characters long' })
  name: string;

  @ApiProperty({
    description: 'Category slug. Must be a string with at least 3 characters.',
    minLength: 3,
    example: 'electronics',
  })
  @IsString({ message: 'Slug must be a string' })
  @IsNotEmpty({ message: 'Slug is required and cannot be empty' })
  @MinLength(3, { message: 'Slug must be at least 3 characters long' })
  slug: string;

  @ApiPropertyOptional({
    description: 'Optional category description.',
    example: 'Devices and accessories for everyday use.',
  })
  @IsString()
  @IsOptional()
  description?: string;
}
