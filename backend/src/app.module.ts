import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';

import { UsersModule } from './users/users.module';
import { WishesModule } from './wishes/wishes.module';
import { WishlistsModule } from './wishlists/wishlists.module';
import { OffersModule } from './offers/offers.module';
import { AuthModule } from './auth/auth.module';
import { User } from './users/entities/users.entity';
import { Wish } from './wishes/entities/wishes.entity';
import { Wishlist } from './wishlists/entities/wishlists.entity';
import { Offer } from './offers/entities/offers.entity';
import * as crypto from 'crypto';

if (typeof globalThis.crypto !== 'object') {
  globalThis.crypto = crypto as any;
}

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [
        ConfigModule.forRoot({
          envFilePath: join(__dirname, '../../', '.env'),
          isGlobal: true,
        })
      ],
      inject: [ConfigService],
      useFactory: (configService: ConfigService)=> ({
        type: 'postgres',
        host: configService.get<string>('POSTGRES_HOST', 'localhost'),
        port: configService.get<number>('POSTGRES_PORT', 5432),
        username: configService.get<string>('POSTGRES_USER'),
        password: configService.get<string>('POSTGRES_PASSWORD'),
        database: configService.get<string>('POSTGRES_DB'),
        entities: [User, Wish, Wishlist, Offer],
        synchronize: true,
      }),
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
