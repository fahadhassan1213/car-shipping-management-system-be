import { IsNotEmpty, IsString, IsInt, IsOptional } from 'class-validator';
import { Car } from '@prisma/client';

export class CarDto implements Car {
  id: string;

  @IsNotEmpty()
  @IsString()
  make: string;

  @IsNotEmpty()
  @IsString()
  model: string;

  @IsNotEmpty()
  @IsInt()
  year: number;

  @IsNotEmpty()
  @IsString()
  vin: string;

  createdAt: Date;
  updatedAt: Date;
}
