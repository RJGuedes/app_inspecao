import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage-angular';
import { FormlyModule } from '@ngx-formly/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthGuard } from './guards/auth.guard';
import { NoAuthGuard } from './guards/no-auth.guard';
import { AuthService } from './services/auth.service';
import { FormlyIonicModule } from '@ngx-formly/ionic';
import { FormlyFieldIaSelectModule } from '@seyconel/formly-field-ia-select';
import { FormlyFieldIaFileModule } from '@seyconel/formly-field-ia-file';
import { SqliteDatabaseService } from './services/sqlite-database.service';
import { SQLiteService } from './services/sqlite.service';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';

registerLocaleData(localePt, 'pt-BR');

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    ReactiveFormsModule,
    IonicStorageModule.forRoot({ name: 'seydb' }),
    FormlyModule.forRoot({
      extras: { lazyRender: true },
      validationMessages: [
        { name: 'required', message: 'É necessário preencher este campo.' },
      ],
    }),
    FormlyIonicModule,
    FormlyFieldIaSelectModule,
    FormlyFieldIaFileModule,
    // SocketIoModule.forRoot(config),
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    SQLiteService,
    SqliteDatabaseService,
    AuthService,
    AuthGuard,
    NoAuthGuard,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent],
})
export class AppModule {}
