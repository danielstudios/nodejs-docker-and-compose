import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { JwtGuard } from '../auth/guards/jwt.guard';
import { User } from '../users/entities/users.entity';
import { CreateOfferDto } from './dto/create-offer.dto';
import { OffersService } from './offers.service';

@Controller('offers')
export class OffersController {
  constructor(private offersService: OffersService) {}

  @UseGuards(JwtGuard)
  @Post()
  create(@Body() createOfferDto: CreateOfferDto, @Req() req: { user: User }) {
    return this.offersService.create(createOfferDto, req.user.id);
  }

  @UseGuards(JwtGuard)
  @Get()
  findAll() {
    return this.offersService.findAll();
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.offersService.findOne({ id });
  }
}
