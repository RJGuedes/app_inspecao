import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@capacitor/splash-screen';
import { SqliteDatabaseService } from './services/sqlite-database.service';
import { SQLiteService } from './services/sqlite.service';

@Component({
  selector: 'seyconel-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private platform: Platform,
    private sqlite: SQLiteService,
    private sqliteDatabase: SqliteDatabaseService,
  ) {}

  public isWeb: boolean = false;
  private initPlugin: boolean = false;

  async ngOnInit() {
    // await this.localDb.loadCustomers()
    await this.platform.ready();
    // this.initWs();
    SplashScreen.hide();

    //await this.sqlite.init();
    this.initializeApp();
    // await this.localDb.getSync();
  }



  initializeApp() {
      this.sqlite.initializePlugin().then(async (ret) => {
        this.initPlugin = ret;
        if( this.sqlite.platform === "web") {
          this.isWeb = true;
          await customElements.whenDefined('jeep-sqlite');
          const jeepSqliteEl = document.querySelector('jeep-sqlite');
          if(jeepSqliteEl != null) {
            await this.sqlite.initWebStore();
            console.log(`>>>> isStoreOpen ${await jeepSqliteEl.isStoreOpen()}`);
            this.sqliteDatabase.init()
          } else {
            console.log('>>>> jeepSqliteEl is null');
          }
        }

        console.log(`>>>> in App  this.initPlugin ${this.initPlugin}`);
      });
  }

  /*initWs() {
    this.socket.on('connect', () => {
      console.log('ws connect');
      setTimeout(() => {
        const res = this.socket.emit('events', { msg: 123 });
        console.log({ res });
      }, 5000);
    });

    this.socket.on('ws disconnect', () => {
      console.log('disconnect');
    });

    this.socket.fromEvent('events').subscribe((data) => {
      console.log('ws events', data);
    });
  }*/
}
