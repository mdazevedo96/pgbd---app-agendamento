import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') ?? '',
    });

    if (!this.configService.get('JWT_SECRET')) {
      throw new Error('Variável JWT_SECRET não definida no .env');
    }
  }

  async validate(payload: any) {
    return {
      id: payload.sub,
      nome: payload.nome,
      nivel: payload.nivel,
    };
  }
}
