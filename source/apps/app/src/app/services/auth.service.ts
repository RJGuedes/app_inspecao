import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Storage } from '@ionic/storage-angular';
export class User {
  id?: number;
  email!: string;
  name!: string;
  token?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject!: BehaviorSubject<User | null | false>;
  public currentUser!: Observable<any>;

  constructor(private http: HttpClient, private storage: Storage) {
    this.currentUserSubject = new BehaviorSubject<User | null | false>(false);
    this.currentUser = this.currentUserSubject.asObservable();
    this.checkUser();
  }

  async checkUser() {
    console.log('checkUser');
    await this.storage.create();
    const user = await this.storage.get('iaAuth');
    this.currentUserSubject.next(user ? user : null);
  }

  public get currentUserValue(): User | null | false {
    return this.currentUserSubject.value;
  }

  login(email: string, password: string) {
    return this.http
      .post<any>(`${environment.apiUrl}/auth/authenticate`, {
        email,
        password,
      })
      .pipe(
        map(async (res) => {
          console.log('iaAuth');
          // localStorage.setItem('iaAuth', JSON.stringify(user));
          await this.storage.set('iaAuth', res);
          this.currentUserSubject.next(res);
          return res;
        })
      );
  }

  async logout() {
    // remove user from local storage to log user out
    await this.storage.remove('iaAuth');
    this.currentUserSubject.next(null);
  }
}
