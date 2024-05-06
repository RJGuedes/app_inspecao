import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { first } from 'rxjs/operators';
import { appConfig } from '@seyconel/config';
import { IaEntity } from '@seyconel/config';
import { IaObject } from '@seyconel/config';
import { RestDatabaseService } from '../../../services/rest-database.service';

@Component({
  selector: 'seyconel-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {
  entity!: IaEntity | null;
  id!: string | null;
  entityId!: string | null;
  fields?: {
    name: string;
    prop: string;
    render?: (value: unknown) => string;
    url?: (model: unknown) => string;
  }[];
  model!: IaObject;

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
    this.fields = this.entity?.detail?.fields;

    if (this.id) {
      const model = await this.db.get(this.entityId, this.id);

      console.log(this.model);
      if (model) {
        this.model = model;
      }
    } else {
      this.navCtrl.navigateBack(`/admin/${this.entityId}/list`);
    }
  }

  renderField(
    model: IaObject,
    field: { name: string; prop: string; render?: (value: unknown) => string }
  ) {
    const value = this.dotNotation(model, field.prop);
    return field?.render ? field.render(value) : value;
  }

  openUrl(
    model: IaObject,
    field: {
      name: string;
      prop: string;
      render?: (value: unknown) => string;
      url?: (model: unknown) => string;
    }
  ) {
    const url = field?.url ? decodeURI(field.url(model)) : null;
    if (url) {
      this.navCtrl.navigateForward(url);
    }
  }

  dotNotation(obj: IaObject, str: string) {
    return str.split('.').reduce((acc: any, each: string) => {
      return acc[each];
    }, obj);
  }
}
