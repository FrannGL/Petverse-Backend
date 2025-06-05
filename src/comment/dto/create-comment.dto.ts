import { IsUUID, IsString, MinLength } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @MinLength(1)
  content: string;

  @IsUUID()
  postId: string;
}
