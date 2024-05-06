import { customerEntity } from './entity/customer.entity';
import { itemEntity } from './entity/item.entity';
import { logEntity } from './entity/log.entity';
import { photoEntity } from './entity/photo.entity';
import { reportEntity } from './entity/report.entity';
import { sectorEntity } from './entity/sector.entity';
import { surveyEntity } from './entity/survey.entity';
import { userEntity } from './entity/user.entity';

export const appConfig = {
  title: 'Seyconel',
  subtitle: 'Inspeções Técnicas',
  entities: {
    ...customerEntity,
    ...surveyEntity,
    ...sectorEntity,
    ...itemEntity,
    ...photoEntity,
    ...userEntity,
    ...reportEntity,
    // ...logEntity,
  },
};
