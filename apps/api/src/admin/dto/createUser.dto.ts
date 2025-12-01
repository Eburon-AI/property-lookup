import { UserRole } from '@eburon/db';
import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @MinLength(4)
  password: string;

  @IsString()
  name: string;

  @IsEnum(UserRole, { message: 'role must be a valid UserRole enum value' })
  role: UserRole;
}
