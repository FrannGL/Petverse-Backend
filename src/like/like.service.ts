import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like } from './entities/like.entity';
import { CreateLikeDto } from './dto/create-like.dto';
import { Post } from 'src/post/entities/post.entity';
import { User } from 'src/auth/entities/auth.entity';

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(Like)
    private readonly likeRepository: Repository<Like>,

    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async create(createLikeDto: CreateLikeDto, user: User) {
    const post = await this.postRepository.findOne({
      where: { id: createLikeDto.postId },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const like = this.likeRepository.create({
      post,
      user,
    });

    return this.likeRepository.save(like);
  }

  findAll() {
    return this.likeRepository.find({
      relations: ['post', 'user'],
    });
  }

  async findOne(id: string) {
    const like = await this.likeRepository.findOne({
      where: { id },
      relations: ['post', 'user'],
    });

    if (!like) {
      throw new NotFoundException(`Like with id ${id} not found`);
    }

    return like;
  }

  async remove(id: string, user: User) {
    const like = await this.likeRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!like) {
      throw new NotFoundException(`Like with id ${id} not found`);
    }

    if (like.user.id !== user.id) {
      throw new Error('Unauthorized');
    }

    await this.likeRepository.remove(like);
    return { message: 'Like deleted' };
  }
}
