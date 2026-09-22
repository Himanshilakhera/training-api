import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

import { User } from '../users/entities/user.entity';
import { Role } from './enums/role.enum';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: { signAsync: jest.Mock };
  let userRepository: { update: jest.Mock };

  beforeEach(async () => {
    jwtService = {
      signAsync: jest.fn(),
    };

    userRepository = {
      update: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: userRepository,
        },
        {
          provide: JwtService,
          useValue: jwtService,
        },
        {
          provide: ConfigService,
          useValue: {
            getOrThrow: jest.fn((key: string) => {
              const values: Record<string, string> = {
                JWT_ACCESS_SECRET: 'access-secret',
                JWT_REFRESH_SECRET: 'refresh-secret',
                JWT_ACCESS_EXPIRATION: '15m',
                JWT_REFRESH_EXPIRATION: '7d',
              };

              return values[key];
            }),
            get: jest.fn((key: string, defaultValue?: string) => {
              const values: Record<string, string> = {
                JWT_ACCESS_SECRET: 'access-secret',
                JWT_REFRESH_SECRET: 'refresh-secret',
                JWT_ACCESS_EXPIRATION: '15m',
                JWT_REFRESH_EXPIRATION: '7d',
              };

              return values[key] ?? defaultValue;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should generate access and refresh tokens and store only the hashed refresh token', async () => {
    jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashed-refresh-token' as never);
    jwtService.signAsync
      .mockResolvedValueOnce('access-token')
      .mockResolvedValueOnce('refresh-token');

    const result = await service.generateTokens(
      42,
      'user@example.com',
      Role.CUSTOMER,
    );

    expect(result).toEqual({
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    });

    expect(jwtService.signAsync).toHaveBeenNthCalledWith(
      1,
      {
        sub: 42,
        email: 'user@example.com',
        role: Role.CUSTOMER,
      },
      {
        secret: 'access-secret',
        expiresIn: '15m',
      },
    );

    expect(jwtService.signAsync).toHaveBeenNthCalledWith(
      2,
      {
        sub: 42,
        email: 'user@example.com',
        role: Role.CUSTOMER,
      },
      {
        secret: 'refresh-secret',
        expiresIn: '7d',
      },
    );

    expect(bcrypt.hash).toHaveBeenCalledWith('refresh-token', 10);
    expect(userRepository.update).toHaveBeenCalledWith(
      42,
      { currentHashedRefreshToken: 'hashed-refresh-token' },
    );
  });
});
