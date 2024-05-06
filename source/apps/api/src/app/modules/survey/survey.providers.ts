import { Connection } from 'typeorm';
import { SurveyEntity } from './survey.entity';
import { DATABASE_CONNECTION } from '../../config/database/database.constants';
import { SURVEY_REPOSITORY } from './survey.constants';
export const surveyProviders = [
  {
    provide: SURVEY_REPOSITORY,
    useFactory: (connection: Connection) => connection.getRepository(SurveyEntity),
    inject: [DATABASE_CONNECTION],
  },
];
