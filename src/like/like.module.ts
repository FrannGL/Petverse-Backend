import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LikeService } from './like.service';
import { LikeController } from './like.controller';
import { Like } from './entities/like.entity';
import { User } from 'src/auth/entities/auth.entity';
import { AuthModule } from 'src/auth/auth.module';
import { Post } from 'src/post/entities/post.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Like, Post, User]), AuthModule],
  controllers: [LikeController],
  providers: [LikeService],
})
export class LikeModule {}
