import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { IaEntity, IaObject, appConfig } from '@seyconel/config';
import { map } from 'rxjs/operators';

import { RestDatabaseService } from '../../services/rest-database.service';

@Component({
  selector: 'seyconel-form',
  templateUrl: './filter-form.component.html',
  styleUrls: ['./filter-form.component.scss'],
})
export class FilterFormComponent implements OnInit {
  entity!: IaEntity | null;
  id!: string | null;
  @Input()
  entityId!: string | null;
  form = new FormGroup({});
  fields!: FormlyFieldConfig[];
  model: IaObject = {};
  options: FormlyFormOptions = {};

  constructor(
    private activatedRoute: ActivatedRoute,
    private db: RestDatabaseService,
    private modalCtrl: ModalController
  ) {}

  async ngOnInit() {
    this.entity = this.entityId ? appConfig.entities[this.entityId] : null;

    if (this.entity?.filters?.fields) {
      this.fields = this.entity?.filters?.fields.map((field) => {
        if (field.templateOptions?.dynamicOptions) {
          const options = this.db
            .find(field.templateOptions?.dynamicOptions?.entityId)
            .pipe(
              map((res) => {
                const result = res.data.map((item) => {
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

    console.log('this.id', this.id);

    if (this.id && this.entityId) {
      // const model = await this.db.get(this.entityId, this.id);
      /*if (model) {
        this.model = this.getModelFields(model);
      }*/
      console.log(this.model);
    }
  }

  ionViewDidLeave() {
    this.form.reset();
  }

  async onSubmit() {
    console.log('submit', this.model);
    try {
      this.modalCtrl.dismiss({ ...this.model });
    } catch (err) {
      console.error(err);
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
}
