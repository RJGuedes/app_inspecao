import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListPageRoutingModule } from './list-routing.module';

import { ListPage } from './list.page';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ComponentsModule } from '../../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NgxDatatableModule,
    ListPageRoutingModule,
    ComponentsModule
  ],
  declarations: [ListPage],
})
export class ListPageModule {}
