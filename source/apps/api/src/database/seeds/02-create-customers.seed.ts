import { Factory, Seeder } from 'typeorm-seeding';
import { CustomerEntity } from '../../app/modules/customer/customer.entity';

export default class CreateCustomers implements Seeder {
  public async run(factory: Factory): Promise<void> {
    await factory(CustomerEntity)().createMany(0);
  }
}
