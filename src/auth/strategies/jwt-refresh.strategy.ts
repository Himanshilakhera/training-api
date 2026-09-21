import {
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { JwtPayload } from './jwt.strategy';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
    Strategy,
    'jwt-refresh',
) {
    constructor(private readonly configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
            ignoreExpiration: false,
            passReqToCallback: true,
        });
    }

    validate(req: Request, payload: JwtPayload) {
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
        return {
            ...payload,
            refreshToken: rawRefreshToken,
        };
    }
}
