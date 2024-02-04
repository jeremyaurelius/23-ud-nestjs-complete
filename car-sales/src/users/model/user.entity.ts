// import { Exclude } from "class-transformer";
import { AfterInsert, AfterRemove, AfterUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  // here we'll use an interceptor instead of @Exclude() to remove the password field from the response
  // @Exclude() // exclude password when serializing to JSON when used with ClassSerializerInterceptor on controller routes
  @Column() 
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
