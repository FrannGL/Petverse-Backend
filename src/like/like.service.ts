import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/auth.entity';
import { Post } from 'src/post/entities/post.entity';
import { Repository } from 'typeorm';
import { CreateLikeDto } from './dto/create-like.dto';
import { Like } from './entities/like.entity';

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

  async findAll(user: User) {
    return this.likeRepository.find({
      where: { user: { clerkId: user.clerkId } },
      relations: ['post', 'user'],
    });
  }

  async findOne(id: string, user: User) {
    const like = await this.likeRepository.findOne({
      where: { id, user: { clerkId: user.clerkId } },
      relations: ['post', 'user'],
    });

    if (!like) {
      throw new NotFoundException(`Like with id ${id} not found or not yours`);
    }

    return like;
  }

  async remove(id: string, user: User) {
    const like = await this.likeRepository.findOne({
      where: { id, user: { clerkId: user.clerkId } },
      relations: ['user'],
    });

    if (!like) {
      throw new NotFoundException(`Like with id ${id} not found or not yours`);
    }

    await this.likeRepository.remove(like);
    return { message: 'Like deleted' };
  }
}
