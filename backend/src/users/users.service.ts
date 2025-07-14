import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from './entities/users.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserProfileResponseDto } from './dto/user-profile-response.dto';
import { UserPublicProfileResponseDto } from './dto/user-public-profile-response.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(user: CreateUserDto) {
    const hash = await bcrypt.hash(user.password, 10);
    const newUser = this.userRepository.create({ ...user, password: hash });

    return this.userRepository.save(newUser);
  }

  findOne(query: Partial<User>) {
    return this.userRepository.findOne({
      where: query,
    });
  }

  async findOneWithoutPassword(query: Partial<User>) {
    const user = await this.userRepository.findOne({
      where: query,
    });
    return plainToInstance(UserProfileResponseDto, user);
  }

  async findOneWithoutPasswordAndEmail(query: Partial<User>) {
    const user = await this.userRepository.findOne({
      where: query,
    });

    if (!user) {
      throw new NotFoundException();
    }
    return plainToInstance(UserPublicProfileResponseDto, user);
  }

  async findUserWishes(id: number) {
    const userWithWishes = await this.userRepository.findOne({
      where: { id },
      relations: ['wishes'],
    });
    return userWithWishes?.wishes;
  }

  async updateOne(id: number, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      const hash = await bcrypt.hash(updateUserDto.password, 10);
      return this.userRepository.update(
        { id },
        { ...updateUserDto, password: hash },
      );
    }

    return this.userRepository.update({ id }, updateUserDto);
  }

  removeOne(id: number) {
    return this.userRepository.delete({ id });
  }

  async findMany(query: string) {
    const users = await this.userRepository
      .createQueryBuilder('user')
      .where('user.username LIKE :query', { query: `%${query}%` })
      .orWhere('user.email LIKE :query', { query: `%${query}%` })
      .getMany();
    return plainToInstance(UserProfileResponseDto, users);
  }

  async findOwn(userId: number) {
    const user = await this.findOneWithoutPassword({
      id: userId,
    });

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }
}
