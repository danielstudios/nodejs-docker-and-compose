import { DataSource, Repository } from 'typeorm';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { WishesService } from '../wishes/wishes.service';
import { UsersService } from '../users/users.service';
import { Offer } from './entities/offers.entity';
import { CreateOfferDto } from './dto/create-offer.dto';
import { Wish } from 'src/wishes/entities/wishes.entity';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class OffersService {
  constructor(
    private dataSource: DataSource,

    @InjectRepository(Offer)
    private offerRepository: Repository<Offer>,

    private usersService: UsersService,
    private wishesService: WishesService,
  ) {}

  async create(createOfferDto: CreateOfferDto, userId: number) {
    const user = await this.usersService.findOneWithoutPasswordAndEmail({
      id: userId,
    });
    const wish = await this.wishesService.findOne({
      id: createOfferDto.itemId,
    });

    if (!wish) {
      throw new NotFoundException();
    }
    if (createOfferDto.amount > wish.price - wish.raised) {
      throw new BadRequestException();
    }

    const newOffer = {
      amount: createOfferDto.amount,
      hidden: createOfferDto.hidden,
      owner: user,
      item: wish,
    };

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const createdOffer = await queryRunner.manager.save(Offer, newOffer);
      await queryRunner.manager.update(
        Wish,
        { id: wish.id },
        { raised: Number(wish.raised) + Number(createOfferDto.amount) },
      );
      await queryRunner.commitTransaction();
      return plainToInstance(Offer, {
        ...createdOffer,
        item: wish,
        owner: user,
      });
    } catch {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException();
    } finally {
      await queryRunner.release();
    }
  }

  async findOne(query: Partial<Offer>) {
    const offer = await this.offerRepository.findOne({
      where: query,
      relations: ['owner', 'item'],
    });
    if (!offer) {
      throw new NotFoundException();
    }

    return plainToInstance(Offer, offer);
  }

  async findAll() {
    const offers = await this.offerRepository.find({
      relations: ['owner', 'item'],
    });

    return plainToInstance(Offer, offers);
  }

  updateOne(id: number, offer: Partial<Offer>) {
    return this.offerRepository.update({ id }, offer);
  }

  removeOne(id: number) {
    return this.offerRepository.delete({ id });
  }
}
