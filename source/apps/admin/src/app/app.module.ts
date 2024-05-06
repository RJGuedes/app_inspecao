import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PopoverListService } from './components/popover-list/popover-list.service';
import { PopoverListComponent } from './components/popover-list/popover-list.component';
import { HttpClientModule } from '@angular/common/http';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import ptBr from '@angular/common/locales/pt';
import { ComponentsModule } from './components/components.module';
import { FormlyIonicModule } from '@ngx-formly/ionic';
import { FormlyFieldIaSelectModule } from '@seyconel/formly-field-ia-select';
import { FormlyFieldIaFileModule } from '@seyconel/formly-field-ia-file';
import { AuthService } from './services/auth.service';
import { IonicStorageModule } from '@ionic/storage-angular';
import { AuthGuard } from './guards/auth.guard';
import { NoAuthGuard } from './guards/no-auth.guard';

registerLocaleData(ptBr);

@NgModule({
  declarations: [AppComponent, PopoverListComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    ReactiveFormsModule,
    IonicStorageModule.forRoot(),
    NgxDatatableModule,
    FormlyModule.forRoot({
      extras: { lazyRender: true },
      validationMessages: [
        { name: 'required', message: 'É necessário preencher este campo.' },
      ],
    }),
    FormlyIonicModule,
    FormlyFieldIaSelectModule,
    FormlyFieldIaFileModule,
    ComponentsModule,
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'pt' },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    PopoverListService,
    AuthService,
    AuthGuard,
    NoAuthGuard,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
