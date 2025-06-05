import { IsString, IsOptional, IsInt, Min, Max } from 'class-validator';

export class CreatePetDto {
  @IsString()
  name: string;

  @IsString()
  breed: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  age?: number;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  photoUrl?: string;
}
