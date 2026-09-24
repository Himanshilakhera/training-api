import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsPositive,
  Max,
} from 'class-validator';
import { Role } from '../../auth/enums/role.enum';

export class GetUsersQueryDto {
  @ApiProperty({
    description: 'Page number for user pagination. Must be a positive integer.',
    type: Number,
    minimum: 1,
    example: 1,
  })
  @Type(() => Number)
  @IsInt({ message: 'page must be an integer' })
  @IsPositive({ message: 'page must be a positive integer' })
  page = 1;

  @ApiProperty({
    description: 'Number of users per page. Must be a positive integer up to 100.',
    type: Number,
    minimum: 1,
    maximum: 100,
    example: 10,
  })
  @Type(() => Number)
  @IsInt({ message: 'limit must be an integer' })
  @IsPositive({ message: 'limit must be a positive integer' })
  @Max(100, { message: 'limit must be 100 or less' })
  limit = 10;

  @ApiPropertyOptional({
    description: 'Optional role filter for users.',
    enum: Role,
    enumName: 'Role',
    example: Role.ADMIN,
  })
  @IsOptional()
  @IsEnum(Role, {
    message: 'role must be one of ADMIN, VENDOR, or CUSTOMER',
  })
  role?: Role;
}
