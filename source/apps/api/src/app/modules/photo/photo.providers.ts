import { Connection } from 'typeorm';
import { PhotoEntity } from './photo.entity';
import { DATABASE_CONNECTION } from '../../config/database/database.constants';
import { PHOTO_REPOSITORY } from './constants';
export const photoProviders = [
  {
    provide: PHOTO_REPOSITORY,
    useFactory: (connection: Connection) => connection.getRepository(PhotoEntity),
    inject: [DATABASE_CONNECTION],
  },
];
