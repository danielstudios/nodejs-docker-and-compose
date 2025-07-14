import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';

import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    const secretJWT = configService.get<string>('JWT_SECRET');
    if (!secretJWT) {
      throw new Error('secretJWT is not defined');
    }

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        (req: Request) => req.cookies['jwt'],
      ]),
      secretOrKey: secretJWT,
    });
  }

  async validate(jwtPayload: { sub: number }) {
    const user = await this.usersService.findOne({ id: jwtPayload.sub });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
