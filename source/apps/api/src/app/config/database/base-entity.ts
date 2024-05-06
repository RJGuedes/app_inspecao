import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export class IaBaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt?: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  modifiedAt?: Date;
}
