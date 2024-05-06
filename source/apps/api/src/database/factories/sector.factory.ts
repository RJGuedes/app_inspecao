import { define } from 'typeorm-seeding';
import { SectorEntity } from '../../app/modules/sector/sector.entity';
import * as Faker from 'faker';
import { SurveyEntity } from '../../app/modules/survey/survey.entity';

define(SectorEntity, (faker: typeof Faker, ctx: { survey: SurveyEntity }) => {
  const name = `${faker.hacker.adjective()} ${faker.hacker.noun()}`;
  const sector = new SectorEntity();
  sector.name = `${name.charAt(0).toUpperCase() + name.slice(1)}`;
  sector.survey = ctx.survey;
  return sector;
});
