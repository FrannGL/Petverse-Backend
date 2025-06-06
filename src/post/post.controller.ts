import {
  Controller,
  Get,
  Post as HttpPost,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

import { User } from 'src/auth/entities/auth.entity';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { ClerkAuthGuard } from 'src/auth/guards/clerk-auth.guard';
import { Public } from 'src/auth/decorators/role-protected.decorator';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Public()
  @Get()
  findAll() {
    return this.postService.findAll();
  }

  @UseGuards(ClerkAuthGuard)
  @HttpPost()
  create(@Body() createPostDto: CreatePostDto, @CurrentUser() user: User) {
    return this.postService.create(createPostDto, user);
  }

  @UseGuards(ClerkAuthGuard)
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: User) {
    return this.postService.findOne(id, user);
  }

  @UseGuards(ClerkAuthGuard)
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePostDto: UpdatePostDto,
    @CurrentUser() user: User,
  ) {
    return this.postService.update(id, updatePostDto, user);
  }

  @UseGuards(ClerkAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: User) {
    return this.postService.remove(id, user);
  }
}
