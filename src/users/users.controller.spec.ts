// src/users/users.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUsersFilterDto } from './dto/get-users-filter.dto';
import { User } from '../users/user.entity';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUser = {
    id: 1,
    username: 'testuser',
    email: 'test@example.com',
    password: 'hashedpassword',
    fullName: 'Test User',
    roles: ['user'],
  };

  const mockUsersService = {
    createUser: jest.fn().mockResolvedValue(mockUser),
    getUserById: jest.fn().mockResolvedValue(mockUser),
    updateUser: jest.fn().mockResolvedValue(mockUser),
    deleteUser: jest.fn().mockResolvedValue(undefined),
    getUsers: jest.fn().mockResolvedValue({ users: [mockUser], total: 1 }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a new user', async () => {
    const createUserDto: CreateUserDto = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password',
      fullName: 'Test User',
      roles: ['user'],
    };

    const result = await controller.createUser(createUserDto);
    expect(result).toEqual(mockUser);
    expect(service.createUser).toHaveBeenCalledWith(createUserDto);
  });

  it('should return a user by ID', async () => {
    const result = await controller.getUserById(1);
    expect(result).toEqual(mockUser);
    expect(service.getUserById).toHaveBeenCalledWith(1);
  });

  it('should update a user', async () => {
    const updateUserDto: UpdateUserDto = {
      email: 'updated@example.com',
      fullName: 'Updated User',
    };

    const result = await controller.updateUser(1, updateUserDto);
    expect(result).toEqual(mockUser);
    expect(service.updateUser).toHaveBeenCalledWith(1, updateUserDto);
  });

  it('should delete a user', async () => {
    const result = await controller.deleteUser(1);
    expect(result).toBeUndefined();
    expect(service.deleteUser).toHaveBeenCalledWith(1);
  });

  it('should return all users', async () => {
    const filterDto: GetUsersFilterDto = {
      username: 'testuser',
      email: 'test@example.com',
      limit: 10,
      page: 1,
    };

    const result = await controller.getUsers(filterDto);
    expect(result).toEqual({ users: [mockUser], total: 1 });
    expect(service.getUsers).toHaveBeenCalledWith(filterDto);
  });
});
