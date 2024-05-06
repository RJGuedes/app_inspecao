import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../config/database/database.module';
import { SurveyController } from './survey.controller';
import { surveyProviders } from './survey.providers';
import { SurveyService } from './survey.service';

@Module({
  imports: [DatabaseModule],
  providers: [...surveyProviders, SurveyService],
  exports: [...surveyProviders, SurveyService],
  controllers: [SurveyController],
})
export class SurveyModule {}
