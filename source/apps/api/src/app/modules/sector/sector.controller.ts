import { Controller, UseGuards } from '@nestjs/common';
import { Crud, CrudController } from '@dataui/crud';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

import { SectorEntity } from './sector.entity';
import { SectorService } from './sector.service';

@Crud({
  model: {
    type: SectorEntity,
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
      survey: {
        eager: true,
        allow: ['name'],
        alias: 'survey',
      },

      ['survey.customer']: {
        eager: true,
        allow: ['name'],
        alias: 'surveyCustomer',
      },
    },
    alwaysPaginate: true,
  },
})
@UseGuards(JwtAuthGuard)
@Controller('sectors')
export class SectorController implements CrudController<SectorEntity> {
  constructor(public service: SectorService) {}
}
