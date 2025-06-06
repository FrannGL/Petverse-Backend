import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { CommentModule } from './comment/comment.module';
import { LikeModule } from './like/like.module';
import { PetsModule } from './pet/pet.module';
import { PostModule } from './post/post.module';
import { ClerkClientProvider } from './providers/clerk-client.provider';
import { SeedModule } from './seed/seed.module';

@Module({
  imports: [
    ConfigModule.forRoot(),

    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: true,
      ssl: {
        rejectUnauthorized: false,
      },
    }),

    AuthModule,

    PetsModule,

    PostModule,

    LikeModule,

    CommentModule,

    SeedModule,
  ],
  providers: [ClerkClientProvider],
})
export class AppModule {}
