import { Response } from 'express';
import { Controller, Post, UseGuards, Body, Res } from '@nestjs/common';

import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { SigninUserDto } from './dto/sign-in-user.dto';
import { plainToInstance } from 'class-transformer';
import { UserProfileResponseDto } from 'src/users/dto/user-profile-response.dto';

@Controller()
export class AuthController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('signin')
  async signin(
    @Body() signinUserDto: SigninUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const token = await this.authService.signin(signinUserDto);
    response.cookie('jwt', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      domain: 'danielkupi.students.nomorepartiessbs.ru',
      maxAge: 36000000,
    });

    return { access_token: token };
  }

  @Post('signup')
  async signup(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const createdUser = await this.usersService.create(createUserDto);
    const token = this.authService.auth(createdUser);
    response.cookie('jwt', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      domain: 'danielkupi.students.nomorepartiessbs.ru',
      maxAge: 36000000,
    });

    return plainToInstance(UserProfileResponseDto, createdUser);
  }
}
