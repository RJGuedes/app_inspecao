import { createConnection, Factory, Seeder } from 'typeorm-seeding';
import { SurveyEntity } from '../../app/modules/survey/survey.entity';
import { ItemEntity } from '../../app/modules/item/item.entity';
import { SectorEntity } from '../../app/modules/sector/sector.entity';

export default class CreateItems implements Seeder {
  async getSector() {
    const conn = await createConnection();
    const query = conn
      .createQueryBuilder(SectorEntity, 'sector')
      .orderBy('RAND()');
    return await query.getOne();
  }
  public async run(factory: Factory): Promise<void> {
    const many = 0 * 5;
    for (let k = 0; k < many; k++) {
      const sector = await this.getSector();
      await factory(ItemEntity)({ sector }).create();
    }
  }
}
