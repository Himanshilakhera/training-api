import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsPositive,
  Max,
} from 'class-validator';
import { Role } from '../../auth/enums/role.enum';

export class GetUsersQueryDto {
  @Type(() => Number)
  @IsInt({ message: 'page must be an integer' })
  @IsPositive({ message: 'page must be a positive integer' })
  page = 1;

  @Type(() => Number)
  @IsInt({ message: 'limit must be an integer' })
  @IsPositive({ message: 'limit must be a positive integer' })
  @Max(100, { message: 'limit must be 100 or less' })
  limit = 10;

  @IsOptional()
  @IsEnum(Role, {
    message: 'role must be one of ADMIN, VENDOR, or CUSTOMER',
  })
  role?: Role;
}
