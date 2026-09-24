import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from './user-response.dto';

export class UserListMetaResponseDto {
  @ApiProperty({
    description: 'Total number of users matching the current filter.',
    example: 42,
    type: Number,
  })
  totalItems: number;

  @ApiProperty({
    description: 'Number of users in the current page.',
    example: 10,
    type: Number,
  })
  itemCount: number;

  @ApiProperty({
    description: 'Maximum number of users per page.',
    example: 10,
    type: Number,
  })
  itemsPerPage: number;

  @ApiProperty({
    description: 'Total number of pages.',
    example: 5,
    type: Number,
  })
  totalPages: number;

  @ApiProperty({
    description: 'Requested page number.',
    example: 1,
    type: Number,
  })
  currentPage: number;
}

export class UserListResponseDto {
  @ApiProperty({
    description: 'Users returned for the current page.',
    type: () => [UserResponseDto],
  })
  items: UserResponseDto[];

  @ApiProperty({
    description: 'Pagination metadata for the user list.',
    type: () => UserListMetaResponseDto,
  })
  meta: UserListMetaResponseDto;
}
