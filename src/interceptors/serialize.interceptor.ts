import { UseInterceptors , NestInterceptor, CallHandler, ExecutionContext } from "@nestjs/common";
import { Observable, map } from "rxjs";
import { UserDto } from "src/users/dtos";
import { plainToClass } from "class-transformer";

interface ClassConstructor {
    new (...args:any[]):{}
}

export function Serialize(dto:ClassConstructor){
   return UseInterceptors(new SerializeInterceptor(dto))

}


export class SerializeInterceptor implements NestInterceptor{
    
    constructor(private dto: any){}

    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {


        // do something befor a request is handled 
        // console.log("Before running",context)

        return next.handle().pipe(map((data:any)=>{
            // do something before request is sent out
            // console.log("Im running ",data)
            return plainToClass(this.dto , data, {
                excludeExtraneousValues:true  // 
            }) // convert user data to exclude certain values

        }))

    }
}