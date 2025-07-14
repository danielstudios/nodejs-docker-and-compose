import {
  IsUrl,
  IsEmail,
  MinLength,
  MaxLength,
  IsString,
  IsOptional,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(64)
  username?: string;

  @IsOptional()
  @IsString()
  @MinLength(0)
  @MaxLength(200)
  about?: string;

  @IsOptional()
  @IsUrl()
  avatar?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  password?: string;
}
