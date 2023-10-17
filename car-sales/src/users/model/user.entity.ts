import { Exclude } from "class-transformer";
import { AfterInsert, AfterRemove, AfterUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  @Exclude() // exclude password when serializing to JSON when used with ClassSerializerInterceptor on controller routes
  password: string;

  @AfterInsert()
  logInsert() {
    console.log('inserted user with id', this.id);
  }

  @AfterRemove()
  logRemove() {
    console.log('removed user', this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('updated user', this.id);
  }
}
