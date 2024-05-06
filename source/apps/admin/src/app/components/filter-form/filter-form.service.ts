import { Injectable } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { FilterFormComponent } from './filter-form.component';

@Injectable({
  providedIn: 'root',
})
export class FilterFormService {
  constructor(private popoverCtrl: PopoverController) {}

  async open(
    event: Event,
    items: {
      label: string;
      icon?: string;
      handler: () => void;
    }[]
  ) {
    const popover = await this.popoverCtrl.create({
      event,
      component: FilterFormComponent,
      componentProps: { items },
    });
    await popover.present();
    const { data } = await popover.onDidDismiss();
    return data.handler();
  }
}
