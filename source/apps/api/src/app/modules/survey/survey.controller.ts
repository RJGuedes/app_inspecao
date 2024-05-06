import { Controller, UseGuards } from '@nestjs/common';
import { Crud, CrudController } from '@dataui/crud';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

import { SurveyEntity } from './survey.entity';
import { SurveyService } from './survey.service';

@Crud({
  model: {
    type: SurveyEntity,
  },
  params: {
    slug: {
      field: 'id',
      type: 'uuid',
      primary: true,
    },
  },
  query: {
    join: {
      customer: {
        eager: true,
        allow: ['name'],
        alias: 'customer'
      },


    },
    alwaysPaginate: true,
  },
})
@UseGuards(JwtAuthGuard)
@Controller('surveys')
export class SurveyController implements CrudController<SurveyEntity> {
  constructor(public service: SurveyService) {}


}
