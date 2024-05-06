import { Component, OnInit } from '@angular/core';
import {
  AlertController,
  LoadingController,
  NavController,
} from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { filter, first } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { SqliteDatabaseService } from '../../services/sqlite-database.service';

@Component({
  selector: 'seyconel-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {
  totalWaitingForSync? = 0;
  lastSyncUpdate: string | null = null;

  constructor(
    public auth: AuthService,
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private db: SqliteDatabaseService,
    private storage: Storage
  ) {}

  async ngOnInit() {
    this.lastSyncUpdate = await this.storage.get('lastSyncUpdate');
  }

  async ionViewDidEnter() {
    await this.getTotalWaitingForSync();
  }

  async getTotalWaitingForSync() {
    await this.db.ready
      .pipe(
        filter((res) => res !== false),
        first()
      )
      .toPromise();
    this.totalWaitingForSync = await this.db?.totalWaitingForSync();
  }

  async postSync() {
    const alert = await this.alertCtrl.create({
      header: 'Sincronizar com servidor',
      message:
        'Tem certeza que deseja salvar todos Clientes, Vistorias, Setores e Itens no servidor?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Sincronizar',
          handler: async () => {
            const loader = await this.loadingCtrl.create({
              message: 'Salvando dados no servidor',
            });
            await loader.present();
            await this.db.ready
              .pipe(
                filter((res) => res !== false),
                first()
              )
              .toPromise();
            const res = await this.db?.postSync();
            this.lastSyncUpdate = new Date().toISOString();
            await this.storage.set('lastSyncUpdate', this.lastSyncUpdate);
            await this.getTotalWaitingForSync();
            await loader.dismiss();
          },
        },
      ],
    });
    await alert.present();
  }

  login() {
    this.navCtrl.navigateForward('/login');
  }

  async logout() {
    const alert = await this.alertCtrl.create({
      header: 'Sair',
      message: 'Você tem certeza que deseja sair?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Sair',
          role: 'destroy',
          handler: () => {
            this.auth.logout();
          },
        },
      ],
    });
    await alert.present();
  }
}
