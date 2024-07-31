import { Injectable } from '@nestjs/common';
import { Prisma, Shipment } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ShipmentsService {
  constructor(private prisma: PrismaService) {}

  // get a shipment by id
  async shipment(
    shipmentsWhereUniqueInput: Prisma.ShipmentWhereUniqueInput,
    options?: Prisma.ShipmentArgs,
  ): Promise<Shipment | null> {
    return this.prisma.shipment.findUnique({
      where: shipmentsWhereUniqueInput,
      ...options,
    });
  }

  // get all shipments
  async shipments(
    params: {
      skip?: number;
      take?: number;
      cursor?: Prisma.ShipmentWhereUniqueInput;
      where?: Prisma.ShipmentWhereInput;
      orderBy?: Prisma.ShipmentOrderByWithRelationInput;
    },
    options?: Prisma.ShipmentArgs,
  ): Promise<Shipment[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.shipment.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      ...options,
    });
  }

  // create new shipment
  async createShipment(data: Prisma.ShipmentCreateInput): Promise<Shipment> {
    return this.prisma.shipment.create({
      data,
    });
  }

  // update a shipment by id
  async updateShipment(params: {
    where: Prisma.ShipmentWhereUniqueInput;
    data: Prisma.ShipmentUpdateInput;
  }): Promise<Shipment> {
    const { where, data } = params;
    return this.prisma.shipment.update({
      data,
      where,
    });
  }
}
