import { IsNotEmpty, IsString, IsInt, IsOptional } from 'class-validator';
import { ShippingStatus } from '@prisma/client';

export class CarDto {
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

  @IsNotEmpty()
  shippingStatus?: ShippingStatus;
}