import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Pet } from 'src/pet/entities/pet.entity';
import { Post } from './entities/post.entity';
import { Like } from 'src/like/entities/like.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post, Pet, Like]), AuthModule],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
