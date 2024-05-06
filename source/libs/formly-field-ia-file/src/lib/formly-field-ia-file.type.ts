import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewChild,
  OnInit,
  AfterViewInit,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { IonInput, ModalController, Platform } from '@ionic/angular';
import { FieldType } from '@ngx-formly/core';
import { Camera, CameraResultType } from '@capacitor/camera';

@Component({
  selector: 'seyconel-formly-field-ia-file',
  template: `
    <ion-thumbnail (click)="sendCamera()">
      <ion-img [src]="getPhotoUrl()"></ion-img>
    </ion-thumbnail>
    <input
      type="hidden"
      [formControl]="formControl"
      [ionFormlyAttributes]="field"
    />
  `,
  styles: [
    `
      :host {
        display: block;
        margin: 30px 0 10px;
      }
      :host ion-thumbnail {
        width: 150px;
        height: 150px;
        background: var(--ion-color-dark);
        border-radius: 100%;
        border: 2px solid var(--ion-color-dark);
      }
      :host ion-thumbnail ion-img {
        background: var(--ion-color-dark);
        border-radius: 100%;
      }
    `,
  ],

  changeDetection: ChangeDetectionStrategy.Default,
})
export class FormlyFieldIaFileComponent extends FieldType<any> {

  @ViewChild('input', { static: false }) input!: IonInput;
  constructor(
    public platform: Platform,
    private changeDetector: ChangeDetectorRef
  ) {
    super();
  }

  ngOnInit() {
    this.formControl.valueChanges.subscribe((data: any) => {
      this.changeDetector.detectChanges();
    });
  }

  getPhotoUrl() {
    const path = !this.formControl?.value?.needsUpload
      ? this.to.filePath()
      : '';
    return !this.formControl?.value?.needsUpload
      ? `${this.form.get('photoUrl')?.value}`
      : `${this.formControl.value?.photoUrl}`;
  }

  async sendCamera() {
    try {
      const photo = await Camera.getPhoto({
        quality: 60,
        allowEditing: true,
        resultType: CameraResultType.Uri,
      });

      console.log('sendCamera', photo);

      const oldId = this.formControl?.value?.id;
      // console.log(photoURL);
      this.formControl.setValue({
        ...(oldId ? { oldId } : null),
        photoUrl: photo.webPath,
        format: photo.format,
        needsUpload: true,
      });
      this.changeDetector.detectChanges();
    } catch (err) {
      console.log({ err });
    }
  }
}
