import {
  Connection,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  RemoveEvent,
  UpdateEvent,
} from 'typeorm';
import { SelectQueryBuilderOption } from 'typeorm/query-builder/SelectQueryBuilderOption';
import { CustomerEntity } from '../customer/customer.entity';
import { SurveyEntity } from './survey.entity';

@EventSubscriber()
export class SurveySubscriber
  implements EntitySubscriberInterface<SurveyEntity> {
  /**
   * Indicates that this subscriber only listen to Post events.
   */
  listenTo() {
    return SurveyEntity;
  }

  /**
   * Called before post insertion.
   */
  async afterInsert(event: InsertEvent<SurveyEntity>) {
    console.log('afterInsert', event.entity);
    await this.updateSurveyCount(event);
  }

  async afterUpdate(event: UpdateEvent<SurveyEntity>) {
    console.log('afterUpdate', event.updatedColumns);
    console.log('afterUpdate', event.entity);
    await this.updateSurveyCount(event);
  }

  async afterRemove(event: RemoveEvent<SurveyEntity>) {
    console.log('afterRemove', event.entity);
    await this.updateSurveyCount(event);
  }

  async updateSurveyCount(
    event:
      | InsertEvent<SurveyEntity>
      | UpdateEvent<SurveyEntity>
      | RemoveEvent<SurveyEntity>
  ) {
    if (event.entity && event.entity.customerId) {
      const { customerId } = event.entity;
      const conn = event.manager;
      const countQuery = conn
        .createQueryBuilder(SurveyEntity, 'survey')
        .where({ customerId });
      const surveysCount = await countQuery.getCount();
      const queryUpdate = conn
        .createQueryBuilder()
        .update(CustomerEntity, { surveysCount })
        .where('id = :id', { id: customerId });
      const res = await queryUpdate.execute();
    }
  }
}
