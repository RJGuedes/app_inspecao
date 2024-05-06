import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { IonicModule } from '@ionic/angular';
import { FormlyFieldIaFileComponent } from './formly-field-ia-file.type';
import { FormlyIonicModule } from '@ngx-formly/ionic';

@NgModule({
  declarations: [FormlyFieldIaFileComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    FormlyIonicModule,
    FormlyModule.forChild({
      types: [
        {
          name: 'file',
          component: FormlyFieldIaFileComponent,
          wrappers: ['form-field'],
        },
        {
          name: 'hidden',
        },
        { name: 'enum', extends: 'file' },
      ],
    }),
  ],
  exports: [],
  providers: [],
})
export class FormlyFieldIaFileModule {}
