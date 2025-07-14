import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from '../users/users.module';
import { WishesModule } from '../wishes/wishes.module';
import { Wish } from '../wishes/entities/wishes.entity';
import { WishlistsService } from './wishlists.service';
import { WishlistsController } from './wishlists.controller';
import { Wishlist } from './entities/wishlists.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Wishlist, Wish]),
    UsersModule,
    WishesModule,
  ],
  providers: [WishlistsService],
  controllers: [WishlistsController],
  exports: [WishlistsService],
})
export class WishlistsModule {}
