import { Entity, Column, ManyToOne, OneToMany, AfterInsert, Index } from 'typeorm';
import { IaBaseEntity } from '../../config/database/base-entity';
import { CustomerEntity } from '../customer/customer.entity';
import { ItemEntity } from '../item/item.entity';
import { SurveyEntity } from '../survey/survey.entity';

@Entity('sectors')
export class SectorEntity extends IaBaseEntity {
  @Column({ length: 255 })
  name: string;

  @ManyToOne(() => SurveyEntity, (survey) => survey.sectors)
  survey: SurveyEntity;

  @Column({ nullable: true })
  surveyId: string;

  @Column({ default: 0 })
  itemsCount: number;

  @OneToMany(() => ItemEntity, (item) => item.sector)
  items?: ItemEntity[];

  @Column({ type: 'timestamp', nullable: true })
  savedAt?: Date;
}
