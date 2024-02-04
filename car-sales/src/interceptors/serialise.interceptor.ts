import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { ClassConstructor, plainToClass } from "class-transformer";
import { Observable, map } from "rxjs";
import { UserDto } from "src/users/dtos/user.dto";

// custom interceptor instead of ClassSerializerInterceptor such that we can
// serialise based on different DTOs instead of having just one kind of serialisation
export class SerializeInterceptor implements NestInterceptor {
  constructor(
    private dto: ClassConstructor<any>
  ) {}
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
    // run before request is handled by request handler
    return next.handle().pipe(
      map((data: any) => {
        console.log('serialise data', data);
        // run something before the response is sent
        // console.log('interceptor data', data);
        return plainToClass(this.dto, data, {
          excludeExtraneousValues: true, // removes properties not in DTO
        });
      }),
    );
  }
}
