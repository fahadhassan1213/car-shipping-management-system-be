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
} from '@nestjs/common';
import { ParseIntPipe } from '@nestjs/common/pipes';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/decorator/roles.decorator';
import { Role } from 'src/enums/role.enum';
import { RolesGuard } from 'src/guard/roles.guard';
import { CarDto } from './dto/cars.dto';
import { CarsService } from './cars.service';
import { Car } from '@prisma/client';


@Controller('cars')
export class CarsController {
  constructor(private carsService: CarsService) {}

  // GET /cars
  @Get('all')
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getAllCars(): Promise<{ data: Car[] }> {
    const cars = await this.carsService.cars({});
    return { data: cars };
  }

  // GET /cars
  @Get()
  @UseGuards(JwtAuthGuard)
  async getCars(@Request() req): Promise<{ data: Car[] }> {
    const cars = await this.carsService.cars({});
    return { data: cars };
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
