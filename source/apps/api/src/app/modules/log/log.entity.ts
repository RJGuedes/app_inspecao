import { Entity, Column, ManyToOne } from 'typeorm';
import { IaBaseEntity } from '../../config/database/base-entity';
import { UserEntity } from '../user/user.entity';

@Entity('logs')
export class LogEntity extends IaBaseEntity {
  @Column({ length: 255 })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @ManyToOne(() => UserEntity, (user) => user.logs)
  user: UserEntity;
}
