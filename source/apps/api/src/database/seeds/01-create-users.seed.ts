import { Factory, Seeder, useRefreshDatabase} from 'typeorm-seeding';
import { UserEntity } from '../../app/modules/user/user.entity';

export default class CreateUsers implements Seeder {
  public async run(factory: Factory): Promise<void> {
    const res = await factory(UserEntity)().createMany(1);
  }
}
