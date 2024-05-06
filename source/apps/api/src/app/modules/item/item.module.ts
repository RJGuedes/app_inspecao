import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../config/database/database.module';
import { ItemController } from './item.controller';
import { itemProviders } from './item.providers';
import { ItemService } from './item.service';

@Module({
  imports: [DatabaseModule],
  providers: [...itemProviders, ItemService],
  exports: [ItemService],
  controllers: [ItemController],
})
export class ItemModule {}
