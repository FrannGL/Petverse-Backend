import { User } from 'src/auth/entities/auth.entity';
import { Comment } from 'src/comment/entities/comment.entity';
import { Like } from 'src/like/entities/like.entity';
import { Pet } from 'src/pet/entities/pet.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  caption: string;

  @Column()
  imageUrl: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Pet, (pet) => pet.posts, { eager: true })
  pet: Pet;

  @ManyToOne(() => User, (user) => user.posts, { eager: true })
  author: User;

  @OneToMany(() => Like, (like) => like.post)
  likes: Like[];

  @OneToMany(() => Comment, (comment) => comment.post, { eager: true })
  comments: Comment[];
}
