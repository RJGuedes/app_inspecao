import { define } from 'typeorm-seeding';
import { ItemEntity } from '../../app/modules/item/item.entity';
import * as Faker from 'faker';
import { SectorEntity } from '../../app/modules/sector/sector.entity';

define(ItemEntity, (faker: typeof Faker, ctx: { sector: SectorEntity }) => {
  const traceability = faker.internet.color();
  const item = new ItemEntity();
  item.traceability = `${traceability}`;
  item.sector = ctx.sector;
  return item;
});
