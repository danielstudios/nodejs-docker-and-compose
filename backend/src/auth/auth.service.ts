import * as bcrypt from 'bcrypt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from '../users/users.service';
import { User } from '../users/entities/users.entity';
import { SigninUserDto } from './dto/sign-in-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UsersService,
  ) {}

  auth(user: Partial<User>) {
    const payload = { username: user.username, sub: user.id };

    return this.jwtService.sign(payload);
  }

  async validatePassword(username: string, password: string) {
    const user = await this.userService.findOne({ username });
    if (!user) {
      throw new UnauthorizedException();
    }
    const isMatched = await bcrypt.compare(password, user.password);
    if (isMatched) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;

      return result;
    }

    return null;
  }

  async signin(signinUserDto: SigninUserDto) {
    const user = await this.validatePassword(
      signinUserDto.username,
      signinUserDto.password,
    );

    if (!user) {
      throw new UnauthorizedException();
    }

    return this.auth(user);
  }
}
