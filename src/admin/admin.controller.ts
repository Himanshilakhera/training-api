import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ApiErrorResponse } from '../common/swagger/api-error-response';
import { ApiSuccessResponse } from '../common/swagger/api-success-response';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AdminService } from './admin.service';
import { GetUsersQueryDto } from './dto/get-users-query.dto';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';
import { UserListResponseDto } from '../users/dto/user-list-response.dto';
import { UserResponseDto } from '../users/dto/user-response.dto';

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'List users for admin review',
    description:
      'Returns a paginated list of users with optional filtering by role. Requires admin authentication.',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number for pagination. Must be a positive integer.',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of records per page. Must be a positive integer up to 100.',
    example: 10,
  })
  @ApiQuery({
    name: 'role',
    required: false,
    enum: Role,
    enumName: 'Role',
    description: 'Optional role filter for returned users.',
    example: Role.ADMIN,
  })
  @ApiSuccessResponse(UserListResponseDto, {
    status: 200,
    description: 'Users retrieved successfully.',
  })
  @ApiErrorResponse(400, 'Query validation failed for page, limit, or role.', 'Invalid query parameters')
  @ApiErrorResponse(401, 'Authentication is missing or invalid.', 'Unauthorized')
  @ApiErrorResponse(403, 'The current user is not authorized as an admin.', 'Forbidden resource')
  getUsers(@Query() query: GetUsersQueryDto) {
    return this.adminService.getUsers(query);
  }

  @Patch('users/:id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Update a user account status',
    description:
      'Updates the active/inactive status of a user account. Requires admin authentication.',
  })
  @ApiParam({
    name: 'id',
    description: 'The UUID of the user whose status will be updated.',
    type: String,
    format: 'uuid',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiSuccessResponse(UserResponseDto, {
    status: 200,
    description: 'User status updated successfully.',
  })
  @ApiErrorResponse(400, 'Request validation failed for the request body.', 'Invalid status payload')
  @ApiErrorResponse(401, 'Authentication is missing or invalid.', 'Unauthorized')
  @ApiErrorResponse(403, 'The current user is not authorized as an admin.', 'Forbidden resource')
  @ApiErrorResponse(404, 'User not found.', 'User not found')
  updateUserStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserStatusDto: UpdateUserStatusDto,
  ) {
    return this.adminService.updateUserStatus(id, updateUserStatusDto.isActive);
  }
}
