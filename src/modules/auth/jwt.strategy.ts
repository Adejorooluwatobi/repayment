import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET') || 'your_super_secret_jwt_key_change_in_production',
    });
  }

  async validate(payload: { sub: string; email: string; role: string; username: string}) {
    const role = payload.role?.toUpperCase();
    return {
      id: payload.sub,
      email: payload.email || payload.username,
      role: role 
    };
  }
}