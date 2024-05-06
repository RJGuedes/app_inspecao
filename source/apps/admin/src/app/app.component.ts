import { Component, OnDestroy, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { appConfig } from '@seyconel/config';
import { Subscription } from 'rxjs';
import { AuthService } from './services/auth.service';
import { RestDatabaseService } from './services/rest-database.service';
@Component({
  selector: 'seyconel-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  public appConfig = appConfig;

  private auth$!: Subscription;

  constructor(
    private storage: Storage,
    private auth: AuthService,
    private rest: RestDatabaseService
  ) {}

  async ngOnInit() {
    const storage = await this.storage.create();
  }
  async ngOnDestroy() {
    if (this.auth$) {
      this.auth$.unsubscribe();
    }
  }
}
