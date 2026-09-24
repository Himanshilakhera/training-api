import { ApiProperty } from '@nestjs/swagger';

export class LogoutResponseDto {
  @ApiProperty({
    description: 'Indicates whether the logout request succeeded.',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'HTTP response message describing the logout result.',
    example: 'Successfully logged out',
  })
  message: string;
}
