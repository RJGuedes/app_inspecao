import { Connection } from 'typeorm';
import { CustomerEntity } from './customer.entity';
import { DATABASE_CONNECTION } from '../../config/database/database.constants';
import { CUSTOMER_REPOSITORY } from './constants';
export const customerProviders = [
  {
    provide: CUSTOMER_REPOSITORY,
    useFactory: (connection: Connection) => connection.getRepository(CustomerEntity),
    inject: [DATABASE_CONNECTION],
  },
];
