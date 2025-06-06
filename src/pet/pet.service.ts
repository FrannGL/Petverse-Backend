import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pet } from './entities/pet.entity';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { User } from 'src/auth/entities/auth.entity';

@Injectable()
export class PetsService {
  constructor(
    @InjectRepository(Pet)
    private readonly petRepository: Repository<Pet>,
  ) {}

  async create(createPetDto: CreatePetDto, user: User) {
    const pet = this.petRepository.create({
      ...createPetDto,
      owner: user,
    });
    return await this.petRepository.save(pet);
  }

  async findAllByUser(user: User) {
    return await this.petRepository.find({
      where: { owner: { clerkId: user.clerkId } },
    });
  }

  async findOne(id: string) {
    const pet = await this.petRepository.findOne({
      where: { id },
      relations: ['owner'],
    });
    if (!pet) throw new NotFoundException('Pet not found');
    return pet;
  }

  async update(id: string, updatePetDto: UpdatePetDto, user: User) {
    const pet = await this.findOne(id);
    if (pet.owner.clerkId !== user.clerkId) {
      throw new ForbiddenException('No puedes editar esta mascota');
    }
    Object.assign(pet, updatePetDto);
    return await this.petRepository.save(pet);
  }

  async remove(id: string, user: User) {
    const pet = await this.findOne(id);
    if (pet.owner.clerkId !== user.clerkId) {
      throw new ForbiddenException('No puedes eliminar esta mascota');
    }
    await this.petRepository.remove(pet);
    return { message: 'Mascota eliminada' };
  }
}
