import { ApiProperty } from '@nestjs/swagger';

export class ApiErrorResponseDto {
  @ApiProperty({
    description: 'Indicates whether the request was successful.',
    example: false,
  })
  success: boolean;

  @ApiProperty({
    description: 'HTTP status code returned by the request.',
    example: 400,
    type: Number,
  })
  statusCode: number;

  @ApiProperty({
    description: 'UTC timestamp when the error was generated.',
    example: '2026-09-24T10:00:00.000Z',
    type: String,
    format: 'date-time',
  })
  timestamp: string;

  @ApiProperty({
    description: 'Request path that triggered the error.',
    example: '/api/v1/auth/{resource}',
  })
  path: string;

  @ApiProperty({
    description: 'Human-readable error message.',
    example: 'Invalid credentials',
  })
  error: string;
}
