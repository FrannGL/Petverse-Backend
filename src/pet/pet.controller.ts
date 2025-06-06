import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/auth/entities/auth.entity';
import { ClerkAuthGuard } from 'src/auth/guards/clerk-auth.guard';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { PetsService } from './pet.service';

@UseGuards(ClerkAuthGuard)
@Controller('pets')
export class PetsController {
  constructor(private readonly petsService: PetsService) {}

  @Post()
  create(@Body() createPetDto: CreatePetDto, @CurrentUser() user: User) {
    return this.petsService.create(createPetDto, user);
  }

  @Get()
  findAll(@CurrentUser() user: User) {
    return this.petsService.findAllByUser(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.petsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePetDto: UpdatePetDto,
    @CurrentUser() user: User,
  ) {
    return this.petsService.update(id, updatePetDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.petsService.remove(id, user);
  }
}
