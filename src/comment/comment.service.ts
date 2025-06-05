import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { User } from 'src/auth/entities/auth.entity';
import { Post } from 'src/post/entities/post.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,

    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async create(createCommentDto: CreateCommentDto, user: User) {
    const post = await this.postRepository.findOne({
      where: { id: createCommentDto.postId },
    });
    if (!post) throw new NotFoundException('Post not found');

    const comment = this.commentRepository.create({
      content: createCommentDto.content,
      author: user,
      post,
    });

    return await this.commentRepository.save(comment);
  }

  async findAll() {
    return await this.commentRepository.find({
      relations: ['author', 'post'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ['author', 'post'],
    });
    if (!comment) throw new NotFoundException('Comment not found');
    return comment;
  }

  async update(id: string, updateCommentDto: UpdateCommentDto, user: User) {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ['author'],
    });
    if (!comment) throw new NotFoundException('Comment not found');

    if (comment.author.id !== user.id)
      throw new ForbiddenException('You are not the author of this comment');

    Object.assign(comment, updateCommentDto);

    return await this.commentRepository.save(comment);
  }

  async remove(id: string, user: User) {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ['author'],
    });
    if (!comment) throw new NotFoundException('Comment not found');

    if (comment.author.id !== user.id)
      throw new ForbiddenException('You are not the author of this comment');

    await this.commentRepository.remove(comment);
    return { message: 'Comment deleted successfully' };
  }
}
