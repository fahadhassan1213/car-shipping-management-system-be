import { Query } from '@nestjs/common';

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
import {
  DefaultValuePipe,
  ParseBoolPipe,
  ParseIntPipe,
} from '@nestjs/common/pipes';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/decorator/roles.decorator';
import { Role } from 'src/enums/role.enum';
import { RolesGuard } from 'src/guard/roles.guard';
import { ShipmentsService } from './shipments.service';
import { Shipment } from '@prisma/client';
import { CreateShipmentDTO } from './dto/shipments.dto';

@Controller('shipments')
export class ShipmentsController {
  constructor(private shipmentsService: ShipmentsService) {}

  // GET /shipments
  @Get('all')
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getAllShipments(
    @Request() req,
    @Query('car', new DefaultValuePipe(false), ParseBoolPipe)
    car: boolean,
    @Query('user', new DefaultValuePipe(false), ParseBoolPipe)
    @Query('page', ParseIntPipe)
    page: number = 1,
    @Query('limit', ParseIntPipe)
    limit: number = 10,
    user: boolean,
  ): Promise<{ data: Shipment[]; total: number; page: number; limit: number }> {
    const { data, total } = await this.shipmentsService.getShipments({
      page,
      limit,
      include: {
        car,
        user,
      },
    });
    return { data, total, page, limit };
  }

  // GET /shipments
  @Get()
  @UseGuards(JwtAuthGuard)
  async getShipments(
    @Request() req,
    @Query('car', new DefaultValuePipe(false), ParseBoolPipe)
    car: boolean,
    @Query('user', new DefaultValuePipe(false), ParseBoolPipe)
    @Query('page', ParseIntPipe)
    page: number = 1,
    @Query('limit', ParseIntPipe)
    limit: number = 10,
    user: boolean,
  ): Promise<{ data: Shipment[]; total: number; page: number; limit: number }> {
    const { data, total } = await this.shipmentsService.getShipments({
      page,
      limit,
      where: {
        userId: req.user.id,
      },
      include: {
        car,
        user,
      },
    });
    return { data, total, page, limit };
  }

  // GET /shipments/1
  @Get(':shipmentId')
  @UseGuards(JwtAuthGuard)
  async getShipment(
    @Param('shipmentId', ParseIntPipe) id: string,
    @Request() req,
  ): Promise<Shipment> {
    const shipment = await this.shipmentsService.shipment({ id });
    return shipment;
  }

  // POST /shipments
  // Create Shipment
  @Post()
  @UseGuards(JwtAuthGuard)
  async createShipment(
    @Request() req,
    @Body(ValidationPipe) createShipment: CreateShipmentDTO,
  ) {
    // extract input data
    const { carId, userId, ...restBody } = createShipment;
    // extract user id from request
    const shipmentUserId = req.user.id;
    // create shipment
    const newShipment = await this.shipmentsService.createShipment({
      ...restBody,
      car: {
        connect: {
          id: carId,
        },
      },
      user: {
        connect: {
          id: shipmentUserId,
        },
      },
    });

    return {
      data: newShipment,
    };
  }

  // PATCH /shipments/1
  @Patch(':shipmentId')
  @UseGuards(JwtAuthGuard)
  async updateShipment(
    @Param('shipmentId', ParseIntPipe) id: string,
    @Body(ValidationPipe) updateShipmentDto: CreateShipmentDTO,
  ): Promise<Shipment> {
    return this.shipmentsService.updateShipment({
      where: { id },
      data: updateShipmentDto,
    });
  }
}
