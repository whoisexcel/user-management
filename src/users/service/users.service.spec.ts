import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UserRepository } from '../user.repository';
import { User } from '../entity/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { GetUsersFilterDto } from '../dto/get-users-filter.dto';
import {
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('UsersService', () => {
  let service: UsersService;
  let repository: UserRepository;

  const mockUser = {
    id: 1,
    username: 'testuser',
    email: 'test@example.com',
    password: 'hashedpassword',
    fullName: 'Test User',
    roles: ['user'],
    isActive: true,
  };

  const mockUsersRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnValue({
      andWhere: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn().mockResolvedValue([[mockUser], 1]),
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UserRepository,
          useValue: mockUsersRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<UserRepository>(UserRepository);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('should create and return a new user', async () => {
      const createUserDto: CreateUserDto = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password',
        fullName: 'Test User',
        roles: ['user'],
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      jest.spyOn(repository, 'create').mockReturnValue(mockUser as any);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedpassword');
      jest.spyOn(repository, 'save').mockResolvedValue(mockUser as any);

      const result = await service.createUser(createUserDto);
      expect(result).toEqual(mockUser);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: [{ username: 'testuser' }, { email: 'test@example.com' }],
      });
      expect(repository.create).toHaveBeenCalledWith({
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashedpassword',
        fullName: 'Test User',
        roles: ['user'],
      });
      expect(repository.save).toHaveBeenCalledWith(mockUser);
    });

    it('should throw ConflictException if user already exists', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockUser as any);

      const createUserDto: CreateUserDto = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password',
        fullName: 'Test User',
        roles: ['user'],
      };

      await expect(service.createUser(createUserDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw BadRequestException if required fields are missing', async () => {
      const createUserDto: CreateUserDto = {
        username: 'testuser',
        email: '',
        password: '',
        fullName: '',
        roles: ['user'],
      };

      await expect(service.createUser(createUserDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('getUserById', () => {
    it('should return the user if found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockUser as any);

      const result = await service.getUserById(1);
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.getUserById(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateUser', () => {
    it('should update and return the user', async () => {
      const updateUserDto: UpdateUserDto = {
        email: 'updated@example.com',
        fullName: 'Updated User',
      };

      jest.spyOn(service, 'getUserById').mockResolvedValue(mockUser as any);
      jest.spyOn(repository, 'save').mockResolvedValue(mockUser as any);

      const result = await service.updateUser(1, updateUserDto);
      expect(result).toEqual(mockUser);
      expect(repository.save).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('deleteUser', () => {
    it('should soft delete the user', async () => {
      jest.spyOn(service, 'getUserById').mockResolvedValue(mockUser as any);
      jest.spyOn(repository, 'save').mockResolvedValue(mockUser as any);

      const result = await service.deleteUser(1);
      expect(result).toBe('this user is soft deleted');
      expect(repository.save).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('getUsers', () => {
    it('should return users and total count', async () => {
      const filterDto: GetUsersFilterDto = {
        username: 'testuser',
        email: 'test@example.com',
        page: 1,
        limit: 10,
      };

      const result = await service.getUsers(filterDto);
      expect(result).toEqual({ users: [mockUser], total: 1 });
      expect(repository.createQueryBuilder).toHaveBeenCalled();
    });
  });
});
