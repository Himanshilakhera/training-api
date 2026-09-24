import { ApiProperty } from '@nestjs/swagger';
import { LoginUserResponseDto } from './login-user-response.dto';

export class LoginResponseDto {
  @ApiProperty({
    description: 'HTTP response message describing the login result.',
    example: 'Login successful',
  })
  message: string;

  @ApiProperty({
    description: 'Authenticated user summary returned after a successful login.',
    type: () => LoginUserResponseDto,
  })
  user: LoginUserResponseDto;

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
