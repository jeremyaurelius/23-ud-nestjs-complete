import { ExecutionContext, createParamDecorator } from '@nestjs/common';

// current user decorator allows us to get current user in the controller methods

// context can abstract an http request, a websocket request, a GraphQL request, a GRPC request
// we use the never type since CurrentUser does not accept any parameters
export const CurrentUser = createParamDecorator((data: never, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest();
  return request.currentUser; // currentUser is set by interceptor
});