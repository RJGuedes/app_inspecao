import { createConnection, Factory, Seeder } from 'typeorm-seeding';
import { CustomerEntity } from '../../app/modules/customer/customer.entity';
import { SectorEntity } from '../../app/modules/sector/sector.entity';
import { SurveyEntity } from '../../app/modules/survey/survey.entity';

export default class CreateSectors implements Seeder {
  async getSurvey() {
    const conn = await createConnection();
    const query = conn
      .createQueryBuilder(SurveyEntity, 'survey')
      .orderBy('RAND()');
    return await query.getOne();
  }
  public async run(factory: Factory): Promise<void> {
    const many = 0;
    for (let k = 0; k < many; k++) {
      const survey = await this.getSurvey();
      await factory(SectorEntity)({ survey }).create();
    }
  }
}
