import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';

import { User } from '../../users/entities/user.entity';
import { Role } from '../enums/role.enum';

export interface JwtPayload {
  sub: string;
  email: string;
  role: Role;
  iat?: number; //Issued At
  exp?: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
    });
  }

  async validate(
    payload: JwtPayload,
  ): Promise<Omit<User, 'password'> & { passwordHash?: string }> {
    const user = await this.userRepository.findOneBy({
      id: payload.sub,
    });

    const isInactive =
      !!user &&
      'isActive' in user &&
      (user as User & { isActive?: boolean }).isActive === false;

    if (!user || isInactive) {
      throw new UnauthorizedException('User not found or inactive');
    }

    if (payload.role && user.role !== payload.role) {
      throw new UnauthorizedException('Token role mismatch');
    }

    const { password, passwordHash, ...sanitizedUser } = user as User & {
      passwordHash?: string;
    };

    return sanitizedUser;
  }
}