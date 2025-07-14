import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from './users/users.module';
import { WishesModule } from './wishes/wishes.module';
import { WishlistsModule } from './wishlists/wishlists.module';
import { OffersModule } from './offers/offers.module';
import { AuthModule } from './auth/auth.module';
import { User } from './users/entities/users.entity';
import { Wish } from './wishes/entities/wishes.entity';
import { Wishlist } from './wishlists/entities/wishlists.entity';
import { Offer } from './offers/entities/offers.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'student',
      password: 'student',
      database: 'kupipodariday',
      entities: [User, Wish, Wishlist, Offer],
      synchronize: true,
    }),
    ConfigModule.forRoot({
      envFilePath: ['.env.development', '.env'],
    }),
    AuthModule,
    UsersModule,
    WishesModule,
    WishlistsModule,
    OffersModule,
  ],
})
export class AppModule {}
