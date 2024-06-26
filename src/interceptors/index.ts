import { NestInterceptor, ExecutionContext , CallHandler , Injectable } from "@nestjs/common";
import { UsersService } from "src/users/users.service";
import { Observable, map } from "rxjs";


export class CurrentUserInterceptor implements NestInterceptor{

    constructor(private userService:UsersService){}

   async intercept(context: ExecutionContext, next: CallHandler<any>): Promise<Observable<any>> {
        const request = context.switchToHttp().getRequest();
        const { userId } = request.session || {};

        if(userId){
            const user = await this.userService.findOne(userId);
           request.currentUser = user;

        }

        return next.handle() 
    }

}