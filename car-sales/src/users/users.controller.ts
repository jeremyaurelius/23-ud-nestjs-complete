import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Controller('auth')
export class UsersController {

  constructor(
    private usersService: UsersService
  ) {}

  @Post()
  async createUser(@Body() body: CreateUserDto): Promise<User> {
    // TODO:
    console.log('body', body);
    const user = await this.usersService.create(body);
    console.log('user', user);
    return user;
  }
}
