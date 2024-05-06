import { define } from 'typeorm-seeding';
import { SurveyEntity } from '../../app/modules/survey/survey.entity';
import * as Faker from 'faker';
import { CustomerEntity } from '../../app/modules/customer/customer.entity';

define(SurveyEntity, (
  faker: typeof Faker,
  ctx: { customer: CustomerEntity }
) => {
  const meses = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Agosto',
    'Outubro',
    'Novembro',
    'Dezembro',
  ];
  const name = `${faker.random.arrayElement(
    meses
  )} ${faker.random.arrayElement([2015, 2016, 2017, 2018, 2019, 2020])}`;
  const survey = new SurveyEntity();
  survey.name = `${name.charAt(0).toUpperCase() + name.slice(1)}`;
  survey.customer = ctx.customer;
  return survey;
});
