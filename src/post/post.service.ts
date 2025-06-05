import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post as PostEntity } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { User } from 'src/auth/entities/auth.entity';
import { Pet } from 'src/pet/entities/pet.entity';
import { Like } from 'src/like/entities/like.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,

    @InjectRepository(Pet)
    private readonly petRepository: Repository<Pet>,

    @InjectRepository(Like)
    private likeRepository: Repository<Like>,
  ) {}

  async create(createPostDto: CreatePostDto, user: User) {
    const pet = await this.petRepository.findOne({
      where: { id: createPostDto.petId },
      relations: ['owner'],
    });

    if (!pet) throw new NotFoundException('Pet not found');
    if (pet.owner.id !== user.id) throw new ForbiddenException('Not your pet');

    const post = this.postRepository.create({
      caption: createPostDto.caption,
      imageUrl: createPostDto.imageUrl,
      pet,
      author: user,
    });

    return await this.postRepository.save(post);
  }

  async findAll() {
    const posts = await this.postRepository.find({
      relations: ['author', 'pet'],
      order: { createdAt: 'DESC' },
    });

    const postsWithLikes = await Promise.all(
      posts.map(async (post) => {
        const likes = await this.getLikesCount(post.id);
        return { ...post, likes };
      }),
    );

    return postsWithLikes;
  }

  async findOne(id: string) {
    const post = await this.postRepository.findOne({ where: { id } });
    if (!post) throw new NotFoundException('Post not found');

    const likes = await this.getLikesCount(id);

    return {
      ...post,
      likes,
    };
  }

  async update(id: string, updatePostDto: UpdatePostDto, user: User) {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['author'],
    });

    if (!post) throw new NotFoundException('Post not found');
    if (post.author.id !== user.id)
      throw new ForbiddenException('You are not the author');

    Object.assign(post, updatePostDto);

    return await this.postRepository.save(post);
  }

  async remove(id: string, user: User) {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['author'],
    });

    if (!post) throw new NotFoundException('Post not found');
    if (post.author.id !== user.id)
      throw new ForbiddenException('You are not the author');

    await this.postRepository.remove(post);
    return { message: 'Post deleted successfully' };
  }

  private async getLikesCount(postId: string): Promise<number> {
    return this.likeRepository.count({ where: { post: { id: postId } } });
  }
}
