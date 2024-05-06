import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  AfterInsert,
  Index,
} from 'typeorm';
import { IaBaseEntity } from '../../config/database/base-entity';
import { CustomerEntity } from '../customer/customer.entity';
import { ItemEntity } from '../item/item.entity';
import { SectorEntity } from '../sector/sector.entity';
import { SurveyEntity } from '../survey/survey.entity';

@Entity('reports')
export class ReportEntity extends IaBaseEntity {
  @Column({ length: 255 })
  name: string;

  @Column({ type: 'int', default: 0 })
  ri: number;

  @ManyToOne(() => SurveyEntity, (customer) => customer.reports)
  survey?: SurveyEntity;

  @Index()
  @Column({ nullable: true })
  surveyId: string;

  @Column({ type: 'json', nullable: true, default: null })
  data: any;
}
