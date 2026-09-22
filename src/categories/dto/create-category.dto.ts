import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateCategoryDto {
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required and cannot be empty' })
  @MinLength(3, { message: 'Name must be at least 3 characters long' })
  name: string;

  @IsString({ message: 'Slug must be a string' })
  @IsNotEmpty({ message: 'Slug is required and cannot be empty' })
  @MinLength(3, { message: 'Slug must be at least 3 characters long' })
  slug: string;

  @IsString()
  @IsOptional()
  description?: string;
}
