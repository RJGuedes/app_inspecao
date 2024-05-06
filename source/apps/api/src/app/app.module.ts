import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { SyncService } from './sync.service';

// Config
import { DatabaseModule } from './config/database/database.module';

// Modules
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { CustomerModule } from './modules/customer/customer.module';
import { ItemModule } from './modules/item/item.module';
import { LogModule } from './modules/log/log.module';
import { SurveyModule } from './modules/survey/survey.module';
import { SectorModule } from './modules/sector/sector.module';
import { PhotoModule } from './modules/photo/photo.module';
import { EventsModule } from './modules/events/events.module';
import { ReportModule } from './modules/report/report.module';
// import { CouchDbModule } from '@seyconel/nest-couchdb';
// import { CatsModule } from './modules/cats/cats.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    UserModule,
    CustomerModule,
    SurveyModule,
    SectorModule,
    ItemModule,
    LogModule,
    PhotoModule,
    EventsModule,
    ReportModule,
  ],
  controllers: [AppController],
  providers: [SyncService],
})
export class AppModule {}
