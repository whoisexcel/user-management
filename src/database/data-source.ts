import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from '../users/user.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ConfigModuleOptions } from '@nestjs/config/dist/interfaces';
import { join } from 'path';

ConfigModule.forRoot({
  isGlobal: true,
} as ConfigModuleOptions);

const configService = new ConfigService();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: configService.get<string>('DB_HOST'),
  port: +configService.get<number>('DB_PORT'),
  username: configService.get<string>('DB_USERNAME'),
  password: configService.get<string>('DB_PASSWORD'),
  database: configService.get<string>('DB_NAME'),
  entities: [User],
  migrations: ['dist/migrations/*{.ts,.js}'],
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
