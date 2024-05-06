import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  AlertController,
  LoadingController,
  ModalController,
  NavController,
} from '@ionic/angular';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { IaEntity, IaObject } from '@seyconel/config';
import { filter, first, map } from 'rxjs/operators';
import { appConfig } from '@seyconel/config';
import { SqliteDatabaseService } from '../../services/sqlite-database.service';
import {
  Camera,
  CameraResultType,
  CameraSource,
  Photo,
} from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { PhotoInterface } from '../../entities/photo.entity';
import { PhotoPage } from '../photo/photo.page';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'seyconel-form',
  templateUrl: './form.page.html',
  styleUrls: ['./form.page.scss'],
})
export class FormPage implements OnInit {
  customerId!: string | null;
  surveyId!: string | null;
  sectorId!: string | null;
  itemId!: string | null;
  entity!: IaEntity | null;
  id!: string | null;
  entityId: string | null = 'customers';
  form = new FormGroup({});
  fields!: FormlyFieldConfig[];
  model: IaObject = {};
  photos: PhotoInterface[] = [];
  options: FormlyFormOptions = {};

  segment = 'data';
  constructor(
    private activatedRoute: ActivatedRoute,
    private db: SqliteDatabaseService,
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController
  ) {}

  async ngOnInit() {
    console.log('init')
    await this.db.ready
      .pipe(
        filter((res) => !!res),
        first()
      )
      .toPromise();
      console.log('init2')

    const queryMap = await this.activatedRoute.queryParamMap
      .pipe(first())
      .toPromise();

    const paramMap = await this.activatedRoute.paramMap
      .pipe(first())
      .toPromise();

      console.log({queryMap, paramMap})

    let customerId = queryMap?.get('customerId');
    let surveyId = queryMap?.get('surveyId');
    let sectorId = queryMap?.get('sectorId');
    let itemId = queryMap?.get('itemId');
    const id = paramMap?.get('id');

    this.id = id ? id : null;

    console.log('id', this.id);

    if (!this.id) {
      if (!customerId) {
        this.entityId = 'customers';
      } else if (!surveyId) {
        this.entityId = 'surveys';
      } else if (!sectorId) {
        this.entityId = 'sectors';
      } else if (!itemId) {
        this.entityId = 'items';
      }
    } else {
      customerId = paramMap?.get('customerId');
      surveyId = paramMap?.get('surveyId');
      sectorId = paramMap?.get('sectorId');
      itemId = paramMap?.get('itemId');
      const entityId = paramMap?.get('entityId');
      this.entityId = entityId ? entityId : null;
    }

    this.customerId = customerId ? customerId : null;
    this.surveyId = surveyId ? surveyId : null;
    this.sectorId = sectorId ? sectorId : null;
    this.itemId = itemId ? itemId : null;

    this.entity = this.entityId ? appConfig.entities[this.entityId] : null;

    console.log('this.entity', this.entity);
    console.log({ customerId, surveyId, sectorId, itemId });

    if (this.entity?.appForm?.fields) {
      this.fields = this.entity?.appForm?.fields.map((field) => {
        if (field.templateOptions?.dynamicOptions) {
          const options = this.db
            .find(field.templateOptions?.dynamicOptions?.entityId)
            .pipe(
              map((res: any) => {
                return res.data;
              })
            );
          field.templateOptions.options = options;
        }
        return field;
      });
    }

    if (this.id && this.entityId) {
      const model = await this.db.get(this.entityId, this.id);
      console.log({ model });
      if (model) {
        this.model = this.getModelFields(model);
        /*if (this.model.data) {
          const preParseData: string = this.model.data as string;
          console.log({ preParseData });
          this.model.data = JSON.parse(preParseData);
        }*/
        if (this.entityId === 'items') {
          await this.loadPhotos();
        }
      }
    }
  }

  backButton() {
    let path = '';
    if (this.itemId) {
      path = `/tabs/customers/${this.customerId}/surveys/${this.surveyId}/sectors/${this.sectorId}/items`;
    }
    if (!this.itemId) {
      path = `/tabs/customers/${this.customerId}/surveys/${this.surveyId}/sectors`;
    }
    if (!this.sectorId) {
      path = `/tabs/customers/${this.customerId}/surveys`;
    }
    if (!this.surveyId) {
      path = `/tabs/customers`;
    }
    if (!this.customerId) {
      return;
    }
    return path;
  }

  getModelFields(model: IaObject) {
    const fieldKeys = this.fields.map(
      (field) => field.key?.toString().split('.')[0]
    );
    const data: IaObject = {};
    return Object.keys(model).reduce((acc, key) => {
      if (this.entity?.keyField === key || fieldKeys.indexOf(key) > -1) {
        acc[key] = this.dotNotation(model, key);
      }
      return acc;
    }, data);
  }

  ionViewDidLeave() {
    this.form.reset();
  }

  async onSubmit() {
    if (!this.form.valid) {
      return;
    }
    console.log('submit', this.model);

    const loader = await this.loadingCtrl.create();
    await loader.present();

    const relationsData: any = {};
    if (this.customerId) {
      relationsData.customerId = this.customerId;
    }
    if (this.surveyId) {
      relationsData.surveyId = this.surveyId;
    }
    if (this.sectorId) {
      relationsData.sectorId = this.sectorId;
    }

    if (this.model.data) {
      // this.model.data = JSON.stringify(this.model.data);
    }

    try {
      const res = await this.db.save<any>(this.entityId, {
        ...this.model,
        ...relationsData,
        sync: false,
      });
      console.log({ res });
      await loader.dismiss();
      if (this.entityId !== 'items') {
        this.navCtrl.back();
      } else {
        if (!this.id) {
          this.segment = 'photos';
          this.id = res.id;
          this.model.id = res.id;
        } else {
          this.navCtrl.back();
        }
      }
    } catch (err) {
      console.error(err);
      const alert = await this.alertCtrl.create({
        header: 'Erro!',
        message: 'Erro ao salvar. Verifique todos os campos e tente novamente',
        buttons: ['oK'],
      });
      await loader.dismiss();
      await alert.present();
    }
  }

  dotNotation(obj: IaObject, str: string) {
    if (!str) {
      return '';
    }
    return str.split('.').reduce((acc: any, each: string) => {
      return acc[each];
    }, obj);
  }

  async loadPhotos() {
    const photos = await this.db
      .find<PhotoInterface>('photos', {
        filter: { field: 'itemId', operator: 'eq', value: this.id },
      })
      .pipe(map((d) => d.data));
    this.photos = await firstValueFrom(photos);
  }

  async takePhoto() {
    const cameraPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 60,
    });

    const fileName = new Date().getTime() + '.' + cameraPhoto.format;
    const savedFileImage = await this.savePicture(cameraPhoto, fileName);

    await this.db.save('photos', { ...savedFileImage, itemId: this.id });

    this.loadPhotos();
  }

  async savePicture(photo: Photo, fileName: string): Promise<PhotoInterface> {
    const thumb = await this.resizedataURL(
      photo.webPath ? photo.webPath : '',
      50
    );
    console.log({ thumb }, thumb ? thumb.length : 0);
    const base64Data = await this.base64FromPath(
      photo.webPath ? photo.webPath : ''
    );
    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data,
    });
    return {
      file: fileName,
      thumb,
    };
  }

  resizedataURL(datas: string, size: number): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = document.createElement('img');
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        let width, height, ratio;
        if (img.width > img.height) {
          ratio = img.height / img.width;
          width = size;
          height = size * ratio;
        } else {
          ratio = img.width / img.height;
          height = size;
          width = size * ratio;
        }
        console.log({ ratio, width, height }, img.width, img.height);
        canvas.width = width;
        canvas.height = height;
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
        }
        const dataURI = canvas.toDataURL();
        resolve(dataURI);
      };
      img.src = datas;
    });
  }

  async base64FromPath(path: string): Promise<string> {
    const response = await fetch(path);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject('method did not return a string');
        }
      };
      reader.readAsDataURL(blob);
    });
  }

  async openPicture(photo: PhotoInterface, index: number) {
    /*await Browser.open({
      url: photo.file ? photo.file : '',
      presentationStyle: 'fullscreen'
    })*/
    const modal = await this.modalCtrl.create({
      component: PhotoPage,
      componentProps: {
        photo: photo,
        title: `${this.model.traceability} | Foto ${index + 1}/${
          this.photos.length
        }`,
      },
    });

    await modal.present();
  }
}
