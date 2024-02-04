import { Expose } from 'class-transformer';

/**
 * DTO used for serialisation into the JSON response for the User entity using the SerializeInterceptor class
 * 
 * This is an alternative to using the @Exclude property in the User entity
 */
export class UserDto {
  // only include properties exposed during serialisation
  @Expose()
  id: number;

  @Expose()
  email: string;
}
