import {
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { JwtPayload } from './jwt.strategy';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
    Strategy,
    'jwt-refresh',
) {
    constructor(
        private readonly configService: ConfigService,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
            ignoreExpiration: false,
            passReqToCallback: true,
        });
    }

    async validate(req: Request, payload: JwtPayload) {
        const authHeader = req.get('Authorization');

        if (!authHeader) {
            throw new UnauthorizedException('Missing refresh token');
        }

        const rawRefreshToken = authHeader
            .replace('Bearer', '')
            .trim();

        if (!rawRefreshToken) {
            throw new UnauthorizedException('Invalid refresh token');
        }
        const user = await this.userRepository.findOneBy({
            id: payload.sub,
        });

        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        if (!user.isActive) {
            throw new UnauthorizedException(
                'Your account has been deactivated',
            );
        }
        return {
            ...payload,
            refreshToken: rawRefreshToken,
        };
    }
}
