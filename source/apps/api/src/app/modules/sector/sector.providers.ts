import { Connection } from 'typeorm';
import { SectorEntity } from './sector.entity';
import { DATABASE_CONNECTION } from '../../config/database/database.constants';
import { SECTOR_REPOSITORY } from './sector.constants';
export const sectorProviders = [
  {
    provide: SECTOR_REPOSITORY,
    useFactory: (connection: Connection) => connection.getRepository(SectorEntity),
    inject: [DATABASE_CONNECTION],
  },
];
