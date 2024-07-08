import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from '../users/entity/user.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';


ConfigModule.forRoot({
  isGlobal: true,
});

const configService = new ConfigService();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: configService.get<string>('DB_HOST'),
  port: +configService.get<number>('DB_PORT'),
  username: configService.get<string>('DB_USERNAME'),
  password: configService.get<string>('DB_PASSWORD'),
  database: configService.get<string>('DB_NAME'),
  entities: [User],
  migrations: ['./src/migrations/*.ts'],
  synchronize: false,
  logging: true,
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
