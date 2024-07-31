import { User } from '@prisma/client';
import {
  IsString,
  Length,
  IsEmail,
  IsNotEmpty,
} from 'class-validator';

export class CreateUserDto implements User {
  id: number;

  @IsNotEmpty()
  @IsString({ message: "'name' must be a string" })
  name: string;

  @IsNotEmpty()
  @IsString({ message: "'email' address must be a string" })
  @IsEmail({}, { message: 'Invalid email address' })
  email: string;

  @IsNotEmpty()
  @IsString({ message: "'password' must be a string" })
  @Length(6)
  password: string;

  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
