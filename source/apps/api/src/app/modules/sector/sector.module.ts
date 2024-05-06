import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../config/database/database.module';
import { SectorController } from './sector.controller';
import { sectorProviders } from './sector.providers';
import { SectorService } from './sector.service';

@Module({
  imports: [DatabaseModule],
  providers: [...sectorProviders, SectorService],
  exports: [SectorService],
  controllers: [SectorController],
})
export class SectorModule {}
