import { Controller, UseGuards } from '@nestjs/common';
import {
  Crud,
  CrudController,
  CrudRequest,
  Override,
  ParsedBody,
  ParsedRequest,
} from '@dataui/crud';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

import { ItemEntity } from './item.entity';
import { ItemService } from './item.service';

@Crud({
  model: {
    type: ItemEntity,
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
      sector: {
        eager: true,
        allow: ['name'],
        alias: 'sector',
      },
      ['sector.survey']: {
        eager: true,
        allow: ['name'],
        alias: 'sectorSurvey',
      },
      ['sector.survey.customer']: {
        eager: true,
        allow: ['name'],
        alias: 'sectorSurveyCustomer',
      },
      /*['sector.survey.customer']: {
        eager: true,
        allow: ['name'],
      },*/
    },
    alwaysPaginate: true,
  },
})
@UseGuards(JwtAuthGuard)
@Controller('items')
export class ItemController implements CrudController<ItemEntity> {
  constructor(public service: ItemService) {}

  get base(): CrudController<ItemEntity> {
    return this;
  }

  @Override()
  getMany(@ParsedRequest() req: CrudRequest) {
    return this.service.getManyAndCount(req);
  }

  @Override()
  getOne(@ParsedRequest() req: CrudRequest) {
    return this.service.getOneAndCount(req);
  }
}
