import { Controller, UseGuards } from '@nestjs/common';
import { Crud, CrudController } from '@dataui/crud';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

import { LogEntity } from './log.entity';
import { LogService } from './log.service';

@Crud({
  model: {
    type: LogEntity,
  },
  params: {
    slug: {
      field: 'id',
      type: 'uuid',
      primary: true,
    },
  },
  query: {
    alwaysPaginate: true,
  },
})
@UseGuards(JwtAuthGuard)
@Controller('logs')
export class LogController implements CrudController<LogEntity> {
  constructor(public service: LogService) {}
}
