import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { fakerES as faker } from '@faker-js/faker';

import { InjectRepository } from '@nestjs/typeorm';

import { User } from 'src/auth/entities/auth.entity';
import { Pet } from 'src/pet/entities/pet.entity';
import { Post } from 'src/post/entities/post.entity';
import { Comment } from 'src/comment/entities/comment.entity';
import { Like } from 'src/like/entities/like.entity';

@Injectable()
export class SeedService {
  private dogBreeds = [
    'Labrador Retriever',
    'Pastor Alemán',
    'Golden Retriever',
    'Bulldog Francés',
    'Beagle',
    'Poodle',
    'Rottweiler',
    'Yorkshire Terrier',
    'Boxer',
    'Dachshund',
    'Siberian Husky',
    'Doberman',
    'Gran Danés',
    'Shih Tzu',
    'Chihuahua',
    'Border Collie',
    'Pug',
    'Bulldog Inglés',
    'Cocker Spaniel',
    'Australian Shepherd',
    'Pomeranian',
    'Bichón Frisé',
    'Maltés',
    'Weimaraner',
    'Bull Terrier',
  ];

  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Pet) private petRepo: Repository<Pet>,
    @InjectRepository(Post) private postRepo: Repository<Post>,
    @InjectRepository(Comment) private commentRepo: Repository<Comment>,
    @InjectRepository(Like) private likeRepo: Repository<Like>,
  ) {}

  async runSeed() {
    try {
      await this.likeRepo.createQueryBuilder().delete().where({}).execute();
      await this.commentRepo.createQueryBuilder().delete().where({}).execute();
      await this.postRepo.createQueryBuilder().delete().where({}).execute();
      await this.petRepo.createQueryBuilder().delete().where({}).execute();
      await this.userRepo.createQueryBuilder().delete().where({}).execute();
    } catch (error) {
      console.error('Error limpiando tablas:', error);
      throw error;
    }

    const users: User[] = [];
    for (let i = 0; i < 5; i++) {
      const user = this.userRepo.create({
        clerkId: `user_${faker.string.alphanumeric(24)}`,
        name: faker.person.fullName(),
        email: faker.internet.email(),
        avatarUrl: faker.image.avatar(),
        bio: faker.lorem.sentence(),
        roles: ['user'],
        isActive: true,
      });
      users.push(await this.userRepo.save(user));
    }

    const pets: Pet[] = [];
    for (const user of users) {
      const petCount = faker.number.int({ min: 1, max: 3 });
      for (let i = 0; i < petCount; i++) {
        const pet = this.petRepo.create({
          name: faker.person.firstName(),
          breed: faker.helpers.arrayElement(this.dogBreeds),
          age: faker.number.int({ min: 1, max: 15 }),
          bio: faker.lorem.sentence(),
          photoUrl: faker.image.urlLoremFlickr({
            category: 'dog',
            width: 640,
            height: 480,
          }),
          owner: user,
        });
        pets.push(await this.petRepo.save(pet));
      }
    }

    const posts: Post[] = [];
    for (const pet of pets) {
      const postCount = faker.number.int({ min: 1, max: 2 });
      for (let i = 0; i < postCount; i++) {
        const post = this.postRepo.create({
          caption: faker.lorem.sentence(),
          imageUrl: faker.image.urlLoremFlickr({
            category: 'dog',
            width: 640,
            height: 480,
          }),
          pet,
          author: pet.owner,
        });
        posts.push(await this.postRepo.save(post));
      }
    }

    const comments: Comment[] = [];
    for (const post of posts) {
      const commentCount = faker.number.int({ min: 1, max: 3 });
      for (let i = 0; i < commentCount; i++) {
        const author = faker.helpers.arrayElement(users);
        const comment = this.commentRepo.create({
          content: faker.lorem.sentences(2),
          post,
          author,
        });
        comments.push(await this.commentRepo.save(comment));
      }
    }

    for (const post of posts) {
      const likeCount = faker.number.int({ min: 0, max: users.length });
      const shuffledUsers = faker.helpers.shuffle(users);
      for (let i = 0; i < likeCount; i++) {
        const user = shuffledUsers[i];

        const likeExists = await this.likeRepo.findOne({
          where: { post: { id: post.id }, user: { id: user.id } },
        });
        if (!likeExists) {
          const like = this.likeRepo.create({
            post,
            user,
          });
          await this.likeRepo.save(like);
        }
      }
    }

    return {
      message: 'Seed completo!',
      usersCount: users.length,
      petsCount: pets.length,
      postsCount: posts.length,
      commentsCount: comments.length,
    };
  }
}
