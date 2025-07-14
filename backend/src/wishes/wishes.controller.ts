import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { User } from '../users/entities/users.entity';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { CreateWishDto } from './dto/create-wish.dto';
import { WishesService } from './wishes.service';
import { UpdateWishDto } from './dto/update-wish.dto';

@Controller('wishes')
export class WishesController {
  constructor(private wishesService: WishesService) {}

  @UseGuards(JwtGuard)
  @Post()
  create(@Body() createWishDto: CreateWishDto, @Req() req: { user: User }) {
    return this.wishesService.create(createWishDto, req.user.id);
  }

  @Get('last')
  findLast() {
    return this.wishesService.findLast();
  }

  @Get('top')
  findTop() {
    return this.wishesService.findTop();
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.wishesService.findOne({ id });
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateWishDto: UpdateWishDto,
    @Req() req: { user: User },
  ) {
    return this.wishesService.updateOne(id, req.user.id, updateWishDto);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  removeOne(@Param('id') id: number, @Req() req: { user: User }) {
    return this.wishesService.removeOne(id, req.user.id);
  }

  @UseGuards(JwtGuard)
  @Post(':id/copy')
  copyWish(@Param('id') id: number) {
    return this.wishesService.copy(id);
  }
}
