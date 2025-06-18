import { createConnection } from 'typeorm';
import { DATABASE_CONNECTION } from './database.constants';

import { CustomerEntity } from '../../modules/customer/customer.entity';
import { UserEntity } from '../../modules/user/user.entity';
import { ItemEntity } from '../../modules/item/item.entity';
import { LogEntity } from '../../modules/log/log.entity';
import { SurveyEntity } from '../../modules/survey/survey.entity';
import { SurveySubscriber } from '../../modules/survey/survey.subscriber';
import { ItemSubscriber } from '../../modules/item/item.subscriber';
import { SectorEntity } from '../../modules/sector/sector.entity';
import { environment } from '../../../environments/environment';
import { PhotoEntity } from '../../modules/photo/photo.entity';
import { ReportEntity } from '../../modules/report/report.entity';
export const databaseProviders = [
  {
    provide: DATABASE_CONNECTION,
    useFactory: async () =>
      await createConnection({
        type: 'mysql',
        ...environment.db,
        entities: [
          UserEntity,
          CustomerEntity,
          SurveyEntity,
          SectorEntity,
          ItemEntity,
          PhotoEntity,
          LogEntity,
          ReportEntity,
        ],
        subscribers: [SurveySubscriber, ItemSubscriber],
        synchronize: true,
      }),
  },
];
