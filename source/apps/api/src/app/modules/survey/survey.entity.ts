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
import { ReportEntity } from '../report/report.entity';
import { SectorEntity } from '../sector/sector.entity';

@Entity('surveys')
export class SurveyEntity extends IaBaseEntity {
  @Column({ length: 255 })
  name: string;

  @Column({ nullable: true })
  month: number;

  @Column({ nullable: true })
  year: number;

  @Column({ length: 255, nullable: true })
  city: string;

  @Column({ length: 255, nullable: true })
  state: string;

  @ManyToOne(() => CustomerEntity, (customer) => customer.surveys)
  customer?: CustomerEntity;

  @Index()
  @Column({ nullable: true })
  customerId: string;

  @Column({ default: 0 })
  sectorsCount: number;

  @OneToMany(() => SectorEntity, (sector) => sector.survey)
  sectors?: SectorEntity[];

  @OneToMany(() => ReportEntity, (report) => report.survey)
  reports?: ReportEntity[];

  @Column({ type: 'timestamp', nullable: true })
  savedAt?: Date;

  @Column({ default: false })
  completed: boolean;
}
