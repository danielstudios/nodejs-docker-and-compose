import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { Length } from 'class-validator';

import { User } from '../../users/entities/users.entity';
import { Wish } from '../../wishes/entities/wishes.entity';

@Entity()
export class Wishlist {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  @Length(1, 250)
  name: string;

  @Column()
  image: string;

  @OneToMany(() => Wish, (wish) => wish.wishlist)
  items: Wish[];

  @ManyToOne(() => User, (user) => user.wishlists)
  owner: User;
}
