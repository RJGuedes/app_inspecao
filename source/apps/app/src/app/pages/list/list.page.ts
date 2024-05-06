import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { CreateQueryParams } from '@dataui/crud-request';
import {
  BehaviorSubject,
  firstValueFrom,
  Observable,
  Subscription,
} from 'rxjs';
import { filter, first, scan } from 'rxjs/operators';
import { LocalDatabaseService } from '../../services/local-database.service';
import { SqliteDatabaseService } from '../../services/sqlite-database.service';

export interface ParamI {
  customerId?: string;
  surveyId?: string;
  sectorId?: string;
  itemId?: string;
}

@Component({
  selector: 'seyconel-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit, OnDestroy {
  /*data = [
    { name: 'Teste', id: 'teste' },
    { name: 'Teste 2', id: 'teste-2' },
    { name: 'Teste 3', id: 'teste-3' },
  ];*/

  _data = new BehaviorSubject<any[] | false>([]);
  data$!: Observable<any[]>;
  paramSub!: Subscription;
  param: ParamI = {};
  entityId!: string;
  title!: string;
  // data$!: Observable<IaRestResponse>;

  query: CreateQueryParams = {
    page: 1,
    limit: -1,
    sort: { field: 'modifiedAtLocal', order: 'DESC' },
  };
  constructor(
    private activatedroute: ActivatedRoute,
    private navCtrl: NavController,
    private db: SqliteDatabaseService,
    private localDb: LocalDatabaseService,
    private alertCtrl: AlertController
  ) {}

  backButton() {
    const { customerId, surveyId, sectorId, itemId } = this.param;
    let path = '';
    if (itemId) {
      path = `/tabs/customers/${customerId}/surveys/${surveyId}/sectors/${sectorId}/items`;
    }
    if (!itemId) {
      path = `/tabs/customers/${customerId}/surveys/${surveyId}/sectors`;
    }
    if (!sectorId) {
      path = `/tabs/customers/${customerId}/surveys`;
    }
    if (!surveyId) {
      path = `/tabs/customers`;
    }
    if (!customerId) {
      return;
    }

    return path;
  }

  ngOnInit() {
    this.paramSub = this.activatedroute.paramMap.subscribe((paramMap) => {
      const customerId = paramMap.get('customerId');
      const surveyId = paramMap.get('surveyId');
      const sectorId = paramMap.get('sectorId');
      const itemId = paramMap.get('itemId');
      this.getTitle(customerId, surveyId, sectorId, itemId);
      this.param = {
        ...(customerId ? { customerId } : null),
        ...(surveyId ? { surveyId } : null),
        ...(sectorId ? { sectorId } : null),
        ...(itemId ? { itemId } : null),
      };
      this.entityId = this.getEntityId();

      console.log(this.entityId);

      this._data.next([]);
      this.data$ = this._data.asObservable().pipe(
        scan((acc: any, newData) => {
          return newData === false ? [] : acc.concat(newData);
        })
      );

      console.log('Param', this.param);

      switch (this.entityId) {
        case 'customers':
          break;
        case 'surveys':
          this.query.filter = {
            field: 'customerId',
            operator: 'eq',
            value: this.param.customerId,
          };
          break;
        case 'sectors':
          this.query.filter = {
            field: 'surveyId',
            operator: 'eq',
            value: this.param.surveyId,
          };
          break;
        case 'items':
          this.query.filter = {
            field: 'sectorId',
            operator: 'eq',
            value: this.param.sectorId,
          };
          break;
      }

      this.loadData();
    });
  }

  async getTitle(
    customerId: string | null,
    surveyId: string | null,
    sectorId: string | null,
    itemId: string | null
  ) {
    await this.db.ready
      .pipe(
        filter((res) => !!res),
        first()
      )
      .toPromise();
    let title = '';
    if (customerId) {
      const res = await this.db.get('customers', customerId);
      title += `${res.name}`;
    } else {
      this.title = title;
      return;
    }
    if (surveyId) {
      const res = await this.db.get('surveys', surveyId);
      title += ` / ${res.name}`;
    }
    if (sectorId) {
      const res = await this.db.get('sectors', sectorId);
      title += ` / ${res.name}`;
    }
    if (itemId) {
      const res = await this.db.get('items', itemId);
      title += ` / ${res.name}`;
    }
    this.title = title;
  }

  async infiniteScroll(event: any) {
    // this.loadData();
    this.query.page = this.query.page ? this.query.page + 1 : 1;
    await this.loadData();
    event.target.complete();
  }

  async loadData(reset = false) {
    await this.db.ready
      .pipe(
        filter((res) => !!res),
        first()
      )
      .toPromise();
    if (reset) {
      this._data.next(false);
    }
    const data$ = this.db.find(this.entityId, this.query).pipe(first());
    const data = await firstValueFrom(data$);
    this.query.page = data?.page ? data?.page : 1;
    this._data.next(data?.data ? data?.data : []);
    return true;
  }

  getEntityId() {
    const { customerId, surveyId, sectorId, itemId } = this.param;
    if (!customerId) {
      return 'customers';
    }
    if (!surveyId) {
      return 'surveys';
    }
    if (!sectorId) {
      return 'sectors';
    }
    if (!itemId) {
      return 'items';
    }
    return 'items';
  }

  ngOnDestroy() {
    this.paramSub.unsubscribe();
  }

  open(doc: any) {
    const { customerId, surveyId, sectorId, itemId } = this.param;
    console.log('open', doc, { customerId, surveyId, sectorId, itemId });
    let path = '';
    if (!itemId) {
      path = `/form/items/${doc.id}`;
    }
    if (!sectorId) {
      path = `/tabs/customers/${customerId}/surveys/${surveyId}/sectors/${doc.id}/items`;
    }
    if (!surveyId) {
      path = `/tabs/customers/${customerId}/surveys/${doc.id}/sectors`;
    }
    if (!customerId) {
      path = `/tabs/customers/${doc.id}/surveys`;
    }

    this.navCtrl.navigateForward(path, {
      animated: true,
    });
    return true;
  }

  trackById(index: number, item: any) {
    return item.id;
  }

  async getSync() {
    const alert = await this.alertCtrl.create({
      header: 'Atualizar dados',
      message:
        'Tem certeza que deseja atualizar os Clientes e Vistorias com o servidor?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Atualizar',
          handler: async () => {
            await this.localDb.getSync();
            this.loadData(true);
          },
        },
      ],
    });
    await alert.present();
  }
}
