import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Length, IsUrl } from 'class-validator';

import { User } from '../../users/entities/users.entity';
import { Offer } from '../../offers/entities/offers.entity';
import { Wishlist } from '../../wishlists/entities/wishlists.entity';

@Entity()
export class Wish {
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
  link: string;

  @Column()
  @IsUrl()
  image: string;

  @Column({
    type: 'decimal',
    scale: 2,
  })
  price: number;

  @Column({
    type: 'decimal',
    scale: 2,
  })
  raised: number;

  @Column()
  @Length(1, 1024)
  description: string;

  @Column({ type: 'int' })
  copied: number;

  @ManyToOne(() => User, (user) => user.wishes)
  owner: User;

  @ManyToOne(() => Wishlist, (wishlist) => wishlist.items)
  wishlist: Wishlist;

  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[];
}
