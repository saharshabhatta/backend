import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { IsAuthenticatedGuard } from './guards/authenticated.guard';
import { StaffGuard } from './guards/staff.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() payload: SignInDto) {
    const { email, password } = payload;
    return this.authService.signIn(email, password);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  @UseGuards(IsAuthenticatedGuard, StaffGuard)
  signUp(@Body() payload: CreateUserDto) {
    return this.authService.singUp(payload);
  }
}
