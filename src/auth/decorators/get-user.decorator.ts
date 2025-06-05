import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { User } from '../entities/auth.entity';

interface AuthenticatedRequest extends Request {
  user: User;
}

export const GetUser = createParamDecorator(
  (data: keyof User | undefined, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = req.user;

    if (!user)
      throw new InternalServerErrorException('User not found (request)');

    return data ? user[data] : user;
  },
);
