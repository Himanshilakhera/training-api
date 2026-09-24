import { ApiProperty } from '@nestjs/swagger';

export class ApiResponseWrapper<T> {
  @ApiProperty({
    description: 'Indicates whether the request was successful.',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'HTTP status code returned by the request.',
    example: 200,
    type: Number,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Response payload returned by the endpoint.',
  })
  data: T;
}
