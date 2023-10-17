import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Query, ClassSerializerInterceptor, UseInterceptors, Session, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from './model/user.entity';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { AuthService } from './auth.service';
import { SignInDto } from './dtos/sign-in.dto';

@Controller('auth')
export class UsersController {

  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('/sign-up')
  async signUp(@Body() body: CreateUserDto, @Session() session: SessionData): Promise<User> {
    const user = await this.authService.signUp(body);
    session.userId = user.id;
    return user;
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('/sign-in')
  async signIn(@Body() body: SignInDto, @Session() session: SessionData): Promise<User> {
    const user = await this.authService.signIn(body);
    session.userId = user.id;
    return user;
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/whoami')
  async whoAmI(@Session() session: SessionData): Promise<User> {
    if (!session.userId) {
      throw new UnauthorizedException('Not authenticated.');
    }
    const user = await this.usersService.findOne(session.userId);
    if (!user) {
      throw new NotFoundException('User not found.')
    }
    return user;
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('/sign-out')
  async signOut(@Session() session: SessionData): Promise<{ loggedOut: boolean }> {
    if (!session.userId) {
      throw new UnauthorizedException('Not authenticated.');
    }
    session.userId = null;
    return {
      loggedOut: true
    };
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/user/:id')
  async findUser(@Param('id') id: string) {
    const user = await this.usersService.findOne(parseInt(id));
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/user')
  async findAllUsers(@Query('email') email: string) {
    return this.usersService.find(email);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Delete('/user/:id')
  removeUser(@Param('id') id: string) {
    return this.usersService.remove(parseInt(id));
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Patch('/user/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.usersService.update(parseInt(id), body);
  }

  // // test for setting session cookies
  // @UseInterceptors(ClassSerializerInterceptor)
  // @Get('/colors/:color')
  // setColor(@Param('color') color: string, @Session() session: any) {
  //   session.color = color;
  // }

  // @UseInterceptors(ClassSerializerInterceptor)
  // @Get('/colors')
  // getColor(@Session() session: any) {
  //   return session.color;
  // }

}
