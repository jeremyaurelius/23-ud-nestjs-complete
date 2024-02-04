import { Expose } from "class-transformer";

/**
 * Dto that only contains user's contact details
 */
export class UserContactDetailsDto {
  @Expose()
  email: string;
}