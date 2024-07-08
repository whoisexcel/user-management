import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;
  let configService: ConfigService;

  const mockUsersService = {
    findByUsername: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn().mockReturnValue('testSecret'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user without password if validation is successful', async () => {
      const mockUser = { username: 'testuser', password: 'testpass' };
      jest.spyOn(usersService, 'findByUsername').mockResolvedValue(mockUser as any);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await authService.validateUser('testuser', 'testpass');
      expect(result).toEqual({ username: 'testuser' });
    });

    it('should return null if validation fails', async () => {
      jest.spyOn(usersService, 'findByUsername').mockResolvedValue(null);

      const result = await authService.validateUser('invaliduser', 'testpass');
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return an access token if credentials are valid', async () => {
      const authCredentialsDto: AuthCredentialsDto = { username: 'testuser', password: 'testpass' };
      const mockUser = { username: 'testuser', password: 'testpass', role: 'user' };
      jest.spyOn(authService, 'validateUser').mockResolvedValue(mockUser as any);
      jest.spyOn(jwtService, 'sign').mockReturnValue('testToken');

      const result = await authService.login(authCredentialsDto);
      expect(result).toEqual({ accessToken: 'testToken' });
    });

    it('should throw an UnauthorizedException if credentials are invalid', async () => {
      const authCredentialsDto: AuthCredentialsDto = { username: 'invaliduser', password: 'testpass' };
      jest.spyOn(authService, 'validateUser').mockResolvedValue(null);

      await expect(authService.login(authCredentialsDto)).rejects.toThrow(UnauthorizedException);
    });
  });
});
