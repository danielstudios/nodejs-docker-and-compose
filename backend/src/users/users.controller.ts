import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';

import { UsersService } from './users.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { User } from './entities/users.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindUsersDto } from './dto/find-users.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtGuard)
  @Get('me')
  fidnOwn(@Req() req: { user: User }) {
    return this.usersService.findOwn(req.user.id);
  }

  @UseGuards(JwtGuard)
  @Patch('me')
  async update(
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: { user: User },
  ) {
    await this.usersService.updateOne(req.user.id, updateUserDto);
    return this.usersService.findOneWithoutPassword({ id: req.user.id });
  }

  @UseGuards(JwtGuard)
  @Get('me/wishes')
  getOwnWishes(@Req() req: { user: User }) {
    return this.usersService.findUserWishes(req.user.id);
  }

  @UseGuards(JwtGuard)
  @Get('find')
  findMany(@Body() findUsersDto: FindUsersDto) {
    return this.usersService.findMany(findUsersDto.query);
  }

  @UseGuards(JwtGuard)
  @Get(':username')
  findOne(@Param('username') username: string) {
    return this.usersService.findOneWithoutPasswordAndEmail({
      username,
    });
  }
}
