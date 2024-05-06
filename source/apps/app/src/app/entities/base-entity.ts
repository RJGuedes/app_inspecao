import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  EntitySchemaColumnOptions,
} from 'typeorm';
import { parse, format, formatISO, parseJSON } from 'date-fns';

export const dateTransformer = {
  from: (_value: string) => {
    console.log('from', _value);
    if (!_value) {
      return '';
    }
    const value = _value
      .substring(0, 'yyyy-MM-dd HH:mm:ss'.length)
      .replace('T', ' ');
    const date = parse(
      `${value}.000+00:00`,
      'yyyy-MM-dd HH:mm:ss.SSSxxx',
      new Date()
    );
    console.log('from toISOString', { _value, value, date });

    return date.toISOString();
  },
  to: (value: any) => {
    console.log('to', value);
    return value;
  },
};

export class IaBaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  savedAt?: string;

  @CreateDateColumn({
    type: 'varchar',
    length: 100,
  })
  createdAt?: string;

  @UpdateDateColumn({
    type: 'varchar',
    length: 100,
  })
  modifiedAt?: string;
}

export interface IaBaseInterface {
  id?: any;
  serverId?: string;
  createdAtLocal?: string;
  modifiedAtLocal?: string;
  syncedAt?: string;
  sync?: boolean;
  // createdAt?: string;
  // modifiedAt?: string;
}

export const IaBaseFields: { [k: string]: EntitySchemaColumnOptions } = {
  id: {
    type: 'uuid',
    primary: true,
    generated: 'uuid',
  },
  serverId: {
    type: String,
    nullable: true,
  },
  createdAtLocal: {
    type: 'varchar',
    createDate: true,
    transformer: dateTransformer,
  },
  modifiedAtLocal: {
    type: 'varchar',
    updateDate: true,
    transformer: dateTransformer,
  },
  syncedAt: {
    type: 'varchar',
    nullable: true,
    transformer: dateTransformer,
  },
  sync: {
    type: 'boolean',
    default: false,
  },

  /*createdAt: {
    type: String,
    createDate: true,
  },
  modifiedAt: {
    type: String,
    updateDate: true,
  },*/
};
