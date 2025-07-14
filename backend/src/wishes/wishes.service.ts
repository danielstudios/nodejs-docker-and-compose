import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, In } from 'typeorm';

import { UsersService } from '../users/users.service';
import { Offer } from '../offers/entities/offers.entity';
import { Wish } from './entities/wishes.entity';
import { CreateWishDto } from './dto/create-wish.dto';
import { plainToInstance } from 'class-transformer';
import { UpdateWishDto } from './dto/update-wish.dto';

@Injectable()
export class WishesService {
  constructor(
    private dataSource: DataSource,

    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,

    private usersService: UsersService,
  ) {}

  async create(createWishDto: CreateWishDto, userId: number) {
    const user = await this.usersService.findOneWithoutPasswordAndEmail({
      id: userId,
    });
    const wish = { ...createWishDto, raised: 0, copied: 0, owner: user };
    const newWish = await this.wishRepository.save(wish);

    const createdWish = await this.wishRepository.findOne({
      where: { id: newWish.id },
      relations: ['owner'],
    });

    return plainToInstance(Wish, {
      ...createdWish,
      owner: user,
    });
  }

  async copy(id: number) {
    const wishForCopy = await this.findOne({ id });
    if (!wishForCopy) {
      throw new NotFoundException();
    }
    const newWish = {
      name: wishForCopy.name,
      link: wishForCopy.link,
      image: wishForCopy.image,
      price: wishForCopy.price,
      description: wishForCopy.description,
      raised: 0,
      copied: 0,
      owner: wishForCopy.owner,
    };

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const createdWish = await queryRunner.manager.save(Wish, newWish);
      await queryRunner.manager.update(
        Wish,
        { id: wishForCopy.id },
        {
          copied: (wishForCopy.copied += 1),
        },
      );

      await queryRunner.commitTransaction();

      return plainToInstance(
        Wish,
        this.wishRepository.findOne({
          where: { id: createdWish.id },
          relations: ['owner'],
        }),
      );
    } catch {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException();
    } finally {
      await queryRunner.release();
    }
  }

  async findOne(query: Partial<Wish>) {
    const wish = await this.wishRepository.findOne({
      where: query,
      relations: ['owner'],
    });
    if (!wish) {
      throw new NotFoundException();
    }

    return plainToInstance(Wish, wish);
  }

  async updateOne(
    wishId: number,
    userId: number,
    updateWishDto: UpdateWishDto,
  ) {
    const wishForUpdate = await this.findOne({ id: wishId });
    if (userId !== wishForUpdate?.owner.id) {
      throw new ForbiddenException();
    }
    if (wishForUpdate.raised !== 0 && updateWishDto.price !== undefined) {
      throw new BadRequestException();
    }
    await this.wishRepository.update({ id: wishId }, updateWishDto);
    const updatedWish = await this.findOne({ id: wishId });

    return plainToInstance(Wish, updatedWish);
  }

  update(query: Partial<Wish>, wish: Partial<Wish> | { wishlist: undefined }) {
    return this.wishRepository.update(query, wish);
  }

  async removeOne(id: number, userId: number) {
    const wishForDelete = await this.findOne({ id });
    if (userId !== wishForDelete?.owner.id) {
      throw new ForbiddenException();
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager
        .createQueryBuilder()
        .update(Offer)
        .set({ item: null })
        .where('itemId = :id', { id })
        .execute();
      await queryRunner.manager.delete(Wish, id);
      await queryRunner.commitTransaction();
      return plainToInstance(Wish, wishForDelete);
    } catch {
      await queryRunner.rollbackTransaction();
      return false;
    } finally {
      await queryRunner.release();
    }
  }

  findLast() {
    return this.wishRepository.find({
      relations: ['owner'],
      order: { createdAt: 'DESC' },
      take: 40,
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        name: true,
        link: true,
        image: true,
        price: true,
        raised: true,
        description: true,
        copied: true,
        owner: {
          id: true,
          createdAt: true,
          updatedAt: true,
          username: true,
          about: true,
          avatar: true,
        },
      },
    });
  }

  findTop() {
    return this.wishRepository.find({
      relations: ['owner'],
      order: { copied: 'DESC' },
      take: 20,
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        name: true,
        link: true,
        image: true,
        price: true,
        raised: true,
        description: true,
        copied: true,
        owner: {
          id: true,
          createdAt: true,
          updatedAt: true,
          username: true,
          about: true,
          avatar: true,
        },
      },
    });
  }

  findByIds(itemsId: number[]) {
    return this.wishRepository.find({
      where: {
        id: In(itemsId),
      },
    });
  }
}
