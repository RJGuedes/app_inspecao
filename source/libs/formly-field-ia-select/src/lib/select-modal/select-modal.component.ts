import { Component, Input, OnInit } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular';

export interface ItemSelectModal {
  label: string;
  value: string;
  group?: {
    label: string;
    value: string;
    group?: string;
  }[];
}

export interface VisibleItemSelectModal {
  label: string;
  value: string;
}

@Component({
  selector: 'seyconel-select-modal',
  templateUrl: './select-modal.component.html',
  styleUrls: ['./select-modal.component.scss'],
})
export class SelectModalComponent implements OnInit {
  @Input()
  items!: ItemSelectModal[];

  visibleItems: ItemSelectModal[] = [];

  @Input()
  value!: string;

  selected: any = null;

  parent: any = null;

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {
    this.visibleItems = this.items;
    if(this.value){
      this.selected = this.getParent(this.value);
      this.parent = this.selected;
    }

  }

  trackById(index: number, item: any) {
    return item.value;
  }
  search(evt: Event) {
    const { detail } = evt as any;
    const { value } = detail;
    this.visibleItems = this.items.filter((i) => {
      return i.label.toLocaleLowerCase().includes(value.toLocaleLowerCase());
    });
  }
  radioChange(evt: Event) {
    const { detail } = evt as any;
    const { value } = detail;
    this.value = value;
  }

  onSubmit() {
    console.log(this.value);
    this.modalCtrl.dismiss(this.value);
  }

  isArray(obj: any) {
    return Array.isArray(obj);
  }

  myHeaderFn(record: any, recordIndex: number, records: any[]) {
    if (recordIndex % 20 === 0) {
      return 'Header ' + recordIndex;
    }
    return null;
  }

  getParent(id: string) {
    if (!this.visibleItems || this.visibleItems.length === 0) {
      return null;
    }
    const parent = this.visibleItems.find((item) => {
      const found = item.group?.find((subItem) => {
        return subItem.value === id;
      });
      return !!found;
    });
    return parent;
  }

  selectSubmit(item: any) {
    this.value = item.value;
    this.modalCtrl.dismiss(item.value);
  }
}
