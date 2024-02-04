import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { UsersService } from "../users.service";

// interceptor used to get user from UserService and add it to the request so that
// the decorator can access it. This is because decorators cannot access DI and hence the user service
@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {

  constructor(private usersService: UsersService) {}

  async intercept(context: ExecutionContext, next: CallHandler<any>) {
    const request = context.switchToHttp().getRequest();
    const { userId } = request.session || {};
    if (userId) {
      const user = await this.usersService.findOne(userId);
      // add user to request so that decorator can access it
      request.currentUser = user;
    }
    return next.handle();
  }
}