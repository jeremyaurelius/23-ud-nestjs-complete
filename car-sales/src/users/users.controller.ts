import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Query, UseInterceptors, Session, UnauthorizedException, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from './model/user.entity';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { AuthService } from './auth.service';
import { SignInDto } from './dtos/sign-in.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { Serialize } from 'src/interceptors/serialise.interceptor';
import { UserDto } from './dtos/user.dto';
import { UserContactDetailsDto } from './dtos/user-contact-details.dto';

// we may put serializers at controller-wide level or method level
@Serialize(UserDto)
@Controller('auth')
export class UsersController {

  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  // @UseInterceptors(ClassSerializerInterceptor)
  // @Serialize(UserDto)
  @Post('/sign-up')
  async signUp(@Body() body: CreateUserDto, @Session() session: SessionData): Promise<User> {
    const user = await this.authService.signUp(body);
    session.userId = user.id;
    return user;
  }

  // @UseInterceptors(ClassSerializerInterceptor)
  // @Serialize(UserDto)
  @Post('/sign-in')
  async signIn(@Body() body: SignInDto, @Session() session: SessionData): Promise<User> {
    const user = await this.authService.signIn(body);
    session.userId = user.id;
    return user;
  }

  @UseGuards(AuthGuard)
  // @UseInterceptors(ClassSerializerInterceptor)
  // @Serialize(UserDto)
  @Get('/whoami')
  async whoAmI(@Session() session: SessionData): Promise<User> {
    // handled by guard
    // if (!session.userId) {
    //   throw new UnauthorizedException('Not authenticated.');
    // }
    const user = await this.usersService.findOne(session.userId);
    if (!user) {
      throw new NotFoundException('User not found.')
    }
    return user;
  }

  @UseGuards(AuthGuard)
  // @UseInterceptors(ClassSerializerInterceptor)
  // @Serialize(UserDto)
  @Post('/sign-out')
  async signOut(@Session() session: SessionData): Promise<{ loggedOut: boolean }> {
    // handled by guard
    // if (!session.userId) {
    //   throw new UnauthorizedException('Not authenticated.');
    // }
    session.userId = null;
    return {
      loggedOut: true
    };
  }

  // @UseInterceptors(ClassSerializerInterceptor)
  // @Serialize(UserDto)
  // @Serialize(CustomUserDto)
  @Get('/user/:id')
  async findUser(@Param('id') id: string) {
    const user = await this.usersService.findOne(parseInt(id));
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  // custom method to test custom user dto
  @Serialize(UserContactDetailsDto)
  @Get('/user/contact/:id')
  async getUserContact(@Param('id') id: string) {
    return this.usersService.findOne(parseInt(id));
  }

  // @UseInterceptors(ClassSerializerInterceptor)
  // @Serialize(UserDto)
  @Get('/user')
  async findAllUsers(@Query('email') email: string) {
    return this.usersService.find(email);
  }

  // @UseInterceptors(ClassSerializerInterceptor)
  // @Serialize(UserDto)
  @Delete('/user/:id')
  removeUser(@Param('id') id: string) {
    return this.usersService.remove(parseInt(id));
  }

  // @UseInterceptors(ClassSerializerInterceptor)
  // @Serialize(UserDto)
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
