import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { IonicModule } from '@ionic/angular';
import { FormlySelectModule as FormlyCoreSelectModule } from '@ngx-formly/core/select';
import { FormlyFieldIaSelectComponent } from './formly-field-ia-select.type';
import { FormlyIonicModule } from '@ngx-formly/ionic';
import { SelectModalComponent } from './select-modal/select-modal.component';
import { SortByPipe } from './select-modal/sortby-pipe';

@NgModule({
  declarations: [FormlyFieldIaSelectComponent, SelectModalComponent, SortByPipe],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    FormlyIonicModule,
    FormlyCoreSelectModule,
    FormlyModule.forChild({
      types: [
        {
          name: 'select-modal',
          component: FormlyFieldIaSelectComponent,
          wrappers: ['form-field'],
        },
        { name: 'enum', extends: 'select' },
      ],
    }),
  ],
  exports: [SelectModalComponent],
  providers: [],
})
export class FormlyFieldIaSelectModule {}
