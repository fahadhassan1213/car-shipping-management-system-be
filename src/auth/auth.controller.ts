import {
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { CreateUserDto } from 'src/users/dto/users.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // POST /auth/user/login
  @UseGuards(LocalAuthGuard)
  @Post('user/login')
  async userLogin(@Request() req) {
    return this.authService.userLogin(req.user);
  }

  // POST /auth/user/register
  @Post('user/register')
  async userRegister(@Body(ValidationPipe) registerDto: CreateUserDto) {
    return this.authService.userRegister(registerDto);
  }

  // POST /auth/admin/login
  @UseGuards(LocalAuthGuard)
  @Post('admin/login')
  async adminLogin(@Request() req) {
    return this.authService.adminLogin(req.user);
  }
}
