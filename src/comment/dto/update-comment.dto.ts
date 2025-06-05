import { PartialType } from '@nestjs/mapped-types';
import { CreateCommentDto } from './create-comment.dto';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateCommentDto extends PartialType(CreateCommentDto) {
  @IsOptional()
  @IsString()
  @MinLength(1)
  content?: string;
}
