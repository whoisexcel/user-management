import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/service/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class SeederService {
  constructor(private usersService: UsersService) {}

  async seed() {
    const adminUser: CreateUserDto = {
      username: 'admin',
      email: 'admin@example.com',
      password: 'admin123',
      fullName: 'Admin User',
      roles: ['admin'],
    };

    const existingUser = await this.usersService.findByUsername(
      adminUser.username,
    );
    if (!existingUser) {
      await this.usersService.createUser(adminUser);
    } else {
      console.log('Admin user already exists');
    }
  }
}
