import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { FieldType } from '@ngx-formly/core';
import { SelectModalComponent } from './select-modal/select-modal.component';

@Component({
  selector: 'seyconel-formly-field-ia-select',
  template: `
    <ng-container
      *ngIf="to.options | formlySelectOptions: field | async; let selectOptions"
    >
      <div (click)="openModal($event, selectOptions)">
        <p *ngIf="formControl.value">
          {{ getLabel(selectOptions, 'label') }}
          <span *ngIf="!selectOptions[0].value">
            ({{ getLabel(selectOptions, 'group') }})</span
          >
          <ion-icon color="medium" name="caret-down"></ion-icon>
        </p>
        <p *ngIf="!formControl.value">
          <ion-text color="medium">Clique para selecionar </ion-text>
          <ion-icon color="medium" name="caret-down"></ion-icon>
        </p>
      </div>
    </ng-container>
  `,
  styles: [
    ':host { display: inherit; } :host div { cursor: pointer; width:100%; } :host ion-icon { font-size: 11px; } :host p span {  }',
  ],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class FormlyFieldIaSelectComponent extends FieldType {
  constructor(
    private modalCtrl: ModalController,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    super();
  }
  defaultOptions = {
    templateOptions: {
      options: [],
      compareWith(o1: any, o2: any) {
        return o1 === o2;
      },
    },
  };

  getLabel(selectOptions: any[], label = 'label') {
    const formValue = this.formControl.value;
    const selected = selectOptions.reduce((acc, group) => {
      if (group.value) {
        if (group.value === formValue) {
          acc = { ...group, group: false };
        }
      } else {
        const item = group.group.find((so: any) => so.value === formValue);
        if (item) {
          acc = { ...item, group: group.label };
        }
      }
      return acc;
    }, {});
    return selected ? selected[label] : '';
  }

  async openModal(evt: MouseEvent, selectOptions: any[]) {
    evt.preventDefault();
    evt.stopPropagation();
    const modal = await this.modalCtrl.create({
      component: SelectModalComponent,
      componentProps: { items: selectOptions, value: this.formControl.value },
    });
    await modal.present();
    const result = await modal.onDidDismiss();
    const { data } = result;
    console.log({ data });
    if (data !== undefined) {
      this.formControl.patchValue(data);
      this.formControl.markAsTouched();
    }
    this.changeDetectorRef.detectChanges();
    return false;
  }
}
