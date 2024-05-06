import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'seyconel-logout',
  templateUrl: './logout.page.html',
  styleUrls: ['./logout.page.scss'],
})
export class LogoutPage implements OnInit {
  constructor(private auth: AuthService, private navCtrl: NavController) {}

  async ngOnInit() {
    await this.auth.logout();
    setTimeout(() => {
      this.navCtrl.navigateRoot('/login');
    }, 500);
  }
}
