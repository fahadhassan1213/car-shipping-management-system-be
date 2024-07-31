import { Injectable } from '@nestjs/common';
import { Prisma, Car } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CarsService {
  constructor(private prisma: PrismaService) {}

  // get a car by id
  async car(
    carsWhereUniqueInput: Prisma.CarWhereUniqueInput,
    options?: Prisma.CarArgs,
  ): Promise<Car | null> {
    return this.prisma.car.findUnique({
      where: carsWhereUniqueInput,
      ...options,
    });
  }

  // get all cars
  async cars(
    params: {
      skip?: number;
      take?: number;
      cursor?: Prisma.CarWhereUniqueInput;
      where?: Prisma.CarWhereInput;
      orderBy?: Prisma.CarOrderByWithRelationInput;
    },
    options?: Prisma.CarArgs,
  ): Promise<Car[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.car.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      ...options,
    });
  }

  // create new car
  async createCar(data: Prisma.CarCreateInput): Promise<Car> {
    return this.prisma.car.create({
      data,
    });
  }

  // update a car by id
  async updateCar(params: {
    where: Prisma.CarWhereUniqueInput;
    data: Prisma.CarUpdateInput;
  }): Promise<Car> {
    const { where, data } = params;
    return this.prisma.car.update({
      data,
      where,
    });
  }
}
