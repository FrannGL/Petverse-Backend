import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { Request } from 'express';

import { Auth } from 'src/auth/decorators';
import { User } from 'src/auth/entities/auth.entity';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { PetsService } from './pet.service';

@Auth()
@Controller('pets')
export class PetsController {
  constructor(private readonly petsService: PetsService) {}

  @Post()
  create(@Body() createPetDto: CreatePetDto, @Req() req: Request) {
    const user = req.user as User;
    return this.petsService.create(createPetDto, user);
  }

  @Get()
  findAll(@Req() req: Request) {
    const user = req.user as User;
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
    @Req() req: Request,
  ) {
    const user = req.user as User;
    return this.petsService.update(id, updatePetDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Request) {
    const user = req.user as User;
    return this.petsService.remove(id, user);
  }
}
