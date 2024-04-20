import { Controller, Get, Post, Patch, Delete, Body, Param, Query, NotFoundException, UseInterceptors, ClassSerializerInterceptor, Session, UseGuards } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto, UserDto } from './dtos';
import { UsersService } from './users.service';
import { Serialize, SerializeInterceptor } from 'src/interceptors/serialize.interceptor';
import { AuthService } from './auth.service';
import { CurrentUser } from 'src/decorators';
import { CurrentUserInterceptor } from 'src/interceptors';
import { User } from './user.entity';
import { AuthGaurd } from 'src/guards';



@Controller('auth')
@Serialize(UserDto)
// @UseInterceptors(CurrentUserInterceptor) // controller based
export class UsersController {

    private userService: UsersService
    private authService: AuthService


    constructor(_userService: UsersService, _authService: AuthService) {
        this.userService = _userService
        this.authService = _authService

    }

    @Get('/get-color')
    setColor(@Param('color') color: string, @Session() session: any) {
        session.color = color
    }

    @Get('/whoami')
    @UseGuards(AuthGaurd)
    whoAmI(@CurrentUser() user: User) {
        return user;
    }

    @Get('/whoami')
    signOut(@Session() session: any) {
        session.userId = null;
    }

    @Post("/signup")
    async createUser(@Body() body: CreateUserDto, @Session() session: any) {
        const user = await this.authService.signup(body.email, body.password);
        session.userId = user.id;
        return user
    }

    @Post("/signin")
    async signIn(@Body() body: CreateUserDto, @Session() session: any) {
        const user = await this.authService.signin(body.email, body.password);
        session.userId = user.id;
        return user;
    }

    @Get('/:id')
    async findUser(@Param('id') id: string) {
        const result = await this.userService.findOne(parseInt(id))
        if (!result) {
            throw new NotFoundException("User not found")
        }
        if (result.length > 0) {
            return result[0];
        }
        return result
    }

    @Get()
    findAllUsers(@Query('email') email: string) {
        return this.userService.find(email)
    }

    @Delete("/:id")
    removeUser(@Param('id') id: string) {
        return this.userService.remove(parseInt(id))
    }

    @Patch("/:id")
    updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
        this.userService.update(parseInt(id), body);
    }

}
