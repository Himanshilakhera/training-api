import { ApiProperty } from '@nestjs/swagger';

export class DeleteCategoryResponseDto {
  @ApiProperty({
    description: 'Status message returned after deleting a category.',
    example: 'Category deleted successfully',
  })
  message: string;
}
