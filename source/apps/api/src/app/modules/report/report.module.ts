import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../config/database/database.module';
import { SurveyModule } from '../survey/survey.module';
import { ReportController } from './report.controller';
import { reportProviders } from './report.providers';
import { ReportService } from './report.service';

@Module({
  imports: [DatabaseModule],
  providers: [...reportProviders, ReportService],
  exports: [...reportProviders, ReportService],
  controllers: [ReportController],
})
export class ReportModule {}
