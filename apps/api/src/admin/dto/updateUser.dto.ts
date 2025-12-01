import { UserRole } from '@eburon/db';
import { IsBoolean, IsEnum, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsEnum(UserRole, { message: 'role must be a valid UserRole enum value' })
  role?: UserRole;
}
