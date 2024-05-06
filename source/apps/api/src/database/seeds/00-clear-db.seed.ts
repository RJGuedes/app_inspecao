import { Seeder, useRefreshDatabase } from 'typeorm-seeding';

export default class ClearDb implements Seeder {
  public async run(): Promise<void> {
    await useRefreshDatabase();
  }
}
