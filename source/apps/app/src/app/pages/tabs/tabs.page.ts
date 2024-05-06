import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { first } from 'rxjs/operators';
import { SqliteDatabaseService } from '../../services/sqlite-database.service';

@Component({
  selector: 'seyconel-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
})
export class TabsPage {
  constructor(
    private sqlite: SqliteDatabaseService,
    private navCtrl: NavController,
    private router: Router
  ) {}

  async add() {
    // await this.sqlite.ready.toPromise();
    // await this.sqlite.initTables();
    const paths = this.router.url.split('/');
    const path = paths[paths.length - 1];
    console.log({ path });

    if (path === 'customers') {
      return this.navCtrl.navigateForward(`/form/${path}`);
    }
    if (path === 'surveys') {
      const customerId = paths[paths.length - 2];
      return this.navCtrl.navigateForward(`/form/${path}`, {
        queryParams: { customerId },
      });
    }
    if (path === 'sectors') {
      const customerId = paths[paths.length - 4];
      const surveyId = paths[paths.length - 2];
      return this.navCtrl.navigateForward(`/form/${path}`, {
        queryParams: { customerId, surveyId },
      });
    }
    if (path === 'items') {
      const customerId = paths[paths.length - 6];
      const surveyId = paths[paths.length - 4];
      const sectorId = paths[paths.length - 2];
      return this.navCtrl.navigateForward(`/form/${path}`, {
        queryParams: { customerId, surveyId, sectorId },
      });
    }
    if (path === 'account') {
      return this.navCtrl.navigateRoot(`/tabs/customers`);
    }
    return;
  }
}
