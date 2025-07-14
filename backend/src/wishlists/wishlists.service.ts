import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { WishesService } from '../wishes/wishes.service';
import { UsersService } from '../users/users.service';
import { Wish } from '../wishes/entities/wishes.entity';
import { Wishlist } from './entities/wishlists.entity';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class WishlistsService {
  constructor(
    private dataSource: DataSource,

    @InjectRepository(Wishlist)
    private wishlistRepository: Repository<Wishlist>,

    private usersService: UsersService,
    private wishesService: WishesService,
  ) {}

  async create(userId: number, createWishlistDto: CreateWishlistDto) {
    const user = await this.usersService.findOneWithoutPasswordAndEmail({
      id: userId,
    });
    const items = await this.wishesService.findByIds(createWishlistDto.itemsId);
    const newWishlist = {
      name: createWishlistDto.name,
      image: createWishlistDto.image,
      owner: user,
      items: items,
    };
    const createdWishlist = await this.wishlistRepository.save(newWishlist);

    return plainToInstance(Wishlist, {
      ...createdWishlist,
      owner: user,
    });
  }

  async findOne(query: Partial<Wishlist>) {
    const wishlist = await this.wishlistRepository.findOne({
      where: query,
      relations: ['owner', 'items'],
    });
    if (!wishlist) {
      throw new NotFoundException();
    }

    return plainToInstance(Wishlist, wishlist);
  }

  async updateOne(
    id: number,
    userId: number,
    updateWishlistDto: UpdateWishlistDto,
  ) {
    const wishlistForUpdate = await this.findOne({ id });
    if (userId !== wishlistForUpdate?.owner.id) {
      throw new ForbiddenException();
    }

    await this.wishlistRepository.update({ id }, updateWishlistDto);
    const updatedWishlist = await this.findOne({ id });

    return plainToInstance(Wishlist, updatedWishlist);
  }

  removeOne(id: number) {
    return this.wishlistRepository.delete({ id });
  }

  findAll() {
    return plainToInstance(
      Wishlist,
      this.wishlistRepository.find({
        relations: ['owner', 'items'],
      }),
    );
  }

  async removeWishlist(id: number, userId: number) {
    const wishlistForRemove = await this.findOne({ id });
    if (userId !== wishlistForRemove?.owner.id) {
      throw new ForbiddenException();
    }
    if (!wishlistForRemove) {
      throw new NotFoundException();
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager
        .createQueryBuilder()
        .update(Wish)
        .set({ wishlist: null })
        .where('wishlistId = :id', { id })
        .execute();
      await queryRunner.manager.delete(Wishlist, id);

      await queryRunner.commitTransaction();
      return wishlistForRemove;
    } catch {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException();
    } finally {
      await queryRunner.release();
    }
  }
}
