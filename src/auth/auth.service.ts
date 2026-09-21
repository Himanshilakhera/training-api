import {
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { StringValue } from 'ms';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from '../users/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Role } from './enums/role.enum';
import { createHash } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) { }

  private hashRefreshToken(refreshToken: string): string {
    return createHash('sha256')
      .update(refreshToken)
      .digest('hex');
  }

  async generateTokens(
    userId: number | string,
    email: string,
    role: Role,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = {
      sub: userId,
      email,
      role,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
        expiresIn: this.configService.getOrThrow<string>(
          'JWT_ACCESS_EXPIRATION',
        ) as StringValue,
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.getOrThrow<string>(
          'JWT_REFRESH_EXPIRATION',
        ) as StringValue,
      }),
    ]);
    const refreshTokenHash = this.hashRefreshToken(refreshToken);
    const hashedRefreshToken = await bcrypt.hash(
      refreshTokenHash,
      10,
    );

    // await this.updateRefreshToken(userId, hashedRefreshToken);

    // const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    await this.updateRefreshToken(userId, hashedRefreshToken);

    return {
      accessToken,
      refreshToken,
    };
  }

  async updateRefreshToken(
    userId: number | string,
    hashedToken: string,
  ): Promise<void> {
    await this.userRepository.update(userId, {
      currentHashedRefreshToken: hashedToken,
    });
  }

  async refreshTokens(
    userId: number | string,
    incomingRefreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.userRepository.findOneBy({
      id: userId as any,
    });


    if (!user || !user.currentHashedRefreshToken) {
      throw new ForbiddenException('Access Denied');
    }

    // const isRefreshTokenValid = await bcrypt.compare(
    //   incomingRefreshToken,
    //   user.currentHashedRefreshToken,
    // );

    const refreshTokenHash =
      this.hashRefreshToken(incomingRefreshToken);

    const isRefreshTokenValid = await bcrypt.compare(
      refreshTokenHash,
      user.currentHashedRefreshToken,
    );

    console.log('Incoming refresh token:', incomingRefreshToken);
    console.log('Stored hash:', user.currentHashedRefreshToken);
    console.log('Is token valid:', isRefreshTokenValid);

    if (!isRefreshTokenValid) {
      throw new ForbiddenException('Invalid refresh token');
    }

    return this.generateTokens(user.id, user.email, user.role);
  }

  async logout(userId: number | string): Promise<{ success: boolean; message: string }> {
    await this.userRepository.update(userId, {
      currentHashedRefreshToken: null,
    });

    return {
      success: true,
      message: 'Successfully logged out',
    };
  }

  async register(registerDto: RegisterDto) {
    const { email, password } = registerDto;

    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException(
        'User with this email already exists',
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      role: Role.CUSTOMER,
    });

    const savedUser = await this.userRepository.save(user);
    const tokens = await this.generateTokens(
      savedUser.id,
      savedUser.email,
      savedUser.role,
    );

    return {
      id: savedUser.id,
      email: savedUser.email,
      ...tokens,
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const tokens = await this.generateTokens(
      user.id,
      user.email,
      user.role,
    );

    return {
      user: {
        id: user.id,
        email: user.email,
      },
      ...tokens,
    };
  }
}
