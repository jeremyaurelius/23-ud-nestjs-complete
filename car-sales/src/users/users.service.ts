import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './model/user.entity';
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
    // NOTE: we may also use, BUT this will not execute the hooks nor will it execute any validation defined on the entity
    // return this.repo.save({ email: user.email, password: user.password });
  }

  findOne(id: number) {
    return this.repo.findOneBy({ id });
  }

  async find(email: string): Promise<User[]> {
    return this.repo.find({ where: { email }});
  }

  async update(id: number, attrs: Partial<User>) {
    // to be able to use save() such that we can trigger entity hooks, we first need to fetch the
    // user from the DB
    // however this is inefficient
    // we may use the update method instead where we do not need to fetch the entity from the db first
    // but lose the hooks functionality
    const user = await this.repo.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    Object.assign(user, attrs);
    return this.repo.save(user);
  }

  async remove(id: number) {
    // to be able to use remove() such that we can trigger entity hooks, we first need to fetch the
    // user from the DB
    // however this is inefficient
    // we may use the delete method instead where we do not need to fetch the entity from the db first
    // but lose the hooks functionality
    const user = await this.repo.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.repo.remove(user);
  }
}
