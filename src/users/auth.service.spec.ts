import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe("AuthService", () => {

    let service: AuthService;
    let fakeUserService: Partial<UsersService>;
    beforeEach(async () => {
        // Create a fake copy of the users service
        const users: User[] = [];
        fakeUserService = {
          find: (email: string) => {
            const filteredUsers = users.filter((user) => user.email === email);
            return Promise.resolve(filteredUsers);
          },
          create: (email: string, password: string) => {
            const user = {
              id: Math.floor(Math.random() * 999999),
              email,
              password,
            } as User;
            users.push(user);
            return Promise.resolve(user);
          },
        };
    
        const module = await Test.createTestingModule({
          providers: [
            AuthService,
            {
              provide: UsersService,
              useValue: fakeUserService,
            },
          ],
        }).compile();
    
        service = module.get(AuthService);
      });

    it('can create an instance of auth service', async () => {
        expect(service).toBeDefined()
    })

    it('creates a new user with a salted hashed password', async () => {
        const user = await service.signup('asdf@asdf.com', 'asdf');
        expect(user.password).not.toEqual('asdf');
        const [salt, hash] = user.password.split('.');
        expect(salt).toBeDefined();
        expect(hash).toBeDefined();
    })

    it('throws an error if user signs up with email that is in use', async () => {
        fakeUserService.find = () =>
            Promise.resolve([{ id: 1, email: 'a', password: '1' } as User]);
        await expect(service.signup('asdf@asdf.com', 'asdf')).rejects.toThrow(
            BadRequestException,
        );
    });

    it('throws if signin is called with an unused email', async () => {
        await expect(
            service.signin('asdflkj@asdlfkj.com', 'passdflkj'),
        ).rejects.toThrow(NotFoundException);
    });

    it('throws if an invalid password is provided', async () => {
        await service.signup('laskdjf@alskdfj.com', 'password');
        await expect(
            service.signin('laskdjf@alskdfj.com', 'laksdlfkj'),
        ).rejects.toThrow(BadRequestException);
    });

    it('returns a user if correct password is provided', async () => {
        await service.signup('asdf@asdf.com', 'mypassword');
        const user = await service.signin('asdf@asdf.com', 'mypassword');
        expect(user).toBeDefined();
      });

})




