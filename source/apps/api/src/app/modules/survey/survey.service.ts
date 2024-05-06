import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { SurveyEntity } from './survey.entity';

// This should be a real class/interface representing a survey entity

@Injectable()
export class SurveyService extends TypeOrmCrudService<SurveyEntity> {
  constructor(
    @Inject('SURVEY_REPOSITORY')
    private surveyRepository: Repository<SurveyEntity>
  ) {
    super(surveyRepository);
  }

  async findAll(): Promise<SurveyEntity[]> {
    return this.surveyRepository.find();
  }

  /*async findOne(email: string): Promise<SurveyEntity | undefined> {
    return this.surveys.find((survey) => survey.email === email);
  }*/
}
