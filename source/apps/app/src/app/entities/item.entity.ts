import { EntitySchema } from 'typeorm';
import { IaBaseFields, IaBaseInterface } from './base-entity';
import { SectorEntity } from './';

export interface ItemInterface extends IaBaseInterface {
  traceability?: string;
  sector?: typeof SectorEntity;
  sectorId?: string;
  data?: any;
  approved?: boolean;
}

export const ItemEntity = new EntitySchema<ItemInterface>({
  name: 'items',
  columns: {
    ...IaBaseFields,
    traceability: {
      type: 'varchar',
    },
    sectorId: {
      type: 'varchar',
    },
    data: {
      type: 'simple-json',
    },
    approved: {
      type: 'boolean',
    },
  },
  relations: {
    /*sector: {
      type: 'many-to-one',
      target: 'sectors',
    },*/
  },
});
