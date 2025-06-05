import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Req,
  ParseUUIDPipe,
} from '@nestjs/common';
import { LikeService } from './like.service';
import { CreateLikeDto } from './dto/create-like.dto';
import { Auth } from 'src/auth/decorators';
import { User } from 'src/auth/entities/auth.entity';
import { Request } from 'express';

@Auth()
@Controller('likes')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Post()
  create(@Body() createLikeDto: CreateLikeDto, @Req() req: Request) {
    const user = req.user as User;
    return this.likeService.create(createLikeDto, user);
  }

  @Get()
  findAll() {
    return this.likeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.likeService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string, @Req() req: Request) {
    const user = req.user as User;
    return this.likeService.remove(id, user);
  }
}
