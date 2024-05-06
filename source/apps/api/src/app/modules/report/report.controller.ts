import { Controller, Get, Param, Response } from '@nestjs/common';
import { Crud, CrudController } from '@dataui/crud';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ReportEntity } from './report.entity';
import { ReportService } from './report.service';

@Crud({
  model: {
    type: ReportEntity,
  },
  params: {
    slug: {
      field: 'id',
      type: 'uuid',
      primary: true,
    },
  },
  query: {
    exclude: ['data'],
    join: {
      customer: {
        eager: true,
        allow: ['name'],
        alias: 'customer',
      },
    },
    alwaysPaginate: true,
  },
})
// @UseGuards(JwtAuthGuard)
@Controller('reports')
export class ReportController implements CrudController<ReportEntity> {
  constructor(public service: ReportService) {}

  @Get('generate/:surveyId/:ri')
  generate(@Param('surveyId') surveyId: string, @Param('ri') ri: string) {
    return this.service.generate(surveyId, ri);
  }

  @Get('pdf/:reportId')
  async getPDF(
    @Response() res,
    @Param('reportId') reportId: string
  ): Promise<void> {
    return this.service.pdf(res, reportId);
  }
}
