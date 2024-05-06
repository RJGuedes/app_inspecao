import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { first, map } from 'rxjs/operators';
import { appConfig } from '@seyconel/config';
import { IaEntity } from '@seyconel/config';
import { IaObject } from '@seyconel/config';
import { RestDatabaseService } from '../../../services/rest-database.service';

@Component({
  selector: 'seyconel-form',
  templateUrl: './form.page.html',
  styleUrls: ['./form.page.scss'],
})
export class FormPage implements OnInit {
  entity!: IaEntity | null;
  id!: string | null;
  entityId!: string | null;
  form = new FormGroup({});
  fields!: FormlyFieldConfig[];
  model: any = {};
  options: FormlyFormOptions = {};

  constructor(
    private activatedRoute: ActivatedRoute,
    private db: RestDatabaseService,
    private navCtrl: NavController
  ) {}

  async ngOnInit() {
    const paramMap = await this.activatedRoute.paramMap
      .pipe(first())
      .toPromise();
    this.entityId = paramMap ? paramMap.get('entity') : null;
    this.id = paramMap ? paramMap.get('id') : null;
    this.entity = this.entityId ? appConfig.entities[this.entityId] : null;

    if (this.entity?.form?.fields) {
      this.fields = this.entity?.form?.fields.map((field) => {
        if (field.templateOptions?.dynamicOptions) {
          const options = this.db
            .find(field.templateOptions?.dynamicOptions?.entityId)
            .pipe(
              map((res) => {
                const result = res.data.map((item) => {
                  const group = field.templateOptions?.dynamicOptions;
                  return {
                    label: item[field.templateOptions?.dynamicOptions?.label],
                    value: item[field.templateOptions?.dynamicOptions?.value],
                    group: this.dotNotation(
                      item,
                      field.templateOptions?.dynamicOptions?.group
                    ),
                  };
                });
                return result;
              })
            );
          field.templateOptions.options = options;
        }
        return field;
      });
    }

    if (this.id && this.entityId) {
      const model = await this.db.get(this.entityId, this.id);

      if (model) {
        this.model = this.getModelFields(model);
      }
    }
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
    console.log('submit', this.model);
    if (this.entityId === 'photos') {
      return this.uploadPhoto();
    }
    try {
      await this.db.save(this.entityId, this.model);
      this.navCtrl.navigateBack(`/admin/${this.entityId}/list`);
    } catch (err) {
      console.error(err);
    }
  }

  async uploadPhoto() {
    console.log('submit', this.model);
    try {
      const blob = this.model.file.needsUpload
        ? await this.getBlob(this.model.file.photoUrl)
        : null;

      await this.db.upload(blob, this.model.file.format, this.model);
      // await this.db.save(this.entityId, this.model);
      this.navCtrl.navigateBack(`/admin/${this.entityId}/list`);
    } catch (err) {
      console.error(err);
    }
  }

  getBlob(pictureUrl: string): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function () {
        reject(new Error('getBlob failed'));
      };
      xhr.responseType = 'blob';
      xhr.open('GET', pictureUrl, true);
      xhr.send(null);
    });
  }

  dotNotation(obj: IaObject, str: string) {
    if (!str) {
      return '';
    }
    return str.split('.').reduce((acc: any, each: string) => {
      return acc[each];
    }, obj);
  }
}
