import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '../../auth/enums/role.enum';

export class UserResponseDto {
  @ApiProperty({
    description: 'Unique identifier of the user.',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'User email address.',
    example: 'john.doe@example.com',
    format: 'email',
  })
  email: string;

  @ApiPropertyOptional({
    description: 'Display name for the user, if available.',
    example: 'John Doe',
    nullable: true,
  })
  name?: string | null;

  @ApiProperty({
    description: 'User role assigned in the application.',
    enum: Role,
    enumName: 'Role',
    example: Role.CUSTOMER,
  })
  role: Role;

  @ApiProperty({
    description: 'Whether the user account is active.',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Date when the user record was created.',
    example: '2026-09-23T12:00:00.000Z',
    type: String,
    format: 'date-time',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Date when the user record was last updated.',
    example: '2026-09-23T12:30:00.000Z',
    type: String,
    format: 'date-time',
  })
  updatedAt: Date;
}
