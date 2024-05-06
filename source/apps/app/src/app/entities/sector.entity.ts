import { EntitySchema } from 'typeorm';
import { SurveyEntity } from './';
import { IaBaseFields, IaBaseInterface } from './base-entity';

export interface SectorInterface extends IaBaseInterface {
  name?: string;
  survey?: typeof SurveyEntity;
  surveyId?: string;

  // sectors?: SectorEntity[];
}

export const SectorEntity = new EntitySchema<SectorInterface>({
  name: 'sectors',
  columns: {
    ...IaBaseFields,
    name: {
      type: String,
    },
    surveyId: {
      type: String,
    },
  },
  relations: {
    /*sectors: {
      type: 'one-to-many',
      target: 'sectors',
    },*/
    /*survey: {
      type: 'many-to-one',
      target: 'surveys',
    },*/
  },
});
