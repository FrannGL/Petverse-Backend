import {
  IsString,
  IsOptional,
  IsArray,
  IsBoolean,
  IsObject,
  IsNumber,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ClerkEmailAddressDto } from './ClerkEmailAddressDto';

export class ClerkWebhookUserDto {
  @IsString()
  id: string;

  @IsString()
  object: string;

  @IsOptional()
  @IsString()
  first_name?: string;

  @IsOptional()
  @IsString()
  last_name?: string;

  @IsOptional()
  @IsString()
  external_id?: string;

  @IsUrl()
  image_url: string;

  @IsUrl()
  profile_image_url: string;

  @Type(() => Number)
  @IsNumber()
  created_at: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  last_sign_in_at?: number;

  @IsBoolean()
  password_enabled: boolean;

  @IsBoolean()
  two_factor_enabled: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ClerkEmailAddressDto)
  email_addresses: ClerkEmailAddressDto[];

  @IsString()
  primary_email_address_id: string;

  @IsOptional()
  @IsString()
  primary_phone_number_id?: string;

  @IsOptional()
  @IsString()
  primary_web3_wallet_id?: string;

  @IsOptional()
  @IsString()
  birthday?: string;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsArray()
  external_accounts?: any[];

  @IsOptional()
  @IsArray()
  phone_numbers?: any[];

  @IsOptional()
  @IsArray()
  web3_wallets?: any[];

  @IsObject()
  private_metadata: object;

  @IsObject()
  public_metadata: object;

  @IsObject()
  unsafe_metadata: object;

  @IsOptional()
  @IsString()
  username?: string;

  @Type(() => Number)
  @IsNumber()
  updated_at: number;

  @IsOptional()
  @IsString()
  instance_id?: string;

  @IsOptional()
  @IsBoolean()
  backup_code_enabled?: boolean;

  @IsOptional()
  @IsBoolean()
  banned?: boolean;

  @IsOptional()
  @IsBoolean()
  create_organization_enabled?: boolean;

  @IsOptional()
  @IsBoolean()
  delete_self_enabled?: boolean;

  @IsOptional()
  @IsArray()
  enterprise_accounts?: any[];

  @IsOptional()
  @IsBoolean()
  has_image?: boolean;

  @IsOptional()
  @IsNumber()
  last_active_at?: number;

  @IsOptional()
  @IsNumber()
  legal_accepted_at?: number;

  @IsOptional()
  @IsBoolean()
  locked?: boolean;

  @IsOptional()
  @IsNumber()
  lockout_expires_in_seconds?: number;

  @IsOptional()
  @IsNumber()
  mfa_disabled_at?: number;

  @IsOptional()
  @IsNumber()
  mfa_enabled_at?: number;

  @IsOptional()
  @IsArray()
  passkeys?: any[];

  @IsOptional()
  @IsArray()
  saml_accounts?: any[];

  @IsOptional()
  @IsBoolean()
  totp_enabled?: boolean;

  @IsOptional()
  @IsNumber()
  verification_attempts_remaining?: number;
}
