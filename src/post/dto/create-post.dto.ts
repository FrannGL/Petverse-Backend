import { IsUUID, IsString } from 'class-validator';

export class CreatePostDto {
  @IsString()
  caption: string;

  @IsString()
  imageUrl: string;

  @IsUUID()
  petId: string;
}
