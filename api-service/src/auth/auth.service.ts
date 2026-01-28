
import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';

@Injectable()
export class AuthService {
    constructor(private userService: UserService) { }

    async validateUser(details: Partial<User>): Promise<User> {
        // Save tokens and user info
        return this.userService.createOrUpdate(details);
    }
}
