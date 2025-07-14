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

import { JwtGuard } from '../auth/guards/jwt.guard';
import { User } from '../users/entities/users.entity';
import { UsersService } from '../users/users.service';
import { WishesService } from '../wishes/wishes.service';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';

@Controller('wishlists')
export class WishlistsController {
  constructor(
    private wishlistsService: WishlistsService,
    private usersService: UsersService,
    private wishesService: WishesService,
  ) {}

  @UseGuards(JwtGuard)
  @Get()
  findAll() {
    return this.wishlistsService.findAll();
  }

  @UseGuards(JwtGuard)
  @Post()
  create(
    @Body() createWishlistDto: CreateWishlistDto,
    @Req() req: { user: User },
  ) {
    return this.wishlistsService.create(req.user.id, createWishlistDto);
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.wishlistsService.findOne({ id });
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateWishlistDto: UpdateWishlistDto,
    @Req() req: { user: User },
  ) {
    await this.wishlistsService.updateOne(id, req.user.id, updateWishlistDto);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  removeOne(@Param('id') id: number, @Req() req: { user: User }) {
    return this.wishlistsService.removeWishlist(id, req.user.id);
  }
}
