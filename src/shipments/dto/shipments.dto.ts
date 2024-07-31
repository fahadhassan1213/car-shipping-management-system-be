import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Shipment, ShippingStatus } from '@prisma/client';

export class CreateShipmentDTO implements Shipment {
  id: string;

  @IsNotEmpty()
  @IsString()
  carId: string;

  @IsNotEmpty()
  userId: number;

  @IsNotEmpty()
  @IsString()
  pickupLocation: string;

  @IsNotEmpty()
  @IsString()
  deliveryLocation: string;

  @IsNotEmpty()
  @IsDateString()
  shippingDate: Date;

  @IsOptional()
  @IsString()
  specialInstructions: string;

  @IsNotEmpty()
  status: ShippingStatus;

  createdAt: Date;
  updatedAt: Date;
}
