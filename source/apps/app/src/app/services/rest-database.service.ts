import { Injectable } from '@angular/core';
import { IaBaseInterface, IaObject } from '@seyconel/config';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { CreateQueryParams, RequestQueryBuilder } from '@dataui/crud-request';
import { environment } from '../../environments/environment';
import { Storage } from '@ionic/storage';
import { AuthService } from '../services/auth.service';
import { catchError, filter, first, switchMap } from 'rxjs/operators';
import { NavController } from '@ionic/angular';

export interface IaRestResponse {
  data: IaObject[];
  count: number;
  total: number;
  page: number;
  pageCount: number;
}

@Injectable({
  providedIn: 'root',
})
export class RestDatabaseService {
  uniqueKey = 'id';

  constructor(
    private http: HttpClient,
    private storage: Storage,
    private auth: AuthService,
    private navCtrl: NavController
  ) {}

  private async getHeaders() {
    const res: any = await this.storage.get('iaAuth');
    const token = res.token;
    return await this.headers(token);
  }

  public headers(token: string) {
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  find<T>(
    entityId: string | null,
    query?: CreateQueryParams
  ): Observable<T & IaRestResponse> {
    if (!entityId) {
      throw new Error('Entity not defined');
    }
    let queryString: string;
    if (query) {
      console.log('find', entityId, { query });

      if (query.search && Object.keys(query.search).length < 1) {
        delete query.search;
      }

      queryString = RequestQueryBuilder.create(query).query();
    }

    return this.auth.currentUser.pipe(
      filter((user) => user !== false),
      first(),
      switchMap((user) => {
        return this.http
          .get<IaRestResponse>(
            `${environment.apiUrl}/${entityId}${
              queryString ? '?' + queryString : ''
            }`,
            {
              ...(user && user.token
                ? { headers: this.headers(user.token) }
                : null),
            }
          )
          .pipe(
            catchError((err) => {
              console.log('catchError!', err);
              if (err.status === 401) {
                this.navCtrl.navigateRoot('/logout');
              }
              return of(err);
            })
          );
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

    return this.auth.currentUser
      .pipe(
        filter((user) => user !== false),
        first(),
        switchMap((user) => {
          console.log({ user });
          return this.http
            .get<IaObject>(`${environment.apiUrl}/${entityId}/${id}`, {
              ...(this.headers ? { headers: this.headers(user.token) } : null),
            })
            .pipe(
              catchError((err) => {
                console.log('catchError!', err);
                if (err.status === 401) {
                  this.navCtrl.navigateRoot('/logout');
                }
                return of(err);
              })
            );
        })
      )
      .toPromise();
  }

  async save(entityId: string | null, data: IaObject) {
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
    return this.uniqueKeysExists(data)
      ? await this.update(entityId, data)
      : await this.create(entityId, data);
  }

  create(entityId: string, data: IaObject) {
    console.log('create', entityId, data);

    return this.auth.currentUser
      .pipe(
        filter((user) => user !== false),
        first(),
        switchMap((user) => {
          return this.http
            .post<IaObject>(`${environment.apiUrl}/${entityId}`, data, {
              ...(user.token ? { headers: this.headers(user.token) } : null),
            })
            .pipe(
              catchError((err) => {
                console.log('catchError!', err);
                if (err.status === 401) {
                  this.navCtrl.navigateRoot('/logout');
                }
                return of(err);
              })
            );
        })
      )
      .toPromise();
  }

  update(entityId: string, data: IaObject) {
    const id = data[this.uniqueKey];
    console.log('update', entityId, id, data);
    return this.auth.currentUser
      .pipe(
        filter((user) => user !== false),
        first(),
        switchMap((user) => {
          return this.http
            .patch<IaObject>(`${environment.apiUrl}/${entityId}/${id}`, data, {
              ...(user.token ? { headers: this.headers(user.token) } : null),
            })
            .pipe(
              catchError((err) => {
                console.log('catchError!', err);
                if (err.status === 401) {
                  this.navCtrl.navigateRoot('/logout');
                }
                return of(err);
              })
            );
        })
      )
      .toPromise();
  }

  async remove(entityId: string | null, id: string) {
    console.log('remove', entityId, id);
    return this.auth.currentUser
      .pipe(
        filter((user) => user !== false),
        first(),
        switchMap((user) => {
          return this.http
            .delete<IaObject>(`${environment.apiUrl}/${entityId}/${id}`, {
              ...(user.token ? { headers: this.headers(user.token) } : null),
            })
            .pipe(
              catchError((err) => {
                console.log('catchError!', err);
                if (err.status === 401) {
                  this.navCtrl.navigateRoot('/logout');
                }
                return of(err);
              })
            );
        })
      )
      .toPromise();
  }

  async syncToServer(entityId: string, data: IaBaseInterface[]) {
    const user = await this.auth.currentUser
      .pipe(
        filter((user) => user !== false),
        first()
      )
      .toPromise();
    console.log('syncToServer', { entityId, data });
    if (!user) {
      return;
    }
    const result = await this.http
      .post<IaBaseInterface[]>(
        `${environment.apiUrl}/sync/${entityId}`,
        { data },
        {
          ...(user.token ? { headers: this.headers(user.token) } : null),
        }
      )
      .toPromise();
    return result;
  }

  upload(photoInput: Blob | null, extension: string, photoData: any) {
    console.log('upload', photoInput);

    const data = new FormData();
    if (photoInput !== null) {
      data.append('photo', photoInput, `photo.${extension}`);
    }
    if (photoData) {
      data.append('data', JSON.stringify(photoData));
    }

    return this.auth.currentUser
      .pipe(
        filter((user) => user !== false),
        first(),
        switchMap((user) => {
          return this.http.post<IaObject>(
            `${environment.apiUrl}/photos/upload`,
            data,
            {
              ...(user.token ? { headers: this.headers(user.token) } : null),
            }
          );
        })
      )
      .toPromise();
  }

  private uniqueKeysExists(data: IaObject) {
    const uniqueKey = this.uniqueKey as keyof IaObject;
    return !(data[uniqueKey] === undefined || data[uniqueKey] === null);
  }
}
