import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../config/database/database.module';
import { LogController } from './log.controller';
import { logProviders } from './log.providers';
import { LogService } from './log.service';

@Module({
  imports: [DatabaseModule],
  providers: [...logProviders, LogService],
  exports: [LogService],
  controllers: [LogController],
})
export class LogModule {}
