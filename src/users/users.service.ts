import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {

    private userRepository: Repository<User>

    constructor(
        @InjectRepository(User)
        _userRepository: Repository<User>) {
        this.userRepository = _userRepository
    }

    create(email: string, password: string) {
        const user = this.userRepository.create({ email, password });
        return this.userRepository.save(user)
    }

    findOne(id: number) {
        if (!id) {
            return null
        }
        const record = this.userRepository.find({ where: { id } });

        return record
    }

    find(email: string) {
        const record = this.userRepository.find({ where: { email } })
        return record
    }

    async update(id: number, attr: Partial<User>) {
        const user = await this.findOne(id);
        if (!user) {
            throw new NotFoundException("User not found")
        }
        Object.assign(user, attr);
        return this.userRepository.save(user)
    }

    async remove(id: number) {
        const user = await this.findOne(id);
        if (!user) {
            throw new NotFoundException("User not found")
        }
        return this.userRepository.remove(user)
    }

}
