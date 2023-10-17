import { CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";

export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const session = request.session as SessionData;
    if (!session.userId) {
      throw new UnauthorizedException('Not authenticated.');
    }
    return true;
    // return !!session.userId; // this will trigger a ForbiddenException if false
  }
}
