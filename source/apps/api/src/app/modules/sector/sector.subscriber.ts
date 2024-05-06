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
import { SurveyEntity } from '../survey/survey.entity';
import { SectorEntity } from './sector.entity';

@EventSubscriber()
export class SectorSubscriber
  implements EntitySubscriberInterface<SectorEntity> {
  /**
   * Indicates that this subscriber only listen to Post events.
   */
  listenTo() {
    return SectorEntity;
  }

  /**
   * Called before post insertion.
   */
  async afterInsert(event: InsertEvent<SectorEntity>) {
    console.log('afterInsert', event.entity);
    await this.updateSectorCount(event);
  }

  async afterUpdate(event: UpdateEvent<SectorEntity>) {
    console.log('afterUpdate', event.updatedColumns);
    console.log('afterUpdate', event.entity);
    await this.updateSectorCount(event);
  }

  async afterRemove(event: RemoveEvent<SectorEntity>) {
    console.log('afterRemove', event.entity);
    await this.updateSectorCount(event);
  }

  async updateSectorCount(
    event:
      | InsertEvent<SectorEntity>
      | UpdateEvent<SectorEntity>
      | RemoveEvent<SectorEntity>
  ) {
    if (event.entity && event.entity.surveyId) {
      const { surveyId } = event.entity;
      const conn = event.manager;
      const countQuery = conn
        .createQueryBuilder(SectorEntity, 'sector')
        .where({ surveyId });
      const sectorsCount = await countQuery.getCount();
      const queryUpdate = conn
        .createQueryBuilder()
        .update(SurveyEntity, { sectorsCount })
        .where('id = :id', { id: surveyId });
      const res = await queryUpdate.execute();
    }
  }
}
