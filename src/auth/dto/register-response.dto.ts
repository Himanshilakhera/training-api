import { ApiProperty } from '@nestjs/swagger';

export class RegisterResponseDto {
  @ApiProperty({
    description: 'HTTP response message describing the registration result.',
    example: 'Registration successful',
  })
  message: string;

  @ApiProperty({
    description: 'Unique identifier of the created user.',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Email address used for the new account.',
    example: 'john.doe@example.com',
    format: 'email',
  })
  email: string;

  @ApiProperty({
    description: 'JWT access token used to authenticate subsequent requests.',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwicm9sZSI6ImN1c3RvbWVyIn0.signature',
  })
  accessToken: string;

  @ApiProperty({
    description: 'JWT refresh token used to obtain a new access token.',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwicm9sZSI6ImN1c3RvbWVyIn0.refresh-signature',
  })
  refreshToken: string;
}
