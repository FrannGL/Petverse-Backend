import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { User } from 'src/auth/entities/auth.entity';
import { Post } from 'src/post/entities/post.entity';

@Entity('pets')
export class Pet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 50 })
  breed: string;

  @Column({ type: 'int', nullable: true })
  age?: number;

  @Column({ nullable: true, length: 160 })
  bio?: string;

  @Column({ nullable: true })
  photoUrl?: string;

  @ManyToOne(() => User, (user) => user.pets, { eager: false })
  owner: User;

  @OneToMany(() => Post, (post) => post.pet)
  posts: Post[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
