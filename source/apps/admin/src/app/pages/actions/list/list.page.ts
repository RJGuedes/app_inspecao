import {
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  AlertController,
  IonSearchbar,
  ModalController,
  NavController,
  ToastController,
} from '@ionic/angular';
import {
  QuerySortOperator,
  CreateQueryParams,
  QueryFilter,
} from '@dataui/crud-request';
import { DatatableComponent, TableColumn } from '@swimlane/ngx-datatable';
import { Observable, Subject } from 'rxjs';
import { first, map, switchMap, tap } from 'rxjs/operators';
import { FilterFormComponent } from '../../../components/filter-form/filter-form.component';
import { PopoverListService } from '../../../components/popover-list/popover-list.service';
import { appConfig } from '@seyconel/config';
import { IaEntity } from '@seyconel/config';
import { IaObject } from '@seyconel/config';
import { RestDatabaseService } from '../../../services/rest-database.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'seyconel-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit, OnDestroy {
  @ViewChild('datatable')
  datatable!: DatatableComponent;
  @ViewChild('buttonsTemplate')
  buttonsTemplate!: TemplateRef<unknown>;

  @ViewChild('searchBar')
  searchBar!: IonSearchbar;
  data$!: Observable<IaObject[]>;
  data!: unknown[];
  entity!: IaEntity;
  entityId!: string;

  cols!: TableColumn[];

  loading = true;
  dataSubject = new Subject<CreateQueryParams>();
  searchEnabled = false;
  actions: { [k: string]: boolean } = {};
  totalElements = 0;
  query: CreateQueryParams = {
    page: 1,
    offset: 0,
    limit: 15,
    sort: { field: 'modifiedAt', order: 'DESC' },
  };

  filtersLabel: { [k: string]: string } = {};

  filtersValueLabel: { [k: string]: string } = {};
  constructor(
    private activatedRoute: ActivatedRoute,
    private db: RestDatabaseService,
    private popoverList: PopoverListService,
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private modalCtrl: ModalController
  ) {}

  async ngOnInit() {
    const paramMap = await this.activatedRoute.paramMap
      .pipe(first())
      .toPromise();

    const queryMap = await this.activatedRoute.queryParamMap
      .pipe(first())
      .toPromise();

    const entityId = paramMap ? paramMap.get('entity') : null;
    if (!entityId) {
      return;
    }
    this.entityId = entityId;
    this.entity = appConfig.entities[this.entityId];

    if (this.entity.list?.queryFilters) {
      if (!this.query.filter) {
        this.query.filter = [];
      }
      if (!Array.isArray(this.query.filter)) {
        this.query.filter = [this.query.filter];
      }

      for (const field of this.entity.list?.queryFilters) {
        const value = queryMap ? queryMap.get(field) : null;
        if (value) {
          this.query.filter.push({ field, operator: 'eq', value });
        }
      }
    }

    const actions: { [k: string]: boolean } = {};
    this.actions = this.entity.actions
      ? this.entity.actions?.reduce((acc, each) => {
          const actionString = each as string;
          acc[actionString] = true;
          return acc;
        }, actions)
      : actions;
    this.cols = [
      ...(this.entity?.list?.columns ? [...this.entity.list.columns] : []),
      {
        prop: 'id',
        width: this.calcActionsColWidth(this.entity),
        maxWidth: this.calcActionsColWidth(this.entity),
        minWidth: this.calcActionsColWidth(this.entity),
        cellClass: 'action-buttons',
        name: 'Ações',
        sortable: false,
        cellTemplate: this.buttonsTemplate,
      },
    ];
    const filtersLabel: { [k: string]: string } = {};
    this.filtersLabel = this.entity.filters?.fields
      ? this.entity.filters?.fields?.reduce((acc, each) => {
          const key = each.key as string;
          if (key && each.templateOptions?.label) {
            acc[key] = each.templateOptions.label;
          }
          return acc;
        }, filtersLabel)
      : filtersLabel;

    this.data$ = this.dataSubject.pipe(
      tap(() => {
        this.loading = true;
      }),
      switchMap((res) => {
        console.log({ res });

        return this.db.find(this.entityId, res);
      }),
      map((res) => {
        console.log('res', res);

        this.getFiltersValueLabel(res.data);
        //console.log('this.page', this.page);
        /*this.page.pageNumber = res.page - 1;
        // this.page.size = res.count;
        this.page.totalPages = res.pageCount;
        this.page.totalElements = res.total;*/
        this.query.page = res.page - 1;
        this.totalElements = res.total;
        return res;
      }),
      tap(() => {
        this.loading = false;
      }),
      map((res) => {
        return res.data;
      })
    );
  }

  rowIdentity(row: IaObject) {
    return row.id;
  }

  renderFilter(filter: QueryFilter) {
    return filter.field.endsWith('Id') && this.filtersValueLabel[filter.value]
      ? this.filtersValueLabel[filter.value]
      : filter.value;
  }

  ngOnDestroy() {}

  ionViewDidEnter() {
    console.log('onEnter');
    this.refreshData();
    this.datatable.recalculate();
  }

  refreshData() {
    this.dataSubject.next(this.query);
  }

  getFiltersValueLabel(data: IaObject[]) {
    if (!this.entity?.list?.queryFilters || !data || data.length < 1) {
      return;
    }
    for (const filter of this.entity?.list?.queryFilters) {
      const relatedField = filter.slice(0, -2);
      console.log({ relatedField });
      const related = data[0][relatedField] as IaObject;
      console.log({ related });

      const id = related.id as string;
      const name = related.name as string;
      this.filtersValueLabel[id] = name;
    }
  }

  setPage(pageInfo: {
    offset?: number;
    count?: number;
    limit?: number;
    pageSize?: number;
  }) {
    this.loading = true;

    console.log('setpage', pageInfo);
    if (pageInfo.offset !== undefined) {
      // this.page.pageNumber = pageInfo.offset;
      this.query.page = pageInfo.offset + 1;
    }
    if (pageInfo.count !== undefined && pageInfo.count > 0) {
      this.dataSubject.next(this.query);
    }
  }

  setSort(event: any) {
    // event was triggered, start sort sequence
    console.log('Sort Event', event);
    this.loading = true;
    const sort = event?.sorts[0];
    const order = (sort.dir as string).toLocaleUpperCase() as QuerySortOperator;
    this.query.sort = { field: sort.prop, order };
    this.dataSubject.next(this.query);

    // emulate a server request with a timeout
  }

  async setSearch(evt: Event) {
    if (!this.entity || !this.entity.search) {
      return;
    }
    const { detail } = evt as any;
    const { value } = detail;
    this.loading = true;
    this.query.offset = 0;
    this.query.search = value !== '' ? this.entity.search(value) : {};
    this.dataSubject.next(this.query);
  }

  async removeFilter(filter: QueryFilter) {
    console.log('removeFilter', filter);
    if (Array.isArray(this.query.filter)) {
      console.log('is Array', this.query.filter);
      this.query.filter = this.query.filter.filter(
        (f) => f.field !== filter.field
      );
    }
    this.dataSubject.next(this.query);
  }

  async openPopover(evt: MouseEvent) {
    if (!this.entity || !this.entity.actions) {
      return;
    }
    const items = [
      ...(this.entity.actions?.indexOf('add') > -1
        ? [
            {
              label: 'Adicionar',
              icon: 'add',
              handler: () =>
                this.navCtrl.navigateForward(`/admin/${this.entityId}/form`),
            },
          ]
        : []),
      ...(this.entity.actions?.indexOf('search') > -1
        ? [
            {
              label: 'Pesquisar',
              icon: 'search',
              handler: () => {
                this.searchEnabled = true;
                if (this.query.filter) {
                  delete this.query.filter;
                  this.dataSubject.next(this.query);
                }
                setTimeout(() => {
                  this.searchBar.setFocus();
                }, 250);
                // this.navCtrl.navigateForward(`${this.entityId}/search`),
              },
            },
          ]
        : []),
      ...(this.entity.actions?.indexOf('filter') > -1
        ? [
            {
              label: 'Filtrar',
              icon: 'funnel',
              handler: () => {
                this.openFilter();
              },
            },
          ]
        : []),
    ];
    await this.popoverList.open(evt, items);
  }

  async openFilter() {
    const modal = await this.modalCtrl.create({
      component: FilterFormComponent,
      componentProps: { entityId: this.entityId },
    });
    // this.datatable.element.style.setProperty('--ia-list-top', `${56 + 56}px`);
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (data) {
      const filter: QueryFilter[] = [];
      delete this.query.search;
      this.query.filter = Object.keys(data)
        .filter((k) => !!data[k])
        .reduce((acc, field) => {
          const value = data[field];
          acc.push({ field, operator: '$eq', value });
          return acc;
        }, filter);
      /*if (this.query.filter.length < 0) {
      }*/
      this.searchEnabled = false;

      this.dataSubject.next(this.query);
    }
  }

  async detail(row: IaObject) {
    console.log('detail', row);
    if (!this.entity) {
      throw new Error('Entity not defined');
    }
    this.navCtrl.navigateForward(
      `/admin/${this.entityId}/detail/${row[this.entity.keyField]}`
    );
  }

  async export(row: IaObject) {
    console.log('report', row);
    if (!this.entity) {
      throw new Error('Entity not defined');
    }
    /*this.navCtrl.navigateForward(
      `/admin/${this.entityId}/detail/${row[this.entity.keyField]}`
    );*/
    window.open(`${environment.apiUrl}/pdf/${row[this.entity.keyField]}`);
  }

  async edit(row: IaObject) {
    console.log('edit', row);
    if (!this.entity) {
      throw new Error('Entity not defined');
    }
    this.navCtrl.navigateForward(
      `/admin/${this.entityId}/form/${row[this.entity.keyField]}`
    );
  }

  async print(row: IaObject) {
    console.log('report', row);
    if (!this.entity) {
      throw new Error('Entity not defined');
    }
    /*this.navCtrl.navigateForward(
      `/admin/${this.entityId}/detail/${row[this.entity.keyField]}`
    );*/
    window.open(
      `${environment.apiUrl}/reports/pdf/${row[this.entity.keyField]}`
    );
  }
  async remove(row: IaObject) {
    console.log('remove', row);
    if (!this.entity) {
      throw new Error('Entity not defined');
    }
    const alert = await this.alertCtrl.create({
      header: `Remover ${this.entity?.labelSingular.toLocaleLowerCase()}`,
      message: `Você tem certeza que gostaria de remover "${
        row[this.entity.displayField]
      }"?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Remover',
          role: 'destroy',
          handler: async () => {
            try {
              const keyField = this.entity.keyField;
              const rowKey = row[keyField] as string;
              await this.db.remove(this.entityId, rowKey);
              const toast = await this.toastCtrl.create({
                header: 'Removido!',
                message: `${this.entity.labelSingular} removido com sucesso.`,
                color: 'success',
                duration: 3000,
                position: 'top',
                buttons: [{ icon: 'close' }],
              });
              this.refreshData();
              await toast.present();
            } catch (err) {
              const toast = await this.toastCtrl.create({
                header: 'Erro!',
                message:
                  'Não foi possível remover o registro. Tente novamente.',
                color: 'danger',
              });
              await toast.present();
            }
          },
        },
      ],
    });
    await alert.present();
  }

  async report(row: IaObject) {
    console.log('remove', row);
    if (!this.entity) {
      throw new Error('Entity not defined');
    }
    const alert = await this.alertCtrl.create({
      header: `Relatório`,
      message: `Para gerar o relatório preenchar o número RI`,
      inputs: [
        {
          name: 'ri',
          type: 'number',
        },
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Gerar relatório',
          role: 'destroy',
          handler: async (data) => {
            try {
              const keyField = this.entity.keyField;
              const rowKey = row[keyField] as string;
              await this.db.customGet(`reports/generate/${row.id}/${data.ri}`);
              const toast = await this.toastCtrl.create({
                header: 'Relatório gerado!',
                message: `O relatório de '${
                  row[this.entity.displayField]
                }' foi gerado com sucesso.`,
                color: 'success',
                duration: 3000,
                position: 'top',
                buttons: [{ icon: 'close' }],
              });
              this.refreshData();
              await toast.present();
            } catch (err) {
              const toast = await this.toastCtrl.create({
                header: 'Erro!',
                message:
                  'Não foi possível remover o registro. Tente novamente.',
                color: 'danger',
              });
              await toast.present();
            }
          },
        },
      ],
    });
    await alert.present();
  }

  private calcActionsColWidth(entity: IaEntity): number {
    if (!entity?.actions) {
      return 0;
    }
    const listActions = ['edit', 'detail', 'remove', 'report', 'print'];
    const pxPerAction = 56;
    const listActionsCount = entity.actions.reduce((acc, action) => {
      if (listActions.indexOf(action) > -1) {
        acc++;
      }
      return acc;
    }, 0);
    return listActionsCount * pxPerAction;
  }

  hasMenuActions(entity: IaEntity): boolean {
    if (!entity?.actions) {
      return false;
    }
    const menuActions = ['add', 'search'];
    return !!entity.actions.find((action) => menuActions.indexOf(action) > -1);
  }
}
