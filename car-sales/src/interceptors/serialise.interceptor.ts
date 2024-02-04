import { CallHandler, ExecutionContext, NestInterceptor, UseInterceptors } from "@nestjs/common";
import { ClassConstructor, plainToClass } from "class-transformer";
import { Observable, map } from "rxjs";

export function Serialize<T>(dto: ClassConstructor<T>) {
  return UseInterceptors(new SerializeInterceptor(dto))
}

// custom interceptor instead of ClassSerializerInterceptor such that we can
// serialise based on different DTOs instead of having just one kind of serialisation
export class SerializeInterceptor<T> implements NestInterceptor {
  constructor(
    private dto: ClassConstructor<T>
  ) {}
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
    // run before request is handled by request handler
    return next.handle().pipe(
      map((data: T) => {
        // run something before the response is sent
        // console.log('interceptor data', data);
        return plainToClass(this.dto, data, {
          excludeExtraneousValues: true, // removes properties not in DTO
        });
      }),
    );
  }
}
