import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from '../users/users.module';
import { WishesModule } from '../wishes/wishes.module';
import { Wish } from '../wishes/entities/wishes.entity';
import { OffersService } from './offers.service';
import { OffersController } from './offers.controller';
import { Offer } from './entities/offers.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Offer, Wish]), UsersModule, WishesModule],
  providers: [OffersService],
  controllers: [OffersController],
  exports: [OffersService],
})
export class OffersModule {}
