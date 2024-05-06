import {
  Controller,
  Post,
  UseGuards,
  Get,
  Response,
  Body,
  Param,
} from '@nestjs/common';
import { JwtAuthGuard } from './modules/auth/jwt-auth.guard';
import { SyncService } from './sync.service';
import xlsx from 'node-xlsx';
import { EventsGateway } from './modules/events/events.gateway';

@Controller()
export class AppController {
  constructor(
    private syncService: SyncService,
    private eventsGateway: EventsGateway
  ) {}

  // @UseGuards(JwtAuthGuard)
  @Get()
  index() {
    return {api: true}
  }

  @Get('sync')
  getSync() {
    return this.syncService.getSync();
  }

  @Get('ws')
  ws() {
    return this.eventsGateway.server.emit('events', { message: 'working' });
  }

  @UseGuards(JwtAuthGuard)
  @Post('sync/:entityId')
  postSync(@Param('entityId') entityId: string, @Body('data') data: any) {
    return this.syncService.postSync(entityId, data);
  }

  @Get('/xls')
  async xls(@Response() res): Promise<void> {
    const data = [
      [1, 2, 3],
      [true, false, null, 'sheetjs'],
      ['foo', 'bar', new Date('2014-02-19T14:30Z'), '0.3'],
      ['baz', null, 'qux'],
    ];
    const buffer = xlsx.build([{ name: 'Seyconel', data: data, options: {} }]); // Returns a buffer
    const filename = 'testingHere';
    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-disposition': `attachment; filename=${filename}.xlsx`,
    });
    res.end(buffer);
  }
}
