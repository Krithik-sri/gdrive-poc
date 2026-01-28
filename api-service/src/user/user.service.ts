
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    findAll(): Promise<User[]> {
        return this.usersRepository.find();
    }

    findOne(id: number): Promise<User | null> {
        return this.usersRepository.findOneBy({ id });
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.usersRepository.findOneBy({ email });
    }

    async createOrUpdate(userData: Partial<User>): Promise<User> {
        const { email } = userData;
        if (!email) {
            throw new Error('Email is required');
        }
        let user = await this.findByEmail(email);
        if (user) {
            user = this.usersRepository.merge(user, userData);
        } else {
            user = this.usersRepository.create(userData);
        }
        return this.usersRepository.save(user);
    }
}
