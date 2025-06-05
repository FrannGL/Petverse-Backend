import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Auth } from 'src/auth/decorators';
import { Request } from 'express';
import { ParseUUIDPipe } from '@nestjs/common';
import { User } from 'src/auth/entities/auth.entity';

@Auth()
@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  create(@Body() createCommentDto: CreateCommentDto, @Req() req: Request) {
    const user = req.user as User;
    return this.commentService.create(createCommentDto, user);
  }

  @Get()
  findAll() {
    return this.commentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.commentService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @Req() req: Request,
  ) {
    const user = req.user as User;
    return this.commentService.update(id, updateCommentDto, user);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string, @Req() req: Request) {
    const user = req.user as User;
    return this.commentService.remove(id, user);
  }
}
