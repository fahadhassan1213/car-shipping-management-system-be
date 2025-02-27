import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/decorator/roles.decorator';
import { Role } from 'src/enums/role.enum';
import { RolesGuard } from 'src/guard/roles.guard';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getUser(@Request() req) {
    return this.usersService.user(
      { id: req.user.id },
      {
        select: {
          id: true,
          name: true,
          email: true,
          password: false,
          roles: {
            select: {
              role: true,
            },
          },
        },
      },
    );
  }

  @Get()
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getAllUsers() {
    return this.usersService.users(
      {},
      {
        select: {
          id: true,
          name: true,
          email: true,
          roles: {
            select: {
              id: true,
              role: true,
            },
          },
          password: false,
        },
      },
    );
  }

  @Get('user')
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getEndUser() {
    return this.usersService.users(
      {
        where: {
          roles: {
            some: {
              role: {
                name: 'user',
              },
            },
          },
        },
      },
      {
        select: {
          name: true,
          email: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    );
  }
}
