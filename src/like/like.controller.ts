import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { LikeService } from './like.service';
import { CreateLikeDto } from './dto/create-like.dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { ClerkAuthGuard } from 'src/auth/guards/clerk-auth.guard';
import { User } from 'src/auth/entities/auth.entity';

@UseGuards(ClerkAuthGuard)
@Controller('likes')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Post()
  create(@Body() createLikeDto: CreateLikeDto, @CurrentUser() user: User) {
    return this.likeService.create(createLikeDto, user);
  }

  @Get()
  findAll(@CurrentUser() user: User) {
    return this.likeService.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: User) {
    return this.likeService.findOne(id, user);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: User) {
    return this.likeService.remove(id, user);
  }
}
