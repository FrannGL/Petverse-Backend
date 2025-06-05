import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Auth, GetUser } from './decorators';

import { ClerkWebhookDto } from './dto/ClerkWebhookDto';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from './entities/auth.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('check-status')
  @Auth()
  checkAuthStatus(@GetUser() user: User) {
    return this.authService.checkAuthStatus(user);
  }

  @Post('webhook/clerk')
  @HttpCode(HttpStatus.OK)
  async handleClerkWebhook(@Body() body: ClerkWebhookDto) {
    console.log(`Received Clerk webhook: ${body.type}`);

    switch (body.type) {
      case 'user.created':
      case 'user.updated':
        await this.authService.createOrUpdateFromClerk(body.data);
        break;
      default:
        console.log(`Unhandled webhook type: ${body.type}`);
    }

    return { received: true };
  }
}
