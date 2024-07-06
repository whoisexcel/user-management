import { Module, UseGuards } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtAuthGuard } from './jwt.guard';

@UseGuards(JwtAuthGuard)
@Module({
  imports: [
    UsersModule,
    // PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: '',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
