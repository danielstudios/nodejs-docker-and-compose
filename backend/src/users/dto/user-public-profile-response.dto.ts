import { Exclude } from 'class-transformer';
import {
  IsUrl,
  MinLength,
  MaxLength,
  IsString,
  IsNumber,
  IsDateString,
} from 'class-validator';

export class UserPublicProfileResponseDto {
  @IsNumber()
  id: number;

  @IsString()
  @MinLength(1)
  @MaxLength(64)
  username: string;

  @IsString()
  @MinLength(0)
  @MaxLength(200)
  about: string;

  @IsUrl()
  avatar: string;

  @IsDateString()
  createdAt: string;

  @IsDateString()
  updatedAt: string;

  @Exclude()
  email: string;

  @Exclude()
  password: string;
}
