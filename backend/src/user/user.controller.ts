import { Controller, Get, Post, Body, HttpException, HttpStatus, ConflictException, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { SignUpDto } from './dto/signup.dto'
import { Public } from 'src/auth/constants';

@Controller('users')
export class UserController {
  constructor(private readonly usersService: UserService) {}
  
  @Public()
  @Post('signup')
  async signup(@Body() signUpDto: SignUpDto) {
    try {
      const user = await this.usersService.create(signUpDto);
      return { message: 'User created successfully', user };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      }
      console.error(error);
      throw new HttpException('Internal server error ' + error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  async findAll(@Res() res) {
    const users = await this.usersService.findAll();
    return res.json(users);
  }
}
