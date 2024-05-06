import { Connection } from 'typeorm';
import { ReportEntity } from './report.entity';
import { DATABASE_CONNECTION } from '../../config/database/database.constants';
import { REPORT_REPOSITORY } from './constants';
import { SURVEY_REPOSITORY } from '../survey/survey.constants';
import { SurveyEntity } from '../survey/survey.entity';
export const reportProviders = [
  {
    provide: REPORT_REPOSITORY,
    useFactory: (connection: Connection) =>
      connection.getRepository(ReportEntity),
    inject: [DATABASE_CONNECTION],
  },
  {
    provide: SURVEY_REPOSITORY,
    useFactory: (connection: Connection) =>
      connection.getRepository(SurveyEntity),
    inject: [DATABASE_CONNECTION],
  },
];
