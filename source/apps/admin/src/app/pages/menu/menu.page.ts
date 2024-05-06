import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { appConfig } from '@seyconel/config';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'seyconel-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {
  public appConfig = appConfig;
  public entityPages = Object.keys(appConfig.entities)
    .map((id) => ({ ...appConfig.entities[id] }))
    .filter(({ actions }) =>
      actions ? actions?.indexOf('list') > -1 : actions
    )
    .map(({ label, icon, id }) => ({ label, icon, url: `/admin/${id}/list` }));

  public appPages = [
    { label: 'Resumo', icon: 'speedometer', url: '/admin/dashboard' },
    ...this.entityPages,
    // { label: 'Relatórios', icon: 'print', url: '/admin/print' },
  ];

  public currentUrl = '';
  constructor(
    private navCtrl: NavController,
    private router: Router,
    public auth: AuthService
  ) {}

  ngOnInit() {
    this.router.events.subscribe((evt) => {
      if (evt instanceof NavigationEnd) {
        this.currentUrl = evt.url;
      }
    });
  }

  navTo(url: string) {
    this.navCtrl.navigateRoot(url);
  }

  isMenuSelected(p: any) {
    const baseUrl = p.url.replace('/list', '');
    const isSelected = this.currentUrl.indexOf(baseUrl) === 0;
    return isSelected;
  }
}
