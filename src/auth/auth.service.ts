import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClerkWebhookUserDto } from './dto/ClerkWebhookUserDto';
import { User } from './entities/auth.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createOrUpdateFromClerk(dto: ClerkWebhookUserDto): Promise<User> {
    try {
      console.log(`Processing Clerk webhook for user: ${dto.id}`);

      const user = await this.userRepository.findOne({
        where: { clerkId: dto.id },
      });

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
        console.log(`Updating existing user with Clerk ID: ${dto.id}`);

        user.email = primaryEmail;
        user.name = fullName;
        user.avatarUrl = dto.image_url || user.avatarUrl;

        return await this.userRepository.save(user);
      } else {
        const existingUserByEmail = await this.userRepository.findOne({
          where: { email: primaryEmail },
        });

        if (existingUserByEmail) {
          console.log(
            `Linking existing user (${primaryEmail}) with Clerk ID: ${dto.id}`,
          );

          existingUserByEmail.clerkId = dto.id;
          existingUserByEmail.name = fullName;
          existingUserByEmail.avatarUrl =
            dto.image_url || existingUserByEmail.avatarUrl;

          return await this.userRepository.save(existingUserByEmail);
        } else {
          console.log(`Creating new user from Clerk webhook: ${dto.id}`);

          const newUser = this.userRepository.create({
            clerkId: dto.id,
            email: primaryEmail,
            name: fullName,
            avatarUrl: dto.image_url,
            isActive: true,
            roles: ['user'],
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
}
