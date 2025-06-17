import { Entity, Column, OneToMany } from 'typeorm';
import { IaBaseEntity } from '../../config/database/base-entity';
import { LogEntity } from '../log/log.entity';

@Entity('users')
export class UserEntity extends IaBaseEntity {
  @Column({ length: 255 })
  name: string;

  @Column({ length: 255 })
  email: string;

  @Column({ length: 255 })
  password: string;

  @Column({ length: 255 })
  customerId: string;

  @Column({ nullable: true })
  token: string;

  @Column({type: 'datetime' })
  expiraToken: Date;

  @Column({ default: false })
  isAdmin: boolean;

  @Column({ type: 'timestamp' })
  expiraAccess: Date;
  
  @OneToMany(() => LogEntity, (log) => log.user)
  logs?: LogEntity[];
}
