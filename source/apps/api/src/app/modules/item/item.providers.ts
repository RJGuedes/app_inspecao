import { Connection } from 'typeorm';
import { ItemEntity } from './item.entity';
import { DATABASE_CONNECTION } from '../../config/database/database.constants';
import { ITEM_REPOSITORY } from './constants';
export const itemProviders = [
  {
    provide: ITEM_REPOSITORY,
    useFactory: (connection: Connection) =>
      connection.getRepository(ItemEntity),
    inject: [DATABASE_CONNECTION],
  },
];
