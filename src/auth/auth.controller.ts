import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ApiErrorResponse } from '../common/swagger/api-error-response';
import { ApiSuccessResponse } from '../common/swagger/api-success-response';
import { User } from '../users/entities/user.entity';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { LoginResponseDto } from './dto/login-response.dto';
import { LoginDto } from './dto/login.dto';
import { LogoutResponseDto } from './dto/logout-response.dto';
import { RefreshResponseDto } from './dto/refresh-response.dto';
import { RegisterDto } from './dto/register.dto';
import { RegisterResponseDto } from './dto/register-response.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { UserResponseDto } from '../users/dto/user-response.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  @ApiOperation({
    summary: 'Register a new user',
    description:
      'Creates a new user account and returns the generated authentication tokens.',
  })
  @ApiBody({ type: RegisterDto })
  @ApiSuccessResponse(RegisterResponseDto, {
    status: 201,
    description: 'User registered successfully.',
  })
  @ApiErrorResponse(
    400,
    'Validation failed for the registration payload.',
    'Validation failed',
  )
  @ApiErrorResponse(
    409,
    'A user with this email address already exists.',
    'Email is already registered',
  )
  async register(@Body() registerDto: RegisterDto) {
    const result = await this.authService.register(registerDto);

    return {
      message: 'Registration successful',
      ...result,
    };
  }

  @Post('login')
  @ApiOperation({
    summary: 'Log in an existing user',
    description:
      'Authenticates a user with email and password and returns access and refresh tokens.',
  })
  @ApiBody({ type: LoginDto })
  @ApiSuccessResponse(LoginResponseDto, {
    status: 201,
    description: 'User authenticated successfully.',
  })
  @ApiErrorResponse(
    400,
    'Validation failed for the login payload.',
    'Email and password are required',
  )
  @ApiErrorResponse(
    401,
    'Invalid credentials, deactivated account, or unauthenticated login attempt.',
    'Invalid email or password',
  )
  async login(@Body() loginDto: LoginDto) {
    const result = await this.authService.login(loginDto);

    return {
      message: 'Login successful',
      ...result,
    };
  }

  @Post('refresh')
  @UseGuards(JwtRefreshGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Refresh access tokens',
    description:
      'Validates the refresh token and issues a new pair of JWT tokens for the authenticated user.',
  })
  @ApiSuccessResponse(RefreshResponseDto, {
    status: 200,
    description: 'Tokens refreshed successfully.',
  })
  @ApiErrorResponse(
    401,
    'Refresh token is missing, invalid, expired, or the user is unauthorized.',
    'Invalid token',
  )
  @ApiErrorResponse(
    403,
    'Refresh token verification failed for the current user.',
    'Refresh token verification failed',
  )
  async refresh(
    @CurrentUser() user: { sub: string; refreshToken: string },
  ) {
    const tokens = await this.authService.refreshTokens(
      user.sub,
      user.refreshToken,
    );

    return {
      message: 'Token refreshed successfully',
      ...tokens,
    };
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Log out the current user',
    description:
      'Revokes the current refresh token state for the authenticated user and confirms logout success.',
  })
  @ApiSuccessResponse(LogoutResponseDto, {
    status: 201,
    description: 'User logged out successfully.',
  })
  @ApiErrorResponse(
    401,
    'Authentication is missing or invalid for this request.',
    'Unauthorized',
  )
  async logout(@CurrentUser() user: Omit<User, 'password'>) {
    return this.authService.logout(user.id);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get current authenticated user',
    description:
      'Returns the authenticated user profile without exposing sensitive password information.',
  })
  @ApiSuccessResponse(UserResponseDto, {
    status: 200,
    description: 'Authenticated user retrieved successfully.',
  })
  @ApiErrorResponse(
    401,
    'Authentication is missing, invalid, expired, or the user is inactive.',
    'Unauthorized',
  )
  getMe(@CurrentUser() user: Omit<User, 'password'>) {
    return user;
  }
}