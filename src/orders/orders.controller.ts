import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiErrorResponse } from '../common/swagger/api-error-response';
import { ApiSuccessResponse } from '../common/swagger/api-success-response';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderResponseDto } from './dto/order-response.dto';
import { OrdersService } from './orders.service';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({
    summary: 'Create an order',
    description: 'Creates a new order from the selected items and validates stock availability before saving.',
  })
  @ApiSuccessResponse(OrderResponseDto, {
    status: 201,
    description: 'Order created successfully.',
  })
  @ApiErrorResponse(400, 'Order validation failed or stock is insufficient.', 'Insufficient stock for product')
  @ApiErrorResponse(404, 'Referenced product was not found.', 'Product not found')
  create(@Body() createOrderDto: CreateOrderDto): Promise<OrderResponseDto> {
    return this.ordersService.createOrder(createOrderDto) as Promise<OrderResponseDto>;
  }
}