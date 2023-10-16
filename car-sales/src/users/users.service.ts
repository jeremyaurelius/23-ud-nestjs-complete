import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dtos/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    // inject a repository based on the User entity
    // The reason we need the @InjectRepository(User) decorator is because generics are not added in TS metadata
    @InjectRepository(User) private repo: Repository<User>,
  ) {}

  /**
   * Creates a user.
   */
  create(userDto: CreateUserDto) {
    // create - creates an instance of an entity but does not persist it to the DB
    // save - adds/updates record to DB
    const user = this.repo.create(userDto);
    return this.repo.save(user);
  }
}
