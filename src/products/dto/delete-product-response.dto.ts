import { ApiProperty } from '@nestjs/swagger';

export class DeleteProductResponseDto {
  @ApiProperty({
    description: 'Status message returned after deleting a product.',
    example: 'Product deleted successfully',
  })
  message: string;
}
