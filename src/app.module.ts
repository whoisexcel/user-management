import { Module, MiddlewareConsumer, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { SeederService } from './seeder/seeder.service';
import dataSource from './database/data-source';
import { RateLimiterMiddleware } from './middleware/rate-limiter.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async () => {
        await dataSource.initialize();
        return dataSource.options;
      },
    }),
    UsersModule,
    AuthModule,
  ],
  providers: [SeederService],
})
export class AppModule implements OnModuleInit {
  constructor(private seederService: SeederService) {}

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');

    consumer.apply(RateLimiterMiddleware).forRoutes('api/users');
  }

  async onModuleInit() {
    await this.seederService.seed();
  }
}
