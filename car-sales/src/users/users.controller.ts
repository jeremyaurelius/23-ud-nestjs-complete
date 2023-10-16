import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Query, ClassSerializerInterceptor, UseInterceptors } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';

@Controller('auth')
export class UsersController {

  constructor(
    private usersService: UsersService
  ) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  async createUser(@Body() body: CreateUserDto): Promise<User> {
    console.log('body', body);
    const user = await this.usersService.create(body);
    console.log('user', user);
    return user;
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/:id')
  async findUser(@Param('id') id: string) {
    const user = await this.usersService.findOne(parseInt(id));
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async findAllUsers(@Query('email') email: string) {
    return this.usersService.find(email);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Delete('/:id')
  removeUser(@Param('id') id: string) {
    return this.usersService.remove(parseInt(id));
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.usersService.update(parseInt(id), body);
  }

}
