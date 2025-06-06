import { Comment } from 'src/comment/entities/comment.entity';
import { Like } from 'src/like/entities/like.entity';
import { Pet } from 'src/pet/entities/pet.entity';
import { Post } from 'src/post/entities/post.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
  OneToMany,
} from 'typeorm';

@Entity('users')
export class User {
  @Column({ nullable: true, unique: true })
  clerkId?: string;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 80 })
  name: string;

  @Column('text', { unique: true })
  email: string;

  @Column({ nullable: true })
  avatarUrl?: string;

  @Column({ nullable: true, length: 160 })
  bio?: string;

  @Column('text', { array: true, default: ['user'] })
  roles: string[];

  @OneToMany(() => Pet, (pet) => pet.owner)
  pets: Pet[];

  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];

  @OneToMany(() => Like, (like) => like.user)
  likes: Like[];

  @OneToMany(() => Comment, (comment) => comment.author)
  comments: Comment[];

  @Column('bool', { default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  checkFieldsBeforeInsert() {
    if (this.email) {
      this.email = this.email.toLowerCase().trim();
    }
  }

  @BeforeUpdate()
  checkFieldsBeforeUpdate() {
    this.checkFieldsBeforeInsert();
  }
}
