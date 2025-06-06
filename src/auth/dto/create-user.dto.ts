import {
  IsEmail,
  IsString,
  Length,
  IsOptional,
  IsArray,
  IsBoolean,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(2, 80)
  name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @IsOptional()
  @IsString()
  @Length(0, 160)
  bio?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  roles?: string[];

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
