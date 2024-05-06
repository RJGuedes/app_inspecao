import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { AuthService } from '../services/auth.service';
import { CustomerEntity, CustomerInterface } from '../entities/customer.entity';
import { LoadingController, NavController } from '@ionic/angular';
import { RestDatabaseService } from './rest-database.service';
import { first } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import { SurveyInterface } from '../entities';
import { SqliteDatabaseService } from './sqlite-database.service';

@Injectable({
  providedIn: 'root',
})
export class LocalDatabaseService {
  uniqueKey = 'id';

  constructor(
    private rest: RestDatabaseService,
    private storage: Storage,
    private auth: AuthService,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private sqlite: SqliteDatabaseService
  ) {}

  init() {
    this.storage.create();

    // Verificar alteração de clientes
    // Se tiver alterações, rodar o script
    // Verificar alterações do db local nao sincronizados
  }

  async getSync() {
    const loader = await this.loadingCtrl.create();
    await loader.present();
    // await loader.present();
    const data: any = await this.rest
      .find<{ customers: CustomerInterface[]; surveys: SurveyInterface[] }>(
        'sync'
      )
      .pipe(first())
      .toPromise();
    const { customers, surveys } = data;

    for (const [k, customer] of customers.entries()) {
      loader.message = `Clientes: ${k + 1} / ${customers.length}`;
      await this.sqlite.save<CustomerInterface>('customers', {
        ...customer,
        sync: true,
      });
      await new Promise((resolve) => setTimeout(resolve, 300));
    }

    for (const [k, survey] of surveys.entries()) {
      loader.title = '';
      loader.message = `Vistorias: ${k + 1} / ${surveys.length}`;
      await this.sqlite.save<CustomerInterface>('surveys', {
        ...survey,
        sync: true,
      });
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
    await loader.dismiss();

    return { customers, surveys };
  }

  find() {}
}
