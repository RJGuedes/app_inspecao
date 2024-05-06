import { Component, Input, OnInit } from '@angular/core';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { ModalController } from '@ionic/angular';
import { PhotoInterface } from '../../entities/photo.entity';

@Component({
  selector: 'seyconel-photo',
  templateUrl: './photo.page.html',
  styleUrls: ['./photo.page.scss'],
})
export class PhotoPage implements OnInit {
  @Input() photo!: PhotoInterface;
  src!: string;
  @Input() title!: string;
  isFull = false;

  isLoaded = false;
  constructor(private modalCtrl: ModalController) {}

  async ngOnInit() {
    const b64 = await Filesystem.readFile({
      path: this.photo.file ? this.photo.file : '',
      directory: Directory.Data,
    });
    this.src = `data:image/jpeg;base64,${b64.data}`;
    this.isLoaded = true;
  }

  async close() {
    await this.modalCtrl.dismiss();
  }
}
