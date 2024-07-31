import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaService } from './prisma/prisma.service';
import { RolesModule } from './roles/roles.module';
import { ChangePasswordModule } from './change-password/change-password.module';
import { CarsModule } from './cars/cars.module';
import { ShipmentsModule } from './shipments/shipments.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    RolesModule,
    ChangePasswordModule,
    CarsModule,
    ShipmentsModule,
  ],
  controllers: [AppController],
  providers: [PrismaService],
})
export class AppModule {}
