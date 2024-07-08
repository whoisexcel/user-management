import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { AuthCredentialsDto } from '../dto/auth-credentials.dto';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  async login(
    @Body() AuthCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.login(AuthCredentialsDto);
  }
}
