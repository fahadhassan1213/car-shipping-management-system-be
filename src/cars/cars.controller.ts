import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UseGuards,
  Request,
  Param,
  Get,
  Patch,
  Query,
} from '@nestjs/common';
import { ParseIntPipe } from '@nestjs/common/pipes';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CarDto } from './dto/cars.dto';
import { CarsService } from './cars.service';
import { Car } from '@prisma/client';

@Controller('cars')
export class CarsController {
  constructor(private carsService: CarsService) {}

  // GET /cars?page=1&limit=10
  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllCars(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
  ): Promise<{ data: Car[]; total: number; page: number; limit: number }> {
    const { data, total } = await this.carsService.getCars({
      page,
      limit,
    });
    return { data, total, page, limit };
  }

  // GET /cars/1
  @Get(':carId')
  @UseGuards(JwtAuthGuard)
  async getCar(@Param('carId', ParseIntPipe) id: string): Promise<Car> {
    return this.carsService.car({ id });
  }

  // POST /cars
  @Post()
  @UseGuards(JwtAuthGuard)
  async createCar(
    @Body(ValidationPipe) createCarDto: CarDto,
    @Request() req,
  ): Promise<Car> {
    return this.carsService.createCar(createCarDto);
  }

  // PATCH /cars/1
  @Patch(':carId')
  @UseGuards(JwtAuthGuard)
  async updateCar(
    @Param('carId', ParseIntPipe) id: string,
    @Body(ValidationPipe) updateCarDto: CarDto,
  ): Promise<Car> {
    return this.carsService.updateCar({
      where: { id },
      data: updateCarDto,
    });
  }
}
