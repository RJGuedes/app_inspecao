import { createConnection, Factory, Seeder } from 'typeorm-seeding';
import { CustomerEntity } from '../../app/modules/customer/customer.entity';
import { SurveyEntity } from '../../app/modules/survey/survey.entity';

export default class CreateSurveys implements Seeder {
  async getCustomer() {
    const conn = await createConnection();
    const query = conn
      .createQueryBuilder(CustomerEntity, 'customer')
      .orderBy('RAND()');
    return await query.getOne();
  }
  public async run(factory: Factory): Promise<void> {
    const many = 0;
    for (let k = 0; k < many; k++) {
      const customer = await this.getCustomer()
      await factory(SurveyEntity)({customer}).create();
    }
  }
}
