import { Component, Input, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'seyconel-popover-list',
  templateUrl: './popover-list.component.html',
  styleUrls: ['./popover-list.component.scss'],
})
export class PopoverListComponent implements OnInit {
  @Input()
  items!: {
    label: string;
    icon: string;
    handler: () => void;
  }[];

  constructor(private popoverCtrl: PopoverController) {}

  ngOnInit(): void {}

  select(item: { label: string; icon: string; handler: () => void }) {
    this.popoverCtrl.dismiss(item);
  }
}
