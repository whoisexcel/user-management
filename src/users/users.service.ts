import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUsersFilterDto } from './dto/get-users-filter.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { username, email, password, fullName } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.userRepository.create({
      username,
      email,
      password: hashedPassword,
      fullName,
    });

  
    await this.userRepository.save(user);
    return user;
  }

  async getUserById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByUsername(username: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { username } });
    return user;
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.getUserById(id);
    const { email, fullName } = updateUserDto;
    user.email = email;
    user.fullName = fullName;
    await this.userRepository.save(user);
    return user;
  }

  async deleteUser(id: number): Promise<void> {
    const user = await this.getUserById(id);
    user.isActive = false;
    await this.userRepository.save(user);
  }

  async getUsers(filterDto: GetUsersFilterDto): Promise<User[]> {
    const { username, email } = filterDto;
    const query = this.userRepository.createQueryBuilder('user');

    if (username) {
      query.andWhere('user.username LIKE :username', {
        username: `%${username}%`,
      });
    }

    if (email) {
      query.andWhere('user.email LIKE :email', { email: `%${email}%` });
    }

    const users = await query.getMany();
    return users;
  }
}
