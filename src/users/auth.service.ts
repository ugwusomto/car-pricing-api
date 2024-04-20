import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _script } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_script);

@Injectable()
export class AuthService {

    private userService: UsersService

    constructor(
        @InjectRepository(User)
        _userService: UsersService) {
        this.userService = _userService
    }
 
    async signup(email: string, password: string) {
        const salt = randomBytes(8).toString('hex');
        const hash = (await scrypt(password, salt, 32)) as Buffer;
        const result = `${salt}.${hash.toString('hex')}`
        const user = await this.userService.create(email, result);
        return user
    }

    async signin (email: string, password: string) {
        const [user] = await this.userService.find(email);
        if(!user){
            throw new NotFoundException('User not found')
        }
        const [salt , storedHash] = user.password.split('.');
        const hash = (await scrypt(password , salt , 32)) as Buffer
        if(storedHash !== hash.toString("hex")){
            throw new NotFoundException('User not found')
        }
        return user
    }

}
