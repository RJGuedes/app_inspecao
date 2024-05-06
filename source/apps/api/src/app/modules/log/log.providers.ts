import { Connection } from 'typeorm';
import { LogEntity } from './log.entity';
import { DATABASE_CONNECTION } from '../../config/database/database.constants';
import { LOG_REPOSITORY } from './constants';
export const logProviders = [
  {
    provide: LOG_REPOSITORY,
    useFactory: (connection: Connection) => connection.getRepository(LogEntity),
    inject: [DATABASE_CONNECTION],
  },
];
