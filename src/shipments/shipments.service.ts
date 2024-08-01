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
  async getShipments({
    page = 1,
    limit = 10,
    cursor,
    where,
    include,
    orderBy,
  }: {
    page?: number;
    limit?: number;
    cursor?: Prisma.ShipmentWhereUniqueInput;
    where?: Prisma.ShipmentWhereInput;
    include?: Prisma.ShipmentInclude;
    orderBy?: Prisma.ShipmentOrderByWithRelationInput;
  }): Promise<{ data: Shipment[]; total: number }> {
    const [total, data] = await Promise.all([
      this.prisma.shipment.count({
        where,
      }),
      this.prisma.shipment.findMany({
        skip: Math.max(0, (page - 1) * limit),
        take: limit,
        cursor,
        where,
        include,
        orderBy,
      }),
    ]);

    return { data, total };
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
