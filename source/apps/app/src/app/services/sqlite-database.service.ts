import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { CreateQueryParams } from '@dataui/crud-request';
import { AuthService } from '../services/auth.service';
import { filter, first, map, switchMap } from 'rxjs/operators';
import { CapacitorSQLite, SQLiteConnection } from '@capacitor-community/sqlite';
import {
  Connection,
  createConnection,
  EntityTarget,
  FindManyOptions,
} from 'typeorm';
import { Capacitor } from '@capacitor/core';
import {
  CustomerEntity,
  ItemEntity,
  SectorEntity,
  SurveyEntity,
} from '../entities';
import { RestDatabaseService } from './rest-database.service';
import { PhotoEntity, PhotoInterface } from '../entities/photo.entity';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { SQLiteService } from './sqlite.service';
import { Storage } from '@ionic/storage';

export interface IaRestResponse<T> {
  data: T[];
  count: number;
  total: number;
  page: number;
  pageCount: number;
}

@Injectable({
  providedIn: 'root',
})
export class SqliteDatabaseService {
  uniqueKey = 'id';
  db!: Connection;
  _ready!: BehaviorSubject<boolean>;
  ready!: Observable<boolean>;

  entities: { [k: string]: EntityTarget<any> } = {
    customers: CustomerEntity,
    surveys: SurveyEntity,
    sectors: SectorEntity,
    items: ItemEntity,
    photos: PhotoEntity,
  };

  constructor(
    private auth: AuthService,
    private rest: RestDatabaseService,
    private sqlite: SQLiteService,
    private storage: Storage
  ) {
    this._ready = new BehaviorSubject<boolean>(false);
    this.ready = this._ready.asObservable().pipe(filter((val) => !!val));
  }

  async init() {
    try {
      const platform = Capacitor.getPlatform();
      // alert(JSON.stringify({ platform }));


      console.log({ platform });

      const isNative = ['android', 'ios'].indexOf(platform) > -1;
      // alert(JSON.stringify({ isNative }));

      console.log('SqliteDB init', { isNative });

      if(!isNative){
        await this.sqlite.initWebStore()

      }

      console.log('SqliteDB init2');

      const result = await CapacitorSQLite.checkConnectionsConsistency({
        openModes: ["RW"],
        dbNames: ['customers', 'surveys', 'sectors', 'items', 'photos'], // i.e. "i expect no connections to be open"
      }).catch((e) => {
        console.log(e);
        // alert(JSON.stringify({ consistencyError: e }));
        return {};
      });

      // alert(JSON.stringify({ consistency: result }));

      const driver = new SQLiteConnection(CapacitorSQLite);

      const res = await driver.checkConnectionsConsistency();
      // alert(JSON.stringify({ res }));

      const isConn = (await driver.isConnection('seyconeldb', false)).result;
      // alert(JSON.stringify({ isConn }));

      if (res.result && isConn) {
        await driver.closeConnection('seyconeldb', false);
        // alert(JSON.stringify({ close: true }));
      }

      console.log({ driver });
      // alert(JSON.stringify('checkConnections ok'));
      this.db = await createConnection({
        database: 'seyconeldb',
        driver,
        name: 'seyconeldb',
        mode: 'no-encryption',
        type: 'capacitor',
        version: 1,
        entities: [
          CustomerEntity,
          SurveyEntity,
          SectorEntity,
          ItemEntity,
          PhotoEntity,
        ],
        synchronize: true,
        logging: false,
      });
      // alert(JSON.stringify('afterCreate ok'))
      // alert(JSON.stringify('created: ' + this.db?.name));
      // alert(JSON.stringify('connected: ' + this.db?.isConnected));

      if (this.db) {
        // this.db.synchronize();
        this._ready.next(true);
      }
    } catch (err) {
      // alert(JSON.stringify('Error'));
      // alert(JSON.stringify(err.message));
      // alert(JSON.stringify(err.error));
      // alert(JSON.stringify(err));
      // alert(JSON.stringify({ 'this.db': this.db }));
    }
  }

  async totalWaitingForSync() {
    const customersCount = await this.db?.manager.count(CustomerEntity, {
      where: { sync: false },
    });
    const surveysCount = await this.db?.manager.count(SurveyEntity, {
      where: { sync: false },
    });
    const sectorsCount = await this.db?.manager.count(SectorEntity, {
      where: { sync: false },
    });
    const itemsCount = await this.db?.manager.count(ItemEntity, {
      where: { sync: false },
    });
    const photosCount = await this.db?.manager.count(PhotoEntity, {
      where: { sync: false },
    });
    return (
      (customersCount ? customersCount : 0) +
      (surveysCount ? surveysCount : 0) +
      (sectorsCount ? sectorsCount : 0) +
      (itemsCount ? itemsCount : 0) +
      (photosCount ? photosCount : 0)
    );
  }

  async postSync() {
    const customers = await this.db?.manager.find(CustomerEntity, {
      where: { sync: false },
    });
    const surveys = await this.db?.manager.find(SurveyEntity, {
      where: { sync: false },
    });
    const sectors = await this.db?.manager.find(SectorEntity, {
      where: { sync: false },
    });
    const items = await this.db?.manager.find(ItemEntity, {
      where: { sync: false },
    });
    const photos = await this.db?.manager.find(PhotoEntity, {
      where: { sync: false },
    });
    console.log('sync', { customers, surveys, sectors, items, photos });

    const result: {
      customers: any[];
      surveys: any[];
      sectors: any[];
      items: any[];
      photos: any[];
    } = {
      customers: [],
      surveys: [],
      sectors: [],
      items: [],
      photos: [],
    };

    if (customers.length > 0) {
      const customerArr = [customers];
      for (const _customers of customerArr) {
        const res = await this.rest.syncToServer('customers', _customers);
        if (res) {
          result.customers.concat(res);
          await this.db.manager.save(CustomerEntity, res);
        }
      }
    }

    if (surveys.length > 0) {
      const surveyArr = [surveys];
      for (const _surveys of surveyArr) {
        const res = await this.rest.syncToServer('surveys', _surveys);
        if (res) {
          result.surveys.concat(res);
          await this.db.manager.save(SurveyEntity, res);
        }
      }
    }

    if (sectors.length > 0) {
      const sectorArr = [sectors];
      for (const _sectors of sectorArr) {
        const res = await this.rest.syncToServer('sectors', _sectors);
        if (res) {
          result.sectors.concat(res);
          await this.db.manager.save(SectorEntity, res);
        }
      }
    }

    if (items.length > 0) {
      const itemArr = [items];
      for (const _items of itemArr) {
        const items = _items.map((item) => ({
          ...item,
          // data: item.data,
        }));
        const res = await this.rest.syncToServer('items', items);
        if (res) {
          result.items.concat(res);
          await this.db.manager.save(ItemEntity, res);
        }
      }
    }

    if (photos.length > 0) {
      const photoArr = [photos];
      for (const _photos of photoArr) {
        for (const _photo of _photos) {
          const res = await this.uploadPhoto(_photo);
          if (res) {
            result.photos.concat(res);
            await this.db.manager.save(PhotoEntity, {
              id: _photo.id,
              sync: true,
            });
          }
        }
      }
    }

    console.log('sync result', result);
  }

  async uploadPhoto(photo: PhotoInterface) {
    try {
      const b64 = await Filesystem.readFile({
        path: photo.file ? photo.file : '',
        directory: Directory.Data,
      });
      const format = photo.file ? photo.file.split('.').pop() : '';
      const file = `data:image/${format};base64,${b64.data}`;
      const blob = await this.getBlob(file);
      return await this.rest.upload(blob, format ? format : '', {
        itemId: photo.itemId,
      });
    } catch (err) {
      console.error(err);
      return err;
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

  async initTables() {
    if (!this.db) {
      return;
    }
    //await this.db.synchronize(true);

    /*const customers = new Array(100).fill(1).map((i, k) => {
      const customer: CustomerInterface = {};
      customer.cnpj = `${k}123123123`;
      customer.name = `Cliente ${k + 1}`;
      return customer;
    });

    const customerRepo = this.db.getRepository<CustomerInterface>(
      CustomerEntity
    );
    for (const customer of customers) {
      await customerRepo.save({
        ...customer,
        savedAt: new Date().toISOString(),
      });
    }

    const surveys = new Array(200).fill(1).map((i, k) => {
      const survey: SurveyInterface = {};
      survey.name = `Vistoria ${k+1}`;
      survey.customerId =
        customers[Math.floor(Math.random() * customers.length)].id;
      return survey;
    });
    const surveyRepo = this.db.getRepository<SurveyInterface>(SurveyEntity);
    for (const survey of surveys) {
      await surveyRepo.save({ ...survey, savedAt: new Date().toISOString() });
    }*/

    /*const sectors = new Array(300).fill(1).map((k) => {
      const sector = new SectorEntity();
      sector.name = `Vistoria ${k}`;
      sector.surveyId = surveys[Math.floor(Math.random() * surveys.length)].id;
      sector.savedAt = new Date().toISOString();
      return sector;
    });

    const items = new Array(500).fill(1).map((k) => {
      const item = new ItemEntity();
      item.name = `Vistoria ${k}`;
      item.data = { teste: true };
      item.sectorId = sectors[Math.floor(Math.random() * sectors.length)].id;
      item.savedAt = new Date().toISOString();
      return item;
    });*/

    /*const sectorRepo = this.db.getRepository(SectorEntity);
    await sectorRepo.save(sectors, { chunk: 50 });

    const itemRepo = this.db.getRepository(ItemEntity);
    await itemRepo.save(items, { chunk: 50 });*/

    // await this.db.synchronize(true);
  }

  find<T>(
    entityId: string | null,
    query?: CreateQueryParams
  ): Observable<IaRestResponse<T>> {
    if (!entityId) {
      throw new Error('Entity not defined');
    }
    if (!this.db) {
      throw new Error('Db not defined');
    }
    if (!this.entities[entityId]) {
      throw new Error('Entity repository not defined');
    }

    let order = {};
    if (query?.sort) {
      if (!Array.isArray(query.sort)) {
        order = { [query.sort.field]: query?.sort.order };
      }
    }

    const filter: any = query?.filter;

    const findOptions: FindManyOptions = {
      take: query?.limit,
      skip: query?.page && query?.limit ? (query.page - 1) * query.limit : 0,
      order,
      ...(filter ? { where: { [filter.field]: filter.value } } : null),
    };
    console.log({ findOptions });
    const result = this.db.manager.findAndCount<any>(entityId, findOptions);

    return of(result).pipe(
      switchMap((res) => {
        return res.then((rs) => {
          const [data, total] = rs;
          return {
            data,
            total,
          };
        });
      }),
      map((res) => {
        const { total, data } = res;
        const count = data.length;
        const pageCount = query?.limit ? Math.ceil(total / query.limit) : 0;
        const page = query?.page ? query?.page : 1;
        console.log({
          count,
          data,
          page,
          pageCount,
          total,
        });
        return {
          count,
          data,
          page,
          pageCount,
          total,
        };
      })
    );
  }

  get(entityId: string | null, id: string) {
    console.log('get', entityId);
    if (!entityId) {
      throw new Error('Entity not defined');
    }
    if (!id) {
      throw new Error('Id not defined');
    }
    if (!this.db) {
      throw new Error('Db not defined');
    }
    if (!this.entities[entityId]) {
      throw new Error('Entity repository not defined');
    }
    const entityRepo = this.entities[entityId];
    console.log({ entityRepo });
    const repo = this.db.getRepository(entityRepo);
    console.log({ repo });

    const result = repo.findOneOrFail({where: {id}});

    return of(result)
      .pipe(
        switchMap((res) => {
          return res.then((rs) => {
            return rs;
          });
        })
      )
      .toPromise();
  }

  async save<T>(entityId: string | null, data: T) {
    console.log('save', entityId, data);
    await this.auth.currentUser
      .pipe(
        filter((user) => user !== false),
        first()
      )
      .toPromise();

    if (!entityId) {
      throw new Error('Entity not defined');
    }
    const entityRepo = this.entities[entityId];
    console.log({ entityRepo });
    const repo = this.db?.getRepository(entityRepo);
    console.log({ repo });
    // const savedAt = new Date().toISOString();
    const result = await repo?.save({ ...data });

    try{
      const saved = await this.sqlite.saveToStore('seyconeldb');
      console.log({saved})
    } catch(err){
      console.log({err})
    }

    return result;
  }
}
