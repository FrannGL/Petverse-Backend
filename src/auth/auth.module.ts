import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ClerkClientProvider } from 'src/providers/clerk-client.provider';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from './entities/auth.entity';
import { ClerkStrategy } from './strategies/clerk.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, ClerkStrategy, ClerkClientProvider],
  imports: [ConfigModule, TypeOrmModule.forFeature([User]), PassportModule],
  exports: [TypeOrmModule, JwtStrategy, PassportModule],
})
export class AuthModule {}
