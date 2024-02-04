import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Query, Session, UseGuards } from '@nestjs/common';
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
import { CurrentUser } from './decorators/current-user.decorator';

// we may put serializers at controller-wide level or method level
@Controller('auth')
// @UseInterceptors(CurrentUserInterceptor)
// @UseInterceptors(ClassSerializerInterceptor)
@Serialize(UserDto)
export class UsersController {

  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('/sign-up')
  async signUp(@Body() body: CreateUserDto, @Session() session: SessionData): Promise<User> {
    const user = await this.authService.signUp(body);
    session.userId = user.id;
    return user;
  }

  @Post('/sign-in')
  async signIn(@Body() body: SignInDto, @Session() session: SessionData): Promise<User> {
    const user = await this.authService.signIn(body);
    session.userId = user.id;
    return user;
  }

  @UseGuards(AuthGuard)
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

  // uses special interceptor and decorator
  @Get('/whoami2')
  async whoAmI2(@CurrentUser() user: User) {
    return user;
  }

  @UseGuards(AuthGuard)
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

  @Get('/user')
  async findAllUsers(@Query('email') email: string) {
    return this.usersService.find(email);
  }

  @Delete('/user/:id')
  removeUser(@Param('id') id: string) {
    return this.usersService.remove(parseInt(id));
  }

  @Patch('/user/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.usersService.update(parseInt(id), body);
  }

  // // test for setting session cookies
  // @Get('/colors/:color')
  // setColor(@Param('color') color: string, @Session() session: any) {
  //   session.color = color;
  // }

  // @Get('/colors')
  // getColor(@Session() session: any) {
  //   return session.color;
  // }

}
