import { Connection } from 'typeorm';
import { UserEntity } from './user.entity';
import { DATABASE_CONNECTION } from '../../config/database/database.constants';
import { USER_REPOSITORY } from './constants';
export const userProviders = [
  {
    provide: USER_REPOSITORY,
    useFactory: (connection: Connection) => connection.getRepository(UserEntity),
    inject: [DATABASE_CONNECTION],
  },
];
