import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';

import { User } from 'src/auth/entities/auth.entity';
import { Pet } from 'src/pet/entities/pet.entity';
import { Post } from 'src/post/entities/post.entity';
import { Comment } from 'src/comment/entities/comment.entity';
import { Like } from 'src/like/entities/like.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Pet, Post, Comment, Like])],
  providers: [SeedService],
  controllers: [SeedController],
})
export class SeedModule {}
