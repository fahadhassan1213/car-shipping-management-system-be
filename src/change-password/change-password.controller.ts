import { Controller } from '@nestjs/common';
import { Body, Patch, Request, UseGuards } from '@nestjs/common/decorators';
import { ValidationPipe } from '@nestjs/common/pipes';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ChangePasswordService } from './change-password.service';
import { UserAuthChangePassDto } from './dto/change-pass.dto';

@Controller('change-password')
export class ChangePasswordController {
  constructor(private changePasswordService: ChangePasswordService) {}

  @Patch('/user')
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @Body(ValidationPipe) data: UserAuthChangePassDto,
    @Request() req,
  ) {
    const user = req.user;
    return this.changePasswordService.authChangePassword({
      ...data,
      userID: user.id,
    });
  }
}
