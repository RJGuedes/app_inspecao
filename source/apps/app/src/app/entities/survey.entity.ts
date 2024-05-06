import { EntitySchema } from 'typeorm';
import { CustomerEntity } from './';
import { IaBaseFields, IaBaseInterface } from './base-entity';

export interface SurveyInterface extends IaBaseInterface {
  name?: string;
  customer?: typeof CustomerEntity;
  customerId?: string;

  // sectors?: SectorEntity[];
}

export const SurveyEntity = new EntitySchema<SurveyInterface>({
  name: 'surveys',
  columns: {
    ...IaBaseFields,
    name: {
      type: String,
    },
    customerId: {
      type: String,
    },
  },
  relations: {
    /*sectors: {
      type: 'one-to-many',
      target: 'sectors',
    },*/
    /*customer: {
      type: 'many-to-one',
      target: 'customers',
    },*/
  },
});

/*@Entity({ name: 'surveys' })
export class SurveyEntity extends IaBaseEntity {
  @Column({ length: 255 })
  name?: string;

  @ManyToOne(() => CustomerEntity, (customer) => customer.surveys)
  customer?: CustomerEntity;

  @Column({ nullable: true })
  customerId?: string;

  @Column({ default: 0 })
  sectorsCount?: number;

  @OneToMany(() => SectorEntity, (sector) => sector.surveyId)
  sectors?: SectorEntity[];
}
*/
