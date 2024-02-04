import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './model/user.entity';
import { AuthService } from './auth.service';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    AuthService,
  ],
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
  ],
})
export class UsersModule {}
