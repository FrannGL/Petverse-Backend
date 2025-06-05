import { Module } from '@nestjs/common';
import { PetsService } from './pet.service';
import { PetsController } from './pet.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pet } from './entities/pet.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Pet]), AuthModule],
  controllers: [PetsController],
  providers: [PetsService],
})
export class PetsModule {}
