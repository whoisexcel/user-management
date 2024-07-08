import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../service/auth.service';
import { AuthCredentialsDto } from '../dto/auth-credentials.dto';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    login: jest.fn((dto: AuthCredentialsDto) => {
      return {
        accessToken: 'testAccessToken',
      };
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('login', () => {
    it('should return an access token', async () => {
      const authCredentialsDto: AuthCredentialsDto = {
        username: 'testuser',
        password: 'testpass',
      };
      const result = await authController.login(authCredentialsDto);
      expect(result).toEqual({ accessToken: 'testAccessToken' });
      expect(authService.login).toHaveBeenCalledWith(authCredentialsDto);
    });
  });
});
