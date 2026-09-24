import { ApiProperty } from '@nestjs/swagger';

export class CategoryResponseDto {
  @ApiProperty({
    description: 'Unique category identifier.',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Category display name.',
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

  @ApiProperty({
    description: 'URL-friendly category slug.',
    example: 'electronics',
  })
  slug: string;
}

export class CategoriesListResponseDto extends Array<CategoryResponseDto> {}
