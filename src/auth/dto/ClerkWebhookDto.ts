import {
  IsString,
  IsObject,
  ValidateNested,
  IsOptional,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ClerkWebhookUserDto } from './ClerkWebhookUserDto';

export class ClerkWebhookDto {
  @IsOptional()
  @IsString()
  instance_id?: string;

  @IsString()
  type: string;

  @IsString()
  object: string;

  @Type(() => Number)
  @IsNumber()
  timestamp: number;

  @ValidateNested()
  @Type(() => ClerkWebhookUserDto)
  data: ClerkWebhookUserDto;

  @IsOptional()
  @IsObject()
  event_attributes?: any;
}
