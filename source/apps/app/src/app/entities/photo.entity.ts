import { EntitySchema } from 'typeorm';
import { SurveyEntity } from './';
import { IaBaseFields, IaBaseInterface } from './base-entity';

export interface PhotoInterface extends IaBaseInterface {
  file?: string;
  item?: typeof SurveyEntity;
  itemId?: string;
  thumb?: string;
}

export const PhotoEntity = new EntitySchema<PhotoInterface>({
  name: 'photos',
  columns: {
    ...IaBaseFields,
    file: {
      type: String,
      nullable: true
    },
    itemId: {
      type: String,
      nullable: true
    },
    thumb: {
      type: String,
      nullable: true
    },
  },
  relations: {
    /*item: {
      type: 'many-to-one',
      target: 'items',
    },*/
  },
});
