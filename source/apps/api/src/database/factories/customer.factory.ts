import { define } from 'typeorm-seeding';
import { CustomerEntity } from '../../app/modules/customer/customer.entity';
import * as Faker from 'faker';
import { cnpjGenerate } from '../cnpj';

define(CustomerEntity, (faker: typeof Faker) => {
  // console.log('faker', faker)
  const name = faker.company.companyName();
  const cnpj = cnpjGenerate();
  const customer = new CustomerEntity();
  customer.name = `${name}`;
  customer.cnpj = cnpj;
  return customer;
});
