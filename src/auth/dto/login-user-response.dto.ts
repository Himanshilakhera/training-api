import { ApiProperty } from '@nestjs/swagger';

export class LoginUserResponseDto {
  @ApiProperty({
    description: 'Unique identifier of the authenticated user.',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Email address of the authenticated user.',
    example: 'john.doe@example.com',
    format: 'email',
  })
  email: string;
}
