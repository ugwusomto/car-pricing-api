import { IsString , IsEmail, IsOptional  } from "class-validator";
import { Expose } from "class-transformer";

export class CreateUserDto{

    @IsEmail()
    email:string;

    @IsString()
    password:string
}

export class UpdateUserDto{

    @IsEmail()
    @IsOptional()
    email:string;

    @IsString()
    @IsOptional()
    password:string
}

export class UserDto{
    @Expose()
    id:number

    @Expose()
    email:string
}