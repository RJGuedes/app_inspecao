import { Injectable } from '@angular/core';

import { NavController } from '@ionic/angular';
import { filter, first } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
@Injectable()
export class AuthGuard  {
  constructor(public auth: AuthService, public navCtrl: NavController) {}
  async canActivate() {
    const user = await this.auth.currentUser
      .pipe(
        filter((data) => data !== false),
        first()
      )
      .toPromise();
    if (!user) {
      await this.navCtrl.navigateRoot('/login');
      return false;
    }
    return true;
  }
}
