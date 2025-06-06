import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';

import { ClerkWebhookDto } from './dto/ClerkWebhookDto';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './entities/auth.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('me')
  getProfile(@CurrentUser() user: User) {
    return user;
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
