import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  AlertController,
  LoadingController,
  NavController,
  Platform,
} from '@ionic/angular';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'seyconel-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  form = new FormGroup<any>({});
  model = { email: '', password: '' };
  fields: FormlyFieldConfig[] = [
    {
      key: 'email',
      type: 'input',
      templateOptions: {
        labelPosition: 'stacked',
        label: 'E-mail',
        type: 'email',
        required: true,
      },
    },
    {
      key: 'password',
      type: 'input',
      templateOptions: {
        labelPosition: 'stacked',
        label: 'Senha',
        type: 'password',
        required: true,
      },
    },
  ];

  constructor(
    private navCtrl: NavController,
    public auth: AuthService,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController
  ) {}

  forgot() {
    this.navCtrl.navigateForward('forgot');
  }

  ngOnInit() {}

  async onSubmit() {
    const loader = await this.loadingCtrl.create();
    await loader.present();
    console.log('login', this.model);
    try {
      const result = await this.auth
        .login(this.model.email, this.model.password)
        .toPromise();
      const { token } = result;
      await loader.dismiss();

      this.navCtrl.navigateRoot('/admin');
    } catch (err:any) {
      console.error(err);
      await loader.dismiss();

      const alert = await this.alertCtrl.create({
        header: 'Erro!',
        message:
          err && err?.error && err?.error?.message
            ? err?.error?.message
            : 'Erro fatal',
        buttons: ['Ok'],
      });
      await alert.present();
      this.form.get('password')?.setValue(null);
      this.form.get('password')?.clearValidators();
      this.form.get('password')?.markAsPristine();
      this.form.get('password')?.markAsUntouched();
      this.form.get('password')?.clearAsyncValidators();
      this.form.get('password')?.reset();
    }
  }
}
