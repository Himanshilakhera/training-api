import { ApiProperty } from '@nestjs/swagger';
import { ProductSummaryResponseDto } from '../../products/dto/product-response.dto';

export class OrderItemResponseDto {
  @ApiProperty({
    description: 'Unique order item identifier.',
    example: '22222222-2222-2222-2222-222222222222',
  })
  id: string;

  @ApiProperty({
    description: 'Product information for the ordered item.',
    type: () => ProductSummaryResponseDto,
  })
  product: ProductSummaryResponseDto;

  @ApiProperty({
    description: 'Quantity of the product ordered.',
    example: 2,
    type: Number,
  })
  quantity: number;

  @ApiProperty({
    description: 'Unit price for the product at the time of ordering.',
    example: 99.99,
    type: Number,
  })
  unitPrice: number;
}

export class OrderResponseDto {
  @ApiProperty({
    description: 'Unique order identifier.',
    example: '33333333-3333-3333-3333-333333333333',
  })
  id: string;

  @ApiProperty({
    description: 'Total order amount.',
    example: 199.98,
    type: Number,
  })
  totalAmount: number;

  @ApiProperty({
    description: 'Order status.',
    example: 'PENDING',
  })
  status: string;

  @ApiProperty({
    description: 'Items included in this order.',
    type: () => [OrderItemResponseDto],
  })
  items: OrderItemResponseDto[];

  @ApiProperty({
    description: 'Date when the order was created.',
    example: '2026-09-24T09:00:00.000Z',
    type: String,
    format: 'date-time',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Date when the order was last updated.',
    example: '2026-09-24T09:05:00.000Z',
    type: String,
    format: 'date-time',
  })
  updatedAt: Date;
}
