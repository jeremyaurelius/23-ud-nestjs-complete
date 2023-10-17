import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dtos/create-user.dto";
import { BinaryLike, ScryptOptions, randomBytes, scrypt } from "crypto";
import { promisify } from "util";

const scryptPromise = promisify(scrypt) as
  (password: BinaryLike, salt: BinaryLike, keyLen: number, options?: ScryptOptions) => Promise<Buffer>;

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
  ) {}

  async signUp(user: CreateUserDto) {
    // check if email is in use
    const existingUser = await this.usersService.find(user.email);
    if (existingUser.length) {
      throw new BadRequestException('User with email already exists');
    }

    // hash password
    const hashAndSalt = await this._hashPassword(user.password);

    // create new user and save it
    const createdUser = await this.usersService.create({
      ...user,
      password: hashAndSalt,
    });

    // return the user
    return createdUser;
  }

  /**
   * Hashes password with a random salt and returns a promise
   * of the salt joined with the resulting hash, separated by a '.' character.
   */
  private async _hashPassword(password: string) {
    // generate salt
    const salt = randomBytes(8).toString('hex');
    return this._hashPasswordUsingSalt(password, salt);
  }

  /**
   * Hashes password with a provided salt and returns a promise
   * of the salt joined with the resulting hash, separated by a '.' character.
   */
  private async _hashPasswordUsingSalt(password: string, salt: string) {
    // hash password and salt
    const hash = await scryptPromise(password, salt, 32);
    // join salt and hash with a dot as separator
    return salt + '.' + hash.toString('hex');
  }

  private async _validatePassword(password: string, hashAndSalt: string) {
    const [salt, hash] = hashAndSalt.split('.');
    const hashAndSalt2 = await this._hashPasswordUsingSalt(password, salt);
    return hashAndSalt === hashAndSalt2;
  }

  async signIn(params: { email: string, password: string }) {
    // find user
    const [existingUser] = await this.usersService.find(params.email);
    if (!existingUser) {
      throw new NotFoundException('User not found.');
    }
    const isValidPassword = await this._validatePassword(params.password, existingUser.password);
    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return existingUser;
  }
}