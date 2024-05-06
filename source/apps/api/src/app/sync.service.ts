import { Inject, Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { CustomerEntity } from './modules/customer/customer.entity';
import { ItemEntity } from './modules/item/item.entity';
import { SectorEntity } from './modules/sector/sector.entity';
import { SurveyEntity } from './modules/survey/survey.entity';
import { IaBaseInterface } from '@seyconel/config';

@Injectable()
export class SyncService {
  entities = {
    customers: CustomerEntity,
    surveys: SurveyEntity,
    sectors: SectorEntity,
    items: ItemEntity,
  };
  constructor(@Inject('DATABASE_CONNECTION') private connection: Connection) {}
  async getSync(): Promise<{
    surveys: SurveyEntity[];
    customers: CustomerEntity[];
  }> {
    const repository = this.connection.getRepository<SurveyEntity>(
      SurveyEntity
    );

    try {
      const results = await repository.find({
        where: { completed: false },
        relations: ['customer'],
      });
      return results.reduce(
        (acc, each) => {
          const { customer, ...survey } = each;
          acc.surveys.push(survey);
          if (acc.customers.findIndex((c) => c.id === customer.id) < 0) {
            acc.customers.push(customer);
          }
          return acc;
        },
        { customers: [], surveys: [] }
      );
    } catch (err) {
      console.error(err);
    }
  }

  async postSync(
    entityId: string,
    dataArr: any[]
  ): Promise<IaBaseInterface & { localId?: string }[]> {
    const repository = this.connection.getRepository<IaBaseInterface>(
      this.entities[entityId]
    );

    const results = [];
    for (const data of dataArr) {
      try {
        const result = await repository.save(data);
        const saved: any = await repository.findOne({where: {id:result.id}});
        console.log('sync', result);
        console.log('sync saved', saved);
        console.log('modifiedAt', saved.modifiedAt);
        results.push({
          sync: true,
          syncedAt: saved.modifiedAt
            ? this.getFormattedDate(new Date(saved.modifiedAt))
            : null,
          id: result.id,
        });
      } catch (err) {
        console.error(err);
        results.push({ sync: false, id: data.id });
      }
    }
    return results;
  }

  getFormattedDate(d: Date) {
    return (
      d.getFullYear() +
      '-' +
      ('0' + (d.getMonth() + 1)).slice(-2) +
      '-' +
      ('0' + d.getDate()).slice(-2) +
      ' ' +
      ('0' + d.getHours()).slice(-2) +
      ':' +
      ('0' + d.getMinutes()).slice(-2) +
      ':' +
      ('0' + d.getSeconds()).slice(-2)
    );
  }
}
