import {
  Controller,
  Get,
  Post as HttpPost,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Req,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Auth } from 'src/auth/decorators';
import { Request } from 'express';
import { User } from 'src/auth/entities/auth.entity';

@Auth()
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @HttpPost()
  create(@Body() createPostDto: CreatePostDto, @Req() req: Request) {
    const user = req.user as User;
    return this.postService.create(createPostDto, user);
  }

  @Get()
  findAll() {
    return this.postService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.postService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePostDto: UpdatePostDto,
    @Req() req: Request,
  ) {
    const user = req.user as User;
    return this.postService.update(id, updatePostDto, user);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string, @Req() req: Request) {
    const user = req.user as User;
    return this.postService.remove(id, user);
  }
}
