import { define } from 'typeorm-seeding';
import { UserEntity } from '../../app/modules/user/user.entity';
import * as Faker from 'faker';

let first = true;

define(UserEntity, (faker: typeof Faker) => {
  console.log('first', first);
  if (first) {
    first = false;
    const user = new UserEntity();
    user.name = `Admin`;
    user.email = 'admin@admin.com';
    user.password = `123123`;
    return user;
  }
  const gender = faker.random.number(1);
  const firstName = faker.name.firstName(gender);
  const lastName = faker.name.lastName(gender);
  const email = faker.internet.email(firstName, lastName).toLocaleLowerCase();
  const user = new UserEntity();
  user.name = `${firstName} ${lastName}`;
  user.email = email;
  user.password = `123123`;
  return user;
});
