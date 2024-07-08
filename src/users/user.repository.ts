import { EntityRepository, Repository, DataSource } from 'typeorm';
import { User } from './entity/user.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }
  async findByUsername(username: string): Promise<User | undefined> {
    return this.findOne({ where: { username } });
  }
}
