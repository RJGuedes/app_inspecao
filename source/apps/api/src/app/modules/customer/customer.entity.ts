import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn } from 'typeorm';
import { IaBaseEntity } from '../../config/database/base-entity';
import { SurveyEntity } from '../survey/survey.entity';

@Entity('customers')
export class CustomerEntity extends IaBaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 255 })
  cnpj: string;

  @Column({ default: 0 })
  surveysCount: number;

  @OneToMany(() => SurveyEntity, (survey) => survey.customer)
  @JoinColumn()
  surveys?: SurveyEntity[];
}
