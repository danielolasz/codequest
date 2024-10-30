import { Controller, Post, Body, HttpException, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { Public } from './constants';
import { User } from 'src/user/user.schema';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  async login(@Body() credentials: LoginDto) {
    try {
      const user: User = await this.authService.validateUser(
        credentials.email,
        credentials.password,
      );
      const token: string = await this.authService.generateToken({ email: user.email });
      return { message: 'Login successful', user, token };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
      }
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
