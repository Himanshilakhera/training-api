import { ApiProperty } from '@nestjs/swagger';

export class RefreshResponseDto {
  @ApiProperty({
    description: 'HTTP response message describing the token refresh result.',
    example: 'Token refreshed successfully',
  })
  message: string;

  @ApiProperty({
    description: 'New JWT access token issued after refreshing the session.',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwicm9sZSI6ImN1c3RvbWVyIn0.new-access-signature',
  })
  accessToken: string;

  @ApiProperty({
    description: 'New JWT refresh token issued after refreshing the session.',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwicm9sZSI6ImN1c3RvbWVyIn0.new-refresh-signature',
  })
  refreshToken: string;
}
