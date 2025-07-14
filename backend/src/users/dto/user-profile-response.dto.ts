import { Exclude } from 'class-transformer';
import {
  IsUrl,
  IsEmail,
  MinLength,
  MaxLength,
  IsString,
  IsNumber,
  IsDateString,
} from 'class-validator';

export class UserProfileResponseDto {
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

  @IsEmail()
  email: string;

  @IsDateString()
  createdAt: string;

  @IsDateString()
  updatedAt: string;

  @Exclude()
  password: string;
}
