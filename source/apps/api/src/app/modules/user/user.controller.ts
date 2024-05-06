import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { Crud, CrudController } from '@dataui/crud';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

import { UserEntity } from './user.entity';
import { UserService } from './user.service';

@Crud({
  model: {
    type: UserEntity,
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
@Controller('users')
export class UserController implements CrudController<UserEntity> {
  constructor(public service: UserService) {}


}
