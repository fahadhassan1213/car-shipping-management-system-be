import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CarsService } from './cars.service';
import { CarsController } from './cars.controller';

@Module({
  providers: [CarsService, PrismaService],
  exports: [CarsService],
  controllers: [CarsController],
})
export class CarsModule {}
