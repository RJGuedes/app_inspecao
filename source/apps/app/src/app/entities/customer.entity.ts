import { SurveyEntity } from './';

import { EntitySchema } from 'typeorm';
import { IaBaseFields, IaBaseInterface } from './base-entity';

export interface CustomerInterface extends IaBaseInterface {
  name?: string;
  cnpj?: string;
  surveys?: typeof SurveyEntity[];
}

export const CustomerEntity = new EntitySchema<CustomerInterface>({
  name: 'customers',
  columns: {
    ...IaBaseFields,
    name: {
      type: String,
    },
    cnpj: {
      type: String,
    },
  },
});
