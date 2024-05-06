import {
  Connection,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  RemoveEvent,
  UpdateEvent,
} from 'typeorm';
import { SectorEntity } from '../sector/sector.entity';
import { SurveyEntity } from '../survey/survey.entity';
import { ItemEntity } from './item.entity';

@EventSubscriber()
export class ItemSubscriber implements EntitySubscriberInterface<ItemEntity> {
  /**
   * Indicates that this subscriber only listen to Post events.
   */
  listenTo() {
    return ItemEntity;
  }

  /**
   * Called before post insertion.
   */
  async afterInsert(event: InsertEvent<ItemEntity>) {
    console.log('afterInsert', EventSubscriber);
    await this.updateItemCount(event);
  }

  async afterUpdate(event: UpdateEvent<ItemEntity>) {
    console.log('afterUpdate', event);
    await this.updateItemCount(event);
  }

  async afterRemove(event: RemoveEvent<ItemEntity>) {
    console.log('afterRemove', event);
    await this.updateItemCount(event);
  }

  async updateItemCount(
    event:
      | InsertEvent<ItemEntity>
      | UpdateEvent<ItemEntity>
      | RemoveEvent<ItemEntity>
  ) {
    if (event.entity && event.entity.sectorId) {
      const { sectorId } = event.entity;
      const conn = event.manager;
      const countQuery = conn
        .createQueryBuilder(ItemEntity, 'item')
        .where({ sectorId });
      const itemsCount = await countQuery.getCount();

      const queryUpdate = conn
        .createQueryBuilder()
        .update(SectorEntity, { itemsCount })
        .where('id = :id', { id: sectorId });
      const res = await queryUpdate.execute();
    }
  }
}
