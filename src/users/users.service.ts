import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
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
    const { username, email, password, fullName, roles } = createUserDto;

    if (!username || !email || !password || !fullName) {
      throw new BadRequestException('Missing required fields');
    }

    const existingUser = await this.userRepository.findOne({
      where: [{ username }, { email }],
    });

    if (existingUser) {
      throw new ConflictException('Username or email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.userRepository.create({
      username,
      email,
      password: hashedPassword,
      fullName,
      roles: roles || ['user']
    });

    await this.userRepository.save(user);
    return user;
  }

  async getUserById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'username', 'email', 'fullName'],
    });
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

  async deleteUser(id: number): Promise<void | string> {
    const user = await this.getUserById(id);
    user.isActive = false;
    await this.userRepository.save(user);
    return "this user is soft deleted"
  }

  async getUsers(filterDto: GetUsersFilterDto): Promise<{ users: User[], total: number }> {
    const { username, email, page = 1, limit = 10 } = filterDto;

    const query = this.userRepository.createQueryBuilder('user');

    if (username) {
      query.andWhere('user.username LIKE :username', { username: `%${username}%` });
    }

    if (email) {
      query.andWhere('user.email LIKE :email', { email: `%${email}%` });
    }

    query.skip((page - 1) * limit).take(limit);

    const [users, total] = await query.getManyAndCount();

    return { users, total };
  }
}
