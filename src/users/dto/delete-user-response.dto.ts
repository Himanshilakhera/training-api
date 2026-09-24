import { ApiProperty } from '@nestjs/swagger';

export class DeleteUserResponseDto {
  @ApiProperty({
    description: 'Status message returned after deleting a user.',
    example: 'User deleted successfully',
  })
  message: string;
}
