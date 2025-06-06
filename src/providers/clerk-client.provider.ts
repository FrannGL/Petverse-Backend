import { createClerkClient } from '@clerk/backend';
import { ConfigService } from '@nestjs/config';

export const ClerkClientProvider = {
  provide: 'ClerkClient',
  useFactory: (configService: ConfigService) => {
    const publishableKey = configService.get<string>(
      'VITE_CLERK_PUBLISHABLE_KEY',
    );
    const secretKey = configService.get<string>('CLERK_SECRET_KEY');

    if (!publishableKey || !secretKey) {
      throw new Error(
        'Clerk keys are not defined in the environment variables',
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
    return createClerkClient({
      publishableKey,
      secretKey,
    });
  },
  inject: [ConfigService],
};
