import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FilterFormComponent } from './filter-form/filter-form.component';
import { FormlyModule } from '@ngx-formly/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FormlyModule,
    ReactiveFormsModule,
  ],
  declarations: [FilterFormComponent],
})
export class ComponentsModule {}
