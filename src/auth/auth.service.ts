import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from './entities/auth.entity';
import { JwtPayload } from './interfaces';
import { ClerkWebhookUserDto } from './dto/ClerkWebhookUserDto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto;

      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
      });
      const savedUser = await this.userRepository.save(user);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...userWithoutPassword } = savedUser;

      return {
        ...userWithoutPassword,
        token: this.getJwtToken({ id: savedUser.id }),
      };
    } catch (e) {
      this.handleDbErrors(e as { code?: string; detail?: string });
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { password, email } = loginUserDto;
    const user = await this.userRepository.findOne({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        name: true,
        avatarUrl: true,
        bio: true,
      },
    });

    if (!user)
      throw new UnauthorizedException('Credentials are not valid (email)');

    if (!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('Credentials are not valid (password)');

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user;

    return {
      ...userWithoutPassword,
      token: this.getJwtToken({ id: user.id }),
    };
  }

  checkAuthStatus(user: User) {
    return {
      ...user,
      token: this.getJwtToken({ id: user.id }),
    };
  }

  async createOrUpdateFromClerk(dto: ClerkWebhookUserDto): Promise<User> {
    try {
      console.log(`Processing Clerk webhook for user: ${dto.id}`);

      // Buscar si el usuario ya existe por clerk_id
      const user = await this.userRepository.findOne({
        where: { clerkId: dto.id },
      });

      // Obtener el email principal
      const primaryEmail = dto.email_addresses?.find(
        (email) => email.id === dto.primary_email_address_id,
      )?.email_address;

      if (!primaryEmail) {
        throw new BadRequestException(
          'No primary email found in Clerk webhook data',
        );
      }

      const fullName =
        [dto.first_name, dto.last_name].filter(Boolean).join(' ') ||
        dto.username ||
        primaryEmail.split('@')[0];

      if (user) {
        // Actualizar usuario existente
        console.log(`Updating existing user with Clerk ID: ${dto.id}`);

        user.email = primaryEmail;
        user.name = fullName;
        user.avatarUrl = dto.image_url || user.avatarUrl;

        return await this.userRepository.save(user);
      } else {
        // Verificar si ya existe un usuario con ese email
        const existingUserByEmail = await this.userRepository.findOne({
          where: { email: primaryEmail },
        });

        if (existingUserByEmail) {
          // Si existe un usuario con ese email, actualizar con los datos de Clerk
          console.log(
            `Linking existing user (${primaryEmail}) with Clerk ID: ${dto.id}`,
          );

          existingUserByEmail.clerkId = dto.id;
          existingUserByEmail.name = fullName;
          existingUserByEmail.avatarUrl =
            dto.image_url || existingUserByEmail.avatarUrl;

          return await this.userRepository.save(existingUserByEmail);
        } else {
          // Crear nuevo usuario
          console.log(`Creating new user from Clerk webhook: ${dto.id}`);

          const newUser = this.userRepository.create({
            clerkId: dto.id,
            email: primaryEmail,
            name: fullName,
            avatarUrl: dto.image_url,
            password: '', // Campo requerido pero no usado con Clerk
            isActive: true,
            roles: ['user'],
            // No establecemos password ya que la autenticación es via Clerk
          });

          return await this.userRepository.save(newUser);
        }
      }
    } catch (error) {
      console.error(`Error processing Clerk webhook: ${error}`);
      throw new BadRequestException(
        `Failed to process Clerk webhook: ${error}`,
      );
    }
  }

  async findByClerkId(clerkId: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { clerkId: clerkId },
    });
  }

  private getJwtToken(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }

  private handleDbErrors(error: { code?: string; detail?: string }): never {
    if (error.code === '23505') throw new BadRequestException(error.detail);
    console.log(error);
    throw new Error('Please check server logs');
  }
}
