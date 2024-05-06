import { Controller, UseGuards } from '@nestjs/common';
import { Crud, CrudController } from '@dataui/crud';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

import { CustomerEntity } from './customer.entity';
import { CustomerService } from './customer.service';

@Crud({
  model: {
    type: CustomerEntity,
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
@Controller('customers')
export class CustomerController implements CrudController<CustomerEntity> {
  constructor(public service: CustomerService) {}
}
