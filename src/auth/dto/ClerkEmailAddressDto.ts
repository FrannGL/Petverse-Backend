import {
  IsString,
  IsArray,
  IsOptional,
  IsBoolean,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class VerificationDto {
  @IsString()
  status: string;

  @IsString()
  strategy: string;

  @IsOptional()
  @IsNumber()
  attempts?: number;

  @IsOptional()
  @IsNumber()
  expire_at?: number;
}

export class ClerkEmailAddressDto {
  @IsString()
  id: string;

  @IsString()
  email_address: string;

  @IsString()
  object: string;

  @ValidateNested()
  @Type(() => VerificationDto)
  verification: VerificationDto;

  @IsArray()
  linked_to: any[];

  @IsOptional()
  @IsNumber()
  created_at?: number;

  @IsOptional()
  @IsNumber()
  updated_at?: number;

  @IsOptional()
  @IsBoolean()
  matches_sso_connection?: boolean;

  @IsOptional()
  @IsBoolean()
  reserved?: boolean;
}
