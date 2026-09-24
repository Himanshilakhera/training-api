import {
  Body,
  Controller,
  Delete,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { ApiErrorResponse } from '../common/swagger/api-error-response';
import { ApiSuccessResponse } from '../common/swagger/api-success-response';
import { DeleteUserResponseDto } from './dto/delete-user-response.dto';
import { UserResponseDto } from './dto/user-response.dto';
import type { CreateUserWithProfileInput } from './users.service';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a user with profile',
    description: 'Creates a user together with their profile details.',
  })
  @ApiSuccessResponse(UserResponseDto, {
    status: 201,
    description: 'User created successfully.',
  })
  @ApiErrorResponse(400, 'Request validation failed.', 'Invalid user payload')
  create(
    @Body() input: CreateUserWithProfileInput,
  ): Promise<UserResponseDto> {
    return this.usersService.createWithProfile(input) as Promise<UserResponseDto>;
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a user',
    description: 'Deletes a user by their UUID.',
  })
  @ApiParam({
    name: 'id',
    description: 'User ID to delete.',
    type: String,
    format: 'uuid',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiSuccessResponse(DeleteUserResponseDto, {
    status: 200,
    description: 'User deleted successfully.',
  })
  @ApiErrorResponse(404, 'User not found.', 'User not found')
  remove(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ message: string }> {
    return this.usersService.remove(id);
  }
}
